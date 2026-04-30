/**
 * ESLint rule: require design system CSS imports for used BEM blocks.
 *
 * If a React component uses className attributes containing BEM blocks
 * from the design system, this rule verifies the corresponding
 * per-component CSS file is imported.
 *
 * The mapping from BEM block → CSS filename is loaded from
 * @danskernesdigitalebibliotek/dpl-design-system/build/block-css-map.json.
 * Blocks that match their CSS filename don't need the map.
 */

const path = require("path");

const DS_CSS_PREFIX =
  "@danskernesdigitalebibliotek/dpl-design-system/build/css/components/";

// No default ignore patterns — all patterns should be configured
// via the ignorePatterns option in the ESLint config.
const DEFAULT_IGNORE_PATTERNS = [];

/**
 * Extract the BEM block name from a class.
 */
function getBemBlock(className, utilityPatterns) {
  for (const pattern of utilityPatterns) {
    if (pattern.test(className)) return null;
  }

  const elementMatch = className.match(/^([a-z][a-z0-9-]*?)__/);
  if (elementMatch) return elementMatch[1];

  const modifierMatch = className.match(/^([a-z][a-z0-9-]*?)--/);
  if (modifierMatch) return modifierMatch[1];

  return className;
}

function getClassesFromString(value) {
  return value.split(/\s+/).filter(Boolean);
}

/**
 * Extract static class names from a JSX expression.
 */
function extractClasses(node) {
  if (!node) return [];

  if (node.type === "Literal" && typeof node.value === "string") {
    return getClassesFromString(node.value);
  }

  if (node.type === "TemplateLiteral") {
    const classes = [];
    for (const quasi of node.quasis) {
      classes.push(...getClassesFromString(quasi.value.raw));
    }
    return classes;
  }

  if (node.type === "JSXExpressionContainer") {
    return extractClasses(node.expression);
  }

  if (
    node.type === "CallExpression" &&
    node.callee &&
    (node.callee.name === "clsx" || node.callee.name === "classnames")
  ) {
    const classes = [];
    for (const arg of node.arguments) {
      if (arg.type === "Literal" && typeof arg.value === "string") {
        classes.push(...getClassesFromString(arg.value));
      }
      if (arg.type === "ObjectExpression") {
        for (const prop of arg.properties) {
          if (prop.key) {
            const key =
              prop.key.type === "Literal"
                ? prop.key.value
                : prop.key.type === "Identifier"
                  ? prop.key.name
                  : null;
            if (key && typeof key === "string") {
              classes.push(...getClassesFromString(key));
            }
          }
        }
      }
    }
    return classes;
  }

  return [];
}

// Set of CSS filenames that exist in the design system build.
let availableCssFiles = null;
function getAvailableCssFiles() {
  if (availableCssFiles) return availableCssFiles;
  availableCssFiles = new Set();
  try {
    const dir = path.resolve(
      path.dirname(
        require.resolve("@danskernesdigitalebibliotek/dpl-design-system/package.json")
      ),
      "build",
      "css",
      "components"
    );
    const fs2 = require("fs");
    if (fs2.existsSync(dir)) {
      for (const f of fs2.readdirSync(dir)) {
        if (f.endsWith(".css") && !f.endsWith(".css.map")) {
          availableCssFiles.add(path.basename(f, ".css"));
        }
      }
    }
  } catch {
    // Fall back to empty set
  }
  return availableCssFiles;
}

/**
 * Resolve which CSS file provides a given BEM block.
 * Returns the CSS filename (without extension) or null if no matching file.
 */
function resolveCssFile(block) {
  if (getAvailableCssFiles().has(block)) {
    return block;
  }
  return null;
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require design system CSS imports for BEM blocks used in className"
    },
    schema: [
      {
        type: "object",
        properties: {
          ignorePatterns: {
            type: "array",
            items: { type: "string" }
          },
          ignoreBlocks: {
            type: "array",
            items: { type: "string" },
            description: "Block names to ignore (not from design system)"
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      missingCssImport:
        'BEM block "{{block}}" requires CSS import: import "{{importPath}}"'
    }
  },

  create(context) {
    const options = context.options[0] || {};
    const utilityPatterns = [
      ...DEFAULT_IGNORE_PATTERNS,
      ...(options.ignorePatterns || []).map((p) => new RegExp(p))
    ];
    const ignoreBlocks = new Set(options.ignoreBlocks || []);

    const importedCssFiles = new Set();
    const usedBlocks = new Map(); // block → first node that uses it

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (source.startsWith(DS_CSS_PREFIX) && source.endsWith(".css")) {
          const name = path.basename(source, ".css");
          importedCssFiles.add(name);
        }
      },

      JSXAttribute(node) {
        if (node.name.name !== "className") return;

        const classes = extractClasses(node.value);
        for (const cls of classes) {
          const block = getBemBlock(cls, utilityPatterns);
          if (block && !ignoreBlocks.has(block) && !usedBlocks.has(block)) {
            usedBlocks.set(block, node);
          }
        }
      },

      "Program:exit"() {
        for (const [block, node] of usedBlocks) {
          const cssFile = resolveCssFile(block);
          if (!cssFile) continue;

          // Check if this CSS file (or the block itself as filename) is imported
          if (!importedCssFiles.has(cssFile) && !importedCssFiles.has(block)) {
            context.report({
              node,
              messageId: "missingCssImport",
              data: {
                block,
                importPath: `${DS_CSS_PREFIX}${cssFile}.css`
              }
            });
          }
        }
      }
    };
  }
};

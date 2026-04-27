/**
 * ESLint rule: enforce single BEM block per element
 *
 * Flags className attributes that contain classes from multiple BEM blocks.
 * A BEM block is identified as the prefix before __ (element) or -- (modifier).
 *
 * Third-party classes (matching configurable patterns) are ignored.
 */

// Default patterns for third-party classes that should be ignored.
// Override via the `ignorePatterns` option in .eslintrc.
const DEFAULT_IGNORE_PATTERNS = [];

/**
 * Extract the BEM block name from a class.
 * Returns null if the class is a utility.
 */
function getBemBlock(className, utilityPatterns) {
  // Check if it's a utility class
  for (const pattern of utilityPatterns) {
    if (pattern.test(className)) {
      return null;
    }
  }

  // Extract block name (everything before __ or --)
  const elementMatch = className.match(/^([a-z][a-z0-9-]*?)__/);
  if (elementMatch) {
    return elementMatch[1];
  }

  const modifierMatch = className.match(/^([a-z][a-z0-9-]*?)--/);
  if (modifierMatch) {
    return modifierMatch[1];
  }

  // No __ or -- means it's a block name itself
  return className;
}

/**
 * Extract class names from a string literal.
 */
function getClassesFromString(value) {
  return value.split(/\s+/).filter(Boolean);
}

/**
 * Try to extract static class names from a JSX expression.
 * Handles: string literals, template literals (static parts),
 * and clsx/classnames calls with string arguments.
 */
function extractClasses(node) {
  if (!node) return [];

  // String literal: className="foo bar"
  if (node.type === "Literal" && typeof node.value === "string") {
    return getClassesFromString(node.value);
  }

  // Template literal: className={`foo ${expr}`}
  if (node.type === "TemplateLiteral") {
    const classes = [];
    for (const quasi of node.quasis) {
      classes.push(...getClassesFromString(quasi.value.raw));
    }
    return classes;
  }

  // JSX expression container: className={...}
  if (node.type === "JSXExpressionContainer") {
    return extractClasses(node.expression);
  }

  // Function call: clsx(...) or classnames(...)
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
      // Object expression: { "class-name": condition }
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

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce that className attributes contain classes from at most one BEM block",
    },
    schema: [
      {
        type: "object",
        properties: {
          ignorePatterns: {
            type: "array",
            items: { type: "string" },
            description:
              "Regex patterns for third-party classes to ignore (as strings)",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      multipleBemBlocks:
        'Element has classes from multiple BEM blocks: {{blocks}}. Each element should belong to a single BEM block.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const utilityPatterns = options.ignorePatterns
      ? options.ignorePatterns.map((p) => new RegExp(p))
      : DEFAULT_IGNORE_PATTERNS;

    return {
      JSXAttribute(node) {
        if (node.name.name !== "className") return;

        const classes = extractClasses(node.value);
        if (classes.length === 0) return;

        const blocks = new Set();
        for (const cls of classes) {
          const block = getBemBlock(cls, utilityPatterns);
          if (block) {
            blocks.add(block);
          }
        }

        if (blocks.size > 1) {
          context.report({
            node,
            messageId: "multipleBemBlocks",
            data: {
              blocks: Array.from(blocks).join(", "),
            },
          });
        }
      },
    };
  },
};

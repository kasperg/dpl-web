/**
 * Generate a mapping from BEM block names to per-component CSS filenames.
 *
 * Scans compiled CSS files in build/css/components/ and extracts all
 * class selectors to build a reverse map: { blockName: "css-filename" }.
 *
 * For most components the block name matches the filename (e.g.
 * .disclosure → disclosure.css). This map covers the exceptions.
 *
 * Output: build/block-css-map.json
 * Usage: node scripts/generate-block-css-map.js
 */

const fs = require("fs");
const path = require("path");

const COMPONENTS_DIR = path.resolve(__dirname, "..", "build", "css", "components");
const OUTPUT_FILE = path.resolve(__dirname, "..", "build", "block-css-map.json");

/**
 * Extract the BEM block name from a class selector.
 * Returns the prefix before __ or -- (or the whole name if neither).
 */
function getBemBlock(className) {
  const elementMatch = className.match(/^([a-z][a-z0-9-]*?)__/);
  if (elementMatch) return elementMatch[1];

  const modifierMatch = className.match(/^([a-z][a-z0-9-]*?)--/);
  if (modifierMatch) return modifierMatch[1];

  return className;
}

/**
 * Extract all class selectors from a CSS string.
 */
function extractClassSelectors(css) {
  const classes = new Set();
  // Match .classname in selectors (not inside strings or comments)
  const regex = /\.([a-z][a-z0-9_-]*)/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    classes.add(match[1]);
  }
  return classes;
}

function main() {
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(`Components directory not found: ${COMPONENTS_DIR}`);
    console.error("Run 'yarn build' first to generate the CSS files.");
    process.exit(1);
  }

  const cssFiles = fs
    .readdirSync(COMPONENTS_DIR)
    .filter((f) => f.endsWith(".css") && !f.endsWith(".css.map"));

  const map = {};

  for (const file of cssFiles) {
    const componentName = path.basename(file, ".css");
    const css = fs.readFileSync(path.join(COMPONENTS_DIR, file), "utf8");
    const classes = extractClassSelectors(css);
    const blocks = new Set();

    for (const cls of classes) {
      blocks.add(getBemBlock(cls));
    }

    for (const block of blocks) {
      // Only add to map if block doesn't match filename
      // (matching blocks can be derived without the map)
      if (block !== componentName) {
        if (map[block]) {
          // Block appears in multiple CSS files — use array
          if (Array.isArray(map[block])) {
            if (!map[block].includes(componentName)) {
              map[block].push(componentName);
            }
          } else if (map[block] !== componentName) {
            map[block] = [map[block], componentName];
          }
        } else {
          map[block] = componentName;
        }
      }
    }
  }

  // Sort by key for stable output
  const sorted = {};
  for (const key of Object.keys(map).sort()) {
    sorted[key] = map[key];
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sorted, null, 2) + "\n");
  console.log(
    `Generated ${OUTPUT_FILE} with ${Object.keys(sorted).length} block→css mappings`
  );
}

main();

const path = require("path");
const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");

// Generate per-component entry points by parsing base.scss imports.
function getComponentEntries() {
  const entries = {};
  const base = fs.readFileSync(path.resolve(__dirname, "base.scss"), "utf8");
  const importRegex = /^@import\s+["']\.\/(.+?)["'];?\s*$/gm;
  let match;

  while ((match = importRegex.exec(base)) !== null) {
    const importPath = match[1];
    // Only include component files (stories/), not global styles.
    if (!importPath.startsWith("src/stories/")) continue;

    const scssFile = `${importPath}.scss`;
    if (!fs.existsSync(path.resolve(__dirname, scssFile))) continue;

    const name = path.basename(importPath);
    entries[`components/${name}`] = `./${scssFile}`;
  }

  return entries;
}

// additionalData function that handles @use rules (must come before @import).
function additionalData(content) {
  const useMatch = content.match(/^(@use\s[^\n]+\n)+/);
  if (useMatch) {
    return (
      useMatch[0] + '@import "tools-compile";\n' + content.slice(useMatch[0].length)
    );
  }
  return '@import "tools-compile";\n' + content;
}

const toolsIncludePath = path.resolve(__dirname, "src", "styles", "scss");

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: {
    base: "./base.scss",
    foundation: "./foundation.scss",
    wysiwyg: "./wysiwyg.scss",
    "admin-base": "./admin-base.scss",
    ...getComponentEntries(),
  },
  output: {
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sourceMap: true, // Required for resolve-url-loader
              additionalData,
              sassOptions: {
                style: "compressed",
                loadPaths: [toolsIncludePath],
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2)$/,
        type: "asset/resource",
        generator: { filename: "fonts/[name][ext]" },
      },
    ],
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({ filename: "css/[name].css" }),
    new CopyPlugin({
      patterns: [
        { from: "public/icons", to: "icons" },
        {
          from: "src/**/*.js",
          to: ({ absoluteFilename }) => `js/${path.basename(absoluteFilename)}`,
        },
      ],
    }),
  ],
  optimization: {
    // Sass handles CSS compression via sassOptions.style: "compressed".
    // Disabling minimize prevents terser from minifying copied JS files.
    minimize: false,
  },
};

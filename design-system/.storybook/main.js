const path = require("path");
const StylelintPlugin = require("stylelint-webpack-plugin");

// Recursively find and patch sass-loader instances in webpack rules
// to inject tools (variables, mixins, placeholders) into every SCSS file.
// This enables per-component SCSS loading where each file compiles independently.
function patchSassLoaders(rules) {
  if (!Array.isArray(rules)) return;
  for (const rule of rules) {
    if (rule.oneOf) {
      patchSassLoaders(rule.oneOf);
    }
    if (rule.use && Array.isArray(rule.use)) {
      for (let i = 0; i < rule.use.length; i++) {
        const loader = rule.use[i];
        const loaderPath =
          typeof loader === "string" ? loader : loader?.loader;
        if (loaderPath && loaderPath.includes("sass-loader")) {
          if (typeof loader === "string") {
            rule.use[i] = {
              loader,
              options: {
                additionalData: (content) => {
                  const useMatch = content.match(/^(@use\s[^\n]+\n)+/);
                  if (useMatch) {
                    return useMatch[0] + '@import "tools-compile";\n' + content.slice(useMatch[0].length);
                  }
                  return '@import "tools-compile";\n' + content;
                },
                sassOptions: {
                  includePaths: [
                    path.resolve(__dirname, "..", "src", "styles", "scss"),
                  ],
                },
              },
            };
          } else {
            loader.options = loader.options || {};
            loader.options.additionalData = (content) => {
              // @use rules must come before @import. Insert tools after any @use.
              const useMatch = content.match(/^(@use\s[^\n]+\n)+/);
              if (useMatch) {
                return useMatch[0] + '@import "tools-compile";\n' + content.slice(useMatch[0].length);
              }
              return '@import "tools-compile";\n' + content;
            };
            loader.options.sassOptions = loader.options.sassOptions || {};
            loader.options.sassOptions.includePaths = [
              ...(loader.options.sassOptions.includePaths || []),
              path.resolve(__dirname, "..", "src", "styles", "scss"),
            ];
          }
        }
      }
    }
  }
}

module.exports = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ["../public"],

  addons: [
    "@storybook/addon-links",
    "@storybook/preset-create-react-app",
    "@whitespace/storybook-addon-html",
    "@storybook/addon-designs",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],

  typescript: {
    check: true,
    checkOptions: {},
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },

  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  core: {
    allowedHosts: ["localhost", ".local"],
  },

  webpackFinal: async (config) => {
    // Remove the ESLint webpack plugin added by create-react-app preset.
    // It cannot resolve eslint-plugin-local-rules from its own node_modules.
    // Linting is handled separately via yarn js:lint.
    config.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== "ESLintWebpackPlugin"
    );
    config.plugins.push(
      new StylelintPlugin({
        files: "src/**/*.scss",
      })
    );

    // Patch sass-loader to prepend tools (variables, mixins, placeholders)
    // to every SCSS file, enabling per-component SCSS loading.
    patchSassLoaders(config.module.rules);

    return config;
  },
};

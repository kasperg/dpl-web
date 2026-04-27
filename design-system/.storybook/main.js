const StylelintPlugin = require("stylelint-webpack-plugin");

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
    return config;
  },
};

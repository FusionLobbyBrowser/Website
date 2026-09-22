const { defineConfig } = require("eslint/config");
const eslintConfigESLintBase = require("eslint-config-eslint/base");
const eslintConfigESLintCJS = require("eslint-config-eslint/cjs");

module.exports = defineConfig([
  {
    files: ["scripts/*.js"],
    extends: [eslintConfigESLintBase],
  },
  {
    files: ["eslint.config.js", ".eleventy.js", "tools/*.js"],
    extends: [eslintConfigESLintCJS],
  },
]);

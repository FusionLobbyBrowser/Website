const { defineConfig } = require("eslint/config");
const eslintConfigESLintBase = require("eslint-config-eslint/base");
const eslintConfigESLintCJS = require("eslint-config-eslint/cjs");
const eslintConfigESLintFormatting = require("eslint-config-eslint/formatting");

module.exports = defineConfig([
  {
    files: ["scripts/*.js"],
    extends: [eslintConfigESLintBase, eslintConfigESLintFormatting],
  },
  {
    files: ["eslint.config.js", ".eleventy.js", "tools/*.js"],
    extends: [eslintConfigESLintCJS, eslintConfigESLintFormatting],
  },
]);

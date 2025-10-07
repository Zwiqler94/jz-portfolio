/* Flat ESLint config for the Angular workspace. */

const eslint = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const angularPlugin = require("@angular-eslint/eslint-plugin");
const angularTemplatePlugin = require("@angular-eslint/eslint-plugin-template");
const angularTemplateParser = require("@angular-eslint/template-parser");

const tsFilePatterns = ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"];

const tsRecommended = tsPlugin.configs["flat/recommended"].map((config) => {
  if (!config.files && config.rules) {
    return { ...config, files: tsFilePatterns };
  }
  return config;
});

module.exports = [
  {
    ignores: ["node_modules/**", "dist/**", "functions/lib/**"],
  },
  eslint.configs.recommended,
  ...tsRecommended,
  {
    files: tsFilePatterns,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.json"],
        tsconfigRootDir: __dirname,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@angular-eslint": angularPlugin,
      "@angular-eslint/template": angularTemplatePlugin,
    },
    rules: {
      ...angularPlugin.configs.recommended.rules,

      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    files: ["**/*.ts"],
    processor: angularTemplatePlugin.processors["extract-inline-html"],
  },
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      "@angular-eslint/template": angularTemplatePlugin,
    },
    rules: {
      ...angularTemplatePlugin.configs.recommended.rules,
    },
  },
];

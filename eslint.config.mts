import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import angular from "angular-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,ts}"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: { globals: globals.browser },
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "jzp",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "jzp",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended as unknown as any,
      angular.configs.templateAccessibility as unknown as any,
    ],
    rules: {},
  },
]);

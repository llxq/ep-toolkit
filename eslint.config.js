import js from "@eslint/js";
import typescript from "typescript-eslint";
import vue from "eslint-plugin-vue";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  ...typescript.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.vue"],
    languageOptions: {
      parser: vue.parse,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        parser: "@typescript-eslint/parser",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        TAllType: "readonly",
        TUndefinable: "readonly",
        TObj: "readonly",
        TNullable: "readonly",
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": typescript.plugin,
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
      "no-restricted-properties": [
        "error",
        {
          object: "console",
          property: "log",
          message: "can only use console.error or console.warn",
        },
        {
          object: "console",
          property: "info",
          message: "can only use console.error or console.warn",
        },
        {
          object: "console",
          property: "debug",
          message: "can only use console.error or console.warn",
        },
        {
          object: "console",
          property: "trace",
          message: "can only use console.error or console.warn",
        },
      ],
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "vue/singleline-html-element-content-newline": "off",
      "vue/max-attributes-per-line": "off",
      "vue/no-required-prop-with-default": "off",
      "vue/html-self-closing": "off",
    },
  },
  {
    ignores: ["**/*.d.ts", "dist/**/*", "**/*.json"],
  },
];

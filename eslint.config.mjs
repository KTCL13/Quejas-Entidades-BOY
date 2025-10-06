import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import jest from "eslint-plugin-jest";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        "bootstrap": "readonly",
        "grecaptcha": "readonly"
      }
    }
  },
  {
    files: ["**/*.js"], languageOptions:
      { sourceType: "commonjs" }
  },
  {
    files: ["test-jest/**/*.test.js"],
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules
    }
  },
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off",
      "no-console": "warn",
    }
  }
]);

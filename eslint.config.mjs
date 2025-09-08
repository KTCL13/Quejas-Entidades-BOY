import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    ignores: [
      "node_modules/",
      "test-jest/",
      "*.test.js"
    ]
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
]);
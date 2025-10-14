// eslint.config.mjs
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import pluginJest from "eslint-plugin-jest";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig({
  files: ["**/*.{js,mjs,cjs}"],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.browser,
      ...globals.jest,
      bootstrap: "readonly",
      grecaptcha: "readonly",
    },
  },
  plugins: {
    "@stylistic": stylistic,
    jest: pluginJest,
  },
  extends: [js.configs.recommended, prettier],
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-undef": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
});

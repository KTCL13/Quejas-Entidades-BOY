import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",   // 👈 asegúrate que NO esté en "module"
      globals: {
        ...globals.browser,   // habilita window, document, etc
        ...globals.node,      // 👈 agrega esto para habilitar require, __dirname, module, etc
        bootstrap: "readonly",
        grecaptcha: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
    },
  },
];

import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",  
      globals: {
        ...globals.browser,  
        ...globals.node,      
        bootstrap: "readonly",
        grecaptcha: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
    },
  },
];

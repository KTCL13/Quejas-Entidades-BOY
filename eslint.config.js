// eslint.config.js
import js from "@eslint/js";

export default [
  js.configs.recommended, 
  {
    languageOptions: {
      globals: {
   
        bootstrap: "readonly",

        grecaptcha: "readonly",

        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",  
      "no-undef": "off",         
      "no-console": "off",       
    },
    ignores: [
      "node_modules/",
      "public/vendor/", 
      "dist/",          
    ],
  },
];

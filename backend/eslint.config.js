const globals = require("globals");

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // ✅ penting agar console & require dikenali
      },
    },
    rules: {
      "no-undef": "off", // matikan kalau masih warning
    },
  },
];

// import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // https://github.com/eslint/eslint/discussions/18304
  { ignores: ["tmp/*", "dist/*", "**/*.d.ts", "**/*.user.js"] },
  ...tseslint.config({
    rules: {
      // "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
  }),
];

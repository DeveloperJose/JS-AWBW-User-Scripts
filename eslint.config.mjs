  // https://github.com/eslint/eslint/discussions/18304
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["tmp/*", "dist/*", "**/*.d.ts", "**/*.user.js"] },
  ...tseslint.config({
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
  }),
];


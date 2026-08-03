import playwright from "eslint-plugin-playwright";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  tseslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    ignores: [
      "node_modules/**",
      "**/node_modules/**",
      "src/tests/dev/dev.spec.ts",
      "artifacts/**",
    ],
  },
  {
    files: ["src/**/*.ts"],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: "../../tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: { playwright },
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "@typescript-eslint/naming-convention": [
        "warn",
        { selector: "function", format: ["camelCase"] },
        { selector: "variableLike", format: ["camelCase"] },
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["camelCase", "UPPER_CASE"],
        },
        { selector: "typeLike", format: ["PascalCase"] },
        {
          selector: "parameter",
          modifiers: ["unused"],
          format: null,
          leadingUnderscore: "allow",
        },
      ],
      "playwright/expect-expect": [
        "warn",
        {
          assertFunctionNames: ["expect"],
          assertFunctionPatterns: ["^validate", "\\.validate"],
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
      "no-console": ["warn", { allow: ["error", "warn", "info"] }],
    },
  },
  {
    // `Environment` is a static-only class used as a read-only config
    // namespace (env-driven constants + derived URLs), not a collection of
    // free functions — intentionally exempted from no-extraneous-class
    // rather than converted, unlike the *Utils classes elsewhere.
    files: ["src/configs/environment.config.ts"],
    rules: {
      "@typescript-eslint/no-extraneous-class": "off",
    },
  },
  {
    // Side-effect-only auto-fixtures (autologger, logError, adblocker) rely
    // on `void`-typed fixture values so `await use()` can be called with no
    // argument. TS specially allows omitting a `void`-typed parameter but
    // NOT an `undefined`-typed one, so `undefined` isn't a safe substitute
    // here — every use() call would have to become use(undefined).
    files: ["src/fixtures/*.fixtures.ts", "src/fixtures/fixtures.ts"],
    rules: {
      "@typescript-eslint/no-invalid-void-type": "off",
      "playwright/no-wait-for-timeout": "off",
    },
  },
]);

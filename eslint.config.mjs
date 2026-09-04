import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
    {
      rules: {
        // Prevent accidental console statements
        'no-console': 'warn',

        // Prevent debugger statements
        'no-debugger': 'error',

        // Prevent unreachable code
        'no-unreachable': 'error',

        // Catch accidental use of undefined variables
        'no-undef': 'error',

        // Prevent duplicate imports
        'no-duplicate-imports': 'error',

        // Require === instead of ==
        eqeqeq: ['error', 'always'],

        // Prevent unnecessary variables
        'no-unused-vars': 'off',

        // TypeScript version of no-unused-vars
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],

        // Prevent explicit `any`
        // '@typescript-eslint/no-explicit-any': 'warn',

        // Require consistent type imports
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            prefer: 'type-imports',
          },
        ],
      },
    }
  ),
]);

export default eslintConfig;

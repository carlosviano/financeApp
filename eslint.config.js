// Flat ESLint config. The rules here are the enforcement half of the project's
// golden rule: an architectural decision that only lives in a document is not
// enforced at all. Criteria A4 and A5 of specs/active.md land in this file.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expoConfig,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // A4 — `any` defeats the point of running TypeScript in strict mode.
      // Use `unknown` and narrow, or write the type.
      '@typescript-eslint/no-explicit-any': 'error',

      // A5 — a suppression comment has to say why it is there. Without a
      // reason it is impossible to tell a deliberate escape hatch from one
      // somebody added to make a build go green.
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-expect-error': 'allow-with-description',
          minimumDescriptionLength: 10,
        },
      ],
    },
  },
  {
    // Config and tooling files run in Node and are not part of the typed
    // program, so the type-aware rules have nothing to work with there.
    files: ['*.config.js', 'jest.setup.js', 'design/**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        __dirname: 'readonly',
        module: 'writable',
        require: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  prettier,
  {
    ignores: ['node_modules/', '.expo/', 'dist/', 'android/', 'ios/', 'design/redesign-pantallas/'],
  },
]);

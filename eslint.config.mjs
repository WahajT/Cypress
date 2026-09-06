import js from '@eslint/js';
import globals from 'globals';
import pluginCypress from 'eslint-plugin-cypress';
import pluginMocha from 'eslint-plugin-mocha';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/**',
      'cypress/reports/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
      'cypress/downloads/**',
      'Document/**',
      'package-lock.json',
    ],
  },

  js.configs.recommended,

  // Test code, page objects, support files, fixtures loaders — bundled by
  // Cypress, so ES modules and browser + Cypress + Mocha globals are available.
  {
    files: ['cypress/**/*.{js,mjs,cjs}'],
    plugins: { cypress: pluginCypress },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.mocha,
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
      },
    },
    rules: {
      ...(pluginCypress.configs?.recommended?.rules ?? {}),
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },

  // Extra guard rails for spec files only.
  {
    files: ['cypress/e2e/**/*.cy.{js,ts}'],
    plugins: { mocha: pluginMocha },
    rules: {
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-pending-tests': 'warn',
      'mocha/no-identical-title': 'error',
    },
  },

  // Node-side config / plugin code is CommonJS.
  {
    files: ['cypress.config.js', '*.config.{js,cjs}'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },

  // Must stay last: turns off rules that would fight Prettier.
  prettier,
];

import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

const RUNE_GLOBALS = {
  $state: 'readonly',
  $derived: 'readonly',
  $effect: 'readonly',
  $props: 'readonly',
  $bindable: 'readonly',
  $inspect: 'readonly',
  $host: 'readonly'
};

// Shorthand in a conditional spread silently drops or renames a field when the
// local variable name and the property name drift apart.
const noShorthandInConditionalSpread = [
  'error',
  {
    selector: 'SpreadElement > LogicalExpression[operator="&&"] > ObjectExpression > Property[shorthand=true]',
    message: 'Avoid shorthand properties in conditional spreads. Use explicit { field_name: value }.'
  },
  {
    selector: 'SpreadElement > ConditionalExpression > ObjectExpression > Property[shorthand=true]',
    message: 'Avoid shorthand properties in conditional spreads. Use explicit { field_name: value }.'
  }
];

const sharedTsRules = {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/no-explicit-any': 'warn',
  'no-restricted-syntax': noShorthandInConditionalSpread
};

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Global ignores
  {
    // .reviewable/completion.js is evaluated by Reviewable as a function body
    // (it uses a top-level `return`), so it is not parseable as a module.
    ignores: ['.svelte-kit/**', 'build/**', 'node_modules/**', '.reviewable/**']
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript files (server-side, utils, etc.)
  {
    files: ['src/**/*.ts'],
    ignores: ['**/*.svelte.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        App: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...sharedTsRules,
      '@typescript-eslint/consistent-type-imports': 'error'
    }
  },

  // Svelte TypeScript files (.svelte.ts) - Svelte runes
  {
    files: ['**/*.svelte.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...RUNE_GLOBALS
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...sharedTsRules
    }
  },

  // Svelte files - no type-aware linting (tsconfig doesn't include them)
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsparser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...RUNE_GLOBALS
      }
    },
    plugins: {
      svelte: sveltePlugin,
      '@typescript-eslint': tseslint
    },
    rules: {
      ...sveltePlugin.configs.recommended.rules,
      // KEY RULE: {@html} is the only XSS sink in a Svelte app, and the values that reach our
      // components (names, scraped data, model output) are user-set. Every use must be an
      // explicit, justified exemption naming why the string is app-authored - never a default.
      'svelte/no-at-html-tags': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // KEY RULE: Catch shorthand properties in conditional spreads
      'no-restricted-syntax': [
        'error',
        {
          selector: 'SpreadElement > LogicalExpression[operator="&&"] > ObjectExpression > Property[shorthand=true]',
          message:
            'Avoid shorthand properties in conditional spreads. Use explicit { field_name: value } to prevent property name mismatches with API types.'
        },
        {
          selector: 'SpreadElement > ConditionalExpression > ObjectExpression > Property[shorthand=true]',
          message:
            'Avoid shorthand properties in conditional spreads. Use explicit { field_name: value } to prevent property name mismatches with API types.'
        }
      ]
    }
  },

  // Root config files (*.config.js / *.config.ts) — deliberately not type-aware:
  // they sit outside tsconfig's include, so `project` parsing would fail on them.
  {
    files: ['*.js', '*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: sharedTsRules
  },

  // Disable stylistic rules that conflict with prettier
  prettierConfig
];

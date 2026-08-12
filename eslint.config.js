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
    // `.wrangler/` holds local Cloudflare state and bundled build artifacts
    // written by `wrangler pages dev`. It is git-ignored, but eslint walks the
    // working tree rather than the index, so without this `npm run check`
    // fails with thousands of errors on generated code for anyone who has run
    // the trip app locally.
    ignores: ['.svelte-kit/**', 'build/**', 'node_modules/**', '.reviewable/**', '.wrangler/**']
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // The service worker is deliberately not type-aware here. SvelteKit compiles
  // it against its own generated tsconfig (it targets the webworker lib, not
  // the DOM), so it is absent from ./tsconfig.json's includes and `project`
  // parsing fails on it. svelte-check still type-checks it.
  {
    files: ['src/service-worker.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.serviceworker
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: sharedTsRules
  },

  // TypeScript files (server-side, utils, etc.)
  {
    files: ['src/**/*.ts'],
    ignores: ['**/*.svelte.ts', 'src/service-worker.ts'],
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

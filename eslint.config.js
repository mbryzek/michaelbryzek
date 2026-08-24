import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import {
  typed as p10Typed,
  untyped as p10Untyped,
  svelte as p10Svelte,
  tests as p10Tests,
  testFiles as p10TestFiles
} from './eslint.p10.js';

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
    message:
      'Avoid shorthand properties in conditional spreads. Use explicit { field_name: value } to prevent property name mismatches with API types.'
  },
  {
    selector: 'SpreadElement > ConditionalExpression > ObjectExpression > Property[shorthand=true]',
    message:
      'Avoid shorthand properties in conditional spreads. Use explicit { field_name: value } to prevent property name mismatches with API types.'
  }
];

const sharedTsRules = {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  'no-restricted-syntax': noShorthandInConditionalSpread
};

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Global ignores
  {
    ignores: ['.svelte-kit/**', 'build/**', 'node_modules/**']
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
      ...p10Typed,
      ...sharedTsRules,
      '@typescript-eslint/consistent-type-imports': 'error'
    }
  },

  // Svelte TypeScript files (.svelte.ts) - Svelte runes
  {
    files: ['src/**/*.svelte.ts'],
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
        ...RUNE_GLOBALS
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...p10Typed,
      ...sharedTsRules
    }
  },

  // Svelte files. Type-aware: `.svelte` is in the tsconfig SvelteKit generates, so the
  // parser can hand typescript-eslint a program for a component and `no-floating-promises`
  // reads real types here rather than guessing.
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsparser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        extraFileExtensions: ['.svelte']
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
      ...p10Svelte,
      ...sharedTsRules
    }
  },

  // Root config files (*.config.js / *.config.ts) and `eslint.p10.js` — deliberately not
  // type-aware: they sit outside tsconfig's include, so `project` parsing would fail on
  // them. `p10Untyped` is every P10 rule except the one that reads types.
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
    rules: {
      ...p10Untyped,
      ...sharedTsRules
    }
  },

  // Test files relax exactly one P10 rule; `eslint.p10.js` says which and why. Last of the
  // rule blocks, so it wins over the per-extension blocks above for the files it names.
  {
    files: p10TestFiles,
    rules: p10Tests
  },

  // Disable stylistic rules that conflict with prettier
  prettierConfig
];

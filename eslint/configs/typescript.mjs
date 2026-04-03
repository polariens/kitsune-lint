import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import noNullInTypes from '../rules/no-null-in-types.mjs';
import { IGNORE_PATTERNS, resolveFiles } from '../utils.mjs';

/**
 * @typedef {Object} TypescriptOptions
 * @property {string[]} [files] - File patterns override
 * @property {string[]} [ignores] - Patterns a ignorar
 * @property {Record<string, unknown>} [rules] - Regras adicionais ou overrides
 */

/**
 * Configuração TypeScript com regras recomendadas e naming conventions.
 * @param {TypescriptOptions} [options={}]
 * @returns {import('eslint').Linter.Config[]}
 */
export function typescript(options = {}) {
  const { files, ignores, rules: extraRules = {} } = options;
  const resolvedFiles = resolveFiles('all', files);

  return [
    {
      ignores: ignores ?? [
        '**/*.config.{js,mjs,cjs,ts}', 
        '**/.prettierrc.*', 
        '**/_/*',
        '**/dist/',
        '**/.vitepress/',
        '.gemini/',
        '.github',
        '.vscode',
        '.husky',
        ...IGNORE_PATTERNS
      ],
    },
    {
      ...eslint.configs.recommended,
      files: resolvedFiles,
    },
    ...tseslint.configs.recommended.map((config) => ({
      ...config,
      files: resolvedFiles,
    })),
    {
      plugins: {
        kitsune: {
          rules: {
            'no-null-in-types': noNullInTypes,
          },
        },
      },
    },
    {
      files: resolvedFiles,
      name: '@kitsune/typescript/rules',
      plugins: {
        '@typescript-eslint': tseslint.plugin,
      },
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          projectService: true,
        },
      },
      rules: {
        // Prefer `===` or `!==` (never == or !=)
        eqeqeq: ['error', 'always'],
        '@typescript-eslint/no-empty-object-type': [
          'error',
          {
            allowObjectTypes: 'never',
            allowInterfaces: 'with-single-extends',
          },
        ],
        '@typescript-eslint/naming-convention': [
          'error',
          { selector: 'default', format: ['camelCase'] },
          { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
          { selector: 'function', format: ['camelCase'] },
          { selector: 'class', format: ['PascalCase'] },
          {
            selector: 'interface',
            format: ['PascalCase'],
            custom: { regex: '^(?!I[A-Z])(?!.*Interface$)(OAuth|[A-Z][a-z]).*$', match: true },
          },
          {
            selector: 'typeAlias',
            format: ['PascalCase'],
            custom: { regex: '^(?!I[A-Z])(?!.*Type$)(OAuth|[A-Z][a-z]).*$', match: true },
          },
          {
            // camelCase for properties of interfaces/types
            selector: 'typeProperty',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
          },
          {
            // camelCase for class members
            selector: 'classProperty',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            // camelCase for methods of classes
            selector: 'classMethod',
            format: ['camelCase'],
          },
          {
            // PascalCase for parameters of generic types of only one char
            selector: 'typeParameter',
            format: ['PascalCase'],
            custom: { regex: '^[A-Z]$', match: true },
          },
          // PascalCase for enums names
          { selector: 'enum', format: ['PascalCase'] },
          {
            // UPPER_CASE for enum members
            selector: 'enumMember',
            format: null,
            custom: { regex: `^['"]?[A-Z]+([-_][A-Z]+)*['"]?$`, match: true },
          },
          // camelCase for object literal properties
          { selector: 'objectLiteralProperty', format: null },
          // camelCase or PascalCase for imports
          { selector: 'import', format: ['camelCase', 'PascalCase'] },
        ],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/array-type': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'warn',
        // Block `console.log` only
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        // Disallows concatenation of string literals that can be combined into a single literal (e.g., 'foo' + 'bar' should be 'foobar').
        'no-useless-concat': 'error',
        'no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                regex: '^\\.\\.\\/.*',
                message: 'Use o alias @/ ou #/ ao invés de imports relativos com ../',
              },
            ],
          },
        ],
        'sort-imports': [
          'error',
          {
            allowSeparatedGroups: true,
            ignoreCase: false,
            ignoreDeclarationSort: true,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          },
        ],
        'no-var': 'error',
        'prefer-const': 'error',
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'no-restricted-syntax': [
          'error',
          { selector: 'ExportDefaultDeclaration', message: 'Prefer named exports' },
          { selector: 'ImportDeclaration[specifiers.length = 0]', message: 'Empty imports are not allowed' },
        ],
        'no-duplicate-imports': 'error',
        // No null in types/interfaces (allowed only with `Api` term)
        'kitsune/no-null-in-types': [
          'warn',
          {
            skipPattern: ['Api'],
          },
        ],
        ...extraRules,
      },
    },
    {
      // Disable naming convention rule for env.d.ts files
      files: ['**/env.d.ts'],
      rules: {
        '@typescript-eslint/naming-convention': 'off',
      },
    },
    {
      // Disable export/import default in router plugin and config files
      files: ['src/router/*.ts', '**/*.d.{ts,js}', '**/*.config.{ts,js}', '.*/**/*.{ts,js}'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
  ];
}

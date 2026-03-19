import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

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
      ignores: ignores ?? ['**/*.config.{js,mjs,cjs,ts}', ...IGNORE_PATTERNS],
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
      files: resolvedFiles,
      name: '@kitsune/typescript/rules',
      rules: {
        eqeqeq: 'error',
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
          { selector: 'variable', format: ['camelCase'] },
          { selector: 'function', format: ['camelCase'] },
          { selector: 'class', format: ['PascalCase'] },
          {
            selector: 'interface',
            format: ['PascalCase'],
            custom: { regex: '^(OAuth|[A-Z][a-z])', match: true },
          },
          {
            selector: 'typeAlias',
            format: ['PascalCase'],
            custom: { regex: '^(OAuth|[A-Z][a-z])', match: true },
          },
          {
            selector: 'typeProperty',
            format: null,
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
          },
          {
            selector: 'typeParameter',
            format: ['PascalCase'],
            custom: { regex: '^[A-Z]$', match: true },
          },
          { selector: 'enum', format: ['PascalCase'] },
          {
            selector: 'enumMember',
            format: null,
            custom: { regex: `^['"]?[A-Z]+([-_][A-Z]+)*['"]?$`, match: true },
          },
          { selector: 'objectLiteralProperty', format: null },
          { selector: 'import', format: ['camelCase', 'PascalCase'] },
        ],
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/array-type': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'warn',
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        'no-useless-concat': 'error',
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                regex: '^\\.\\.\\/.*',
                message: 'Use o alias @/ ao invés de imports relativos com ../',
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
        ...extraRules,
      },
    },
  ];
}

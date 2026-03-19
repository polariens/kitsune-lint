import { resolveFiles } from '../utils.mjs';

/**
 * @typedef {Object} CleanCodeOptions
 * @property {string[]} [files] - File patterns override
 * @property {number} [maxDepth=4] - Profundidade máxima de aninhamento
 * @property {number} [maxParams=4] - Número máximo de parâmetros
 * @property {number} [complexity=14] - Complexidade ciclomática máxima
 * @property {number} [maxLines=400] - Linhas máximas por arquivo
 * @property {number} [maxLinesPerFunction=80] - Linhas máximas por função
 * @property {Record<string, unknown>} [rules] - Regras adicionais ou overrides
 */

/**
 * Regras de clean code para legibilidade e manutenibilidade.
 * @param {CleanCodeOptions} [options={}]
 * @returns {import('eslint').Linter.Config[]}
 */
export function cleanCode(options = {}) {
  const {
    files,
    maxDepth = 4,
    maxParams = 4,
    complexity: maxComplexity = 14,
    maxLines = 400,
    maxLinesPerFunction = 80,
    rules: extraRules = {},
  } = options;

  return [
    {
      files: resolveFiles('all', files),
      name: '@kitsune/clean-code/rules',
      rules: {
        // --- Single Responsibility (SRP) ---
        complexity: ['warn', maxComplexity],
        'max-lines': ['warn', { max: maxLines, skipBlankLines: true, skipComments: true }],
        'max-lines-per-function': ['warn', { max: maxLinesPerFunction, skipBlankLines: true, skipComments: true }],
        'max-depth': ['error', maxDepth],
        'max-params': ['error', maxParams],

        // --- Readability & Expressiveness ---
        'no-nested-ternary': 'error',
        'no-unneeded-ternary': 'error',
        'no-else-return': 'error',
        'no-lonely-if': 'error',
        'prefer-template': 'error',
        'object-shorthand': 'error',
        curly: ['error', 'all'],
        'arrow-body-style': ['error', 'as-needed'],
        'no-multi-assign': 'error',

        // --- Immutability & Safety ---
        'no-param-reassign': ['error', { props: false }],
        'no-return-assign': ['error', 'always'],
        'no-sequences': 'error',
        'no-constructor-return': 'error',
        'no-promise-executor-return': 'error',

        // --- Code Organization ---
        'default-case-last': 'error',
        'grouped-accessor-pairs': ['error', 'getBeforeSet'],

        // --- Bug Prevention ---
        'no-template-curly-in-string': 'warn',
        'no-useless-return': 'error',

        ...extraRules,
      },
    },
  ];
}

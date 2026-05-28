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

  const resolvedFiles = resolveFiles('all', files);

  return [
    {
      files: resolvedFiles,
      name: '@kitsune/clean-code/rules',
      rules: {
        // --- Single Responsibility (SRP) ---
        complexity: ['warn', maxComplexity],
        'max-lines': ['warn', { max: maxLines, skipBlankLines: true, skipComments: true }],
        'max-lines-per-function': ['warn', { max: maxLinesPerFunction, skipBlankLines: true, skipComments: true }],
        'max-depth': ['error', maxDepth],
        'max-params': ['error', maxParams],
        'no-restricted-syntax': [
          'error',
          {
            selector: 'IfStatement > BlockStatement > IfStatement',
            message: 'Evite ifs aninhados. Extraia a lógica para uma função ou utilize operadores lógicos para simplificar a condição.',
          },
        ],

        // --- Readability & Expressiveness ---
        'no-negated-condition': 'error',
        'no-nested-ternary': 'error',
        'no-unneeded-ternary': 'error',
        'no-else-return': 'error',
        'no-lonely-if': 'error',
        'prefer-template': 'error',
        'object-shorthand': 'error',
        curly: ['error', 'all'],
        'arrow-body-style': ['error', 'as-needed'],
        'no-multi-assign': 'error',
        'no-unreachable-loop': 'error',
        'no-unused-labels': 'error',

        // --- Immutability & Safety ---
        'no-param-reassign': ['error', { props: false }],
        'no-return-assign': ['error', 'always'],
        'no-sequences': 'error',
        'no-constructor-return': 'error',
        'no-promise-executor-return': 'error',
        // Evita modificação de built-ins
        'no-extend-native': 'error',

        // --- Code Organization ---
        'default-case-last': 'error',
        'grouped-accessor-pairs': ['error', 'getBeforeSet'],
        'max-statements': ['error', 20],

        // --- Bug Prevention ---
        'no-template-curly-in-string': 'warn',
        'no-useless-return': 'error',

        ...extraRules,
      },
    },
    {
      /**
       * Regra personalizada para composables e stores pinia que por padrão podem ter mais linhas
       * devido aos exports e variáveis de estado ref/computed.
       * Padrão de arquivos: iniciando com `use`
       */
      files: resolvedFiles.map((pattern) => {
        const parts = pattern.split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('*')) {
          parts[parts.length - 1] = lastPart.replace('*', 'use*');
        }
        return parts.join('/');
      }),
      name: '@kitsune/clean-code/use-rules',
      rules: {
        'max-lines-per-function': [
          'warn',
          { max: Math.max(200, maxLinesPerFunction), skipBlankLines: true, skipComments: true },
        ],
      },
    },
  ];
}

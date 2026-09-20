import { resolveFiles } from '../utils.mjs';

/**
 * @typedef {Object} TestsOptions
 * @property {string[]} [files] - File patterns override
 * @property {Record<string, unknown>} [rules] - Regras adicionais ou overrides
 */

/**
 * Relaxamentos para arquivos de teste — desliga regras rígidas de produção
 * que atrapalham a escrita de testes (complexity, max-lines, naming, etc).
 * @param {TestsOptions} [options={}]
 * @returns {import('eslint').Linter.Config[]}
 */
export function tests(options = {}) {
  const { files, rules: extraRules = {} } = options;

  return [
    {
      files: resolveFiles('tests', files),
      name: '@kitsune/tests/relaxations',
      rules: {
        'max-lines-per-function': 'off',
        'max-lines': 'off',
        complexity: 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/naming-convention': 'off',
        'no-promise-executor-return': 'off',
        'no-param-reassign': 'off',
        'no-constructor-return': 'off',
        'no-script-url': 'off',
        'security/detect-object-injection': 'off',
        'security/detect-unsafe-regex': 'off',
        ...extraRules,
      },
    },
  ];
}

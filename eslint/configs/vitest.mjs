import { resolveFiles } from '../utils.mjs';

/**
 * @typedef {Object} VitestOptions
 * @property {string[]} [files] - File patterns override
 * @property {string} [titlePattern] - Regex para validação de títulos de testes
 * @property {string} [titleMessage] - Mensagem de erro para títulos inválidos
 * @property {'test' | 'it'} [fn='test'] - Função de teste preferida
 * @property {number} [maxNestedDescribe=3] - Máximo de describe aninhados
 * @property {Record<string, unknown>} [rules] - Regras adicionais ou overrides
 */

const GHERKIN_PT = '^Dado[^\\n]+(?:\\n\\s*(?:E|Mas)\\b[^\\n]+)*\\n\\s*Quando[^\\n]+(?:\\n\\s*(?:E|Mas)\\b[^\\n]+)*\\n\\s*Então[^\\n]+';
const GHERKIN_PT_MESSAGE =
  'O título do test() deve seguir o padrão Gherkin em português: "Dado ...\\nQuando ...\\nEntão ..."';

/**
 * Regras do plugin Vitest para padronização de testes.
 * @param {VitestOptions} [options={}]
 * @returns {Promise<import('eslint').Linter.Config[]>}
 */
export async function vitest(options = {}) {
  const {
    files,
    titlePattern = GHERKIN_PT,
    titleMessage = GHERKIN_PT_MESSAGE,
    fn = 'test',
    maxNestedDescribe = 3,
    rules: extraRules = {},
  } = options;

  const vitestPlugin = await import('@vitest/eslint-plugin').then((m) => m.default ?? m);

  return [
    {
      files: resolveFiles('tests', files),
      name: '@kitsune/vitest/rules',
      plugins: { vitest: vitestPlugin },
      rules: {
        ...vitestPlugin.configs.recommended.rules,
        'vitest/consistent-test-filename': 'error',
        'vitest/consistent-test-it': ['error', { fn }],
        'vitest/valid-title': [
          'error',
          { mustMatch: { [fn]: [titlePattern, titleMessage] } },
        ],
        'vitest/require-top-level-describe': 'error',
        'vitest/no-identical-title': 'error',
        'vitest/no-focused-tests': 'error',
        'vitest/no-disabled-tests': 'warn',
        'vitest/no-duplicate-hooks': 'error',
        'vitest/prefer-hooks-on-top': 'error',
        'vitest/prefer-hooks-in-order': 'error',
        'vitest/prefer-to-be': 'error',
        'vitest/prefer-each': 'error',
        'vitest/no-mocks-import': 'off',
        'vitest/max-nested-describe': ['error', { max: maxNestedDescribe }],
        ...extraRules,
      },
    },
  ];
}

import aliasImports from '../rules/alias-imports.mjs';
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

// Padrões de título de teste em português.
// Gherkin padrão (Dado, Quando, Então) e também "Deve ...".
const GHERKIN_PT = '^Dado[^\\n]+(?:\\n\\s*(?:E|Mas)\\b[^\\n]+)*\\n\\s*Quando[^\\n]+(?:\\n\\s*(?:E|Mas)\\b[^\\n]+)*\\n\\s*Então[^\\n]+';
const DEVE_PT = '^Deve\\s.+$';
// Mensagem combinada para ambos os padrões.
const TITLE_PATTERN_MESSAGE =
  'O título do test() deve seguir o padrão Gherkin em português ("Dado ...\\nQuando ...\\nEntão ...") ou iniciar com "Deve ..."';

/**
 * Regras do plugin Vitest para padronização de testes.
 * @param {VitestOptions} [options={}]
 * @returns {Promise<import('eslint').Linter.Config[]>}
 */
export async function vitest(options = {}) {
  const {
    files,
    // Aceita string ou array de strings para múltiplos padrões.
    titlePattern = [GHERKIN_PT, DEVE_PT],
    titleMessage = TITLE_PATTERN_MESSAGE,
    fn = 'test',
    maxNestedDescribe = 3,
    rules: extraRules = {},
  } = options;

  const vitestPlugin = await import('@vitest/eslint-plugin').then((m) => m.default ?? m);

  return [
    {
      files: resolveFiles('tests', files),
      name: '@kitsune/vitest/rules',
      plugins: { 
        vitest: vitestPlugin,
        kitsune: {
          rules: {
            'alias-imports': aliasImports,
          },
        },
      },
      rules: {
        ...vitestPlugin.configs.recommended.rules,
        'vitest/consistent-test-filename': 'error',
        'vitest/consistent-test-it': ['error', { fn }],
        // Constrói o padrão combinado (string ou array) para a regra.
        'vitest/valid-title': [
          'error',
          {
            mustMatch: {
              [fn]: [
                // Se for array, une com "|" para regex alternativo.
                Array.isArray(titlePattern) ? titlePattern.join('|') : titlePattern,
                titleMessage,
              ],
            },
          },
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
        'vitest/no-importing-vitest-globals': 'error',
        'kitsune/alias-imports': 'error',
        ...extraRules,
      },
    },
  ];
}

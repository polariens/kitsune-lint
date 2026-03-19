import { resolveFiles } from '../utils.mjs';

/**
 * @typedef {Object} PiniaOptions
 * @property {string[]} [files] - File patterns override (default: src/state/**\/*.ts)
 * @property {Record<string, unknown>} [rules] - Regras adicionais ou overrides
 */

/**
 * Regras para stores Pinia — organização, naming e boas práticas.
 * @param {PiniaOptions} [options={}]
 * @returns {Promise<import('eslint').Linter.Config[]>}
 */
export async function pinia(options = {}) {
  const { files, rules: extraRules = {} } = options;

  const pluginPinia = await import('eslint-plugin-pinia').then((m) => m.default ?? m);

  return [
    {
      files: resolveFiles('pinia', files),
      name: '@kitsune/pinia/rules',
      plugins: { pinia: pluginPinia },
      rules: {
        'pinia/never-export-initialized-store': 'error',
        'pinia/no-duplicate-store-ids': 'error',
        'pinia/no-return-global-properties': 'error',
        'pinia/no-store-to-refs-in-store': 'error',
        'pinia/prefer-single-store-per-file': 'warn',
        'pinia/prefer-use-store-naming-convention': 'warn',
        'pinia/require-setup-store-properties-export': 'warn',
        ...extraRules,
      },
    },
  ];
}

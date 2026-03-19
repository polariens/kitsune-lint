import pluginSecurity from 'eslint-plugin-security';

import { resolveFiles } from '../utils.mjs';

/**
 * @typedef {Object} SecurityOptions
 * @property {string[]} [files] - File patterns override
 * @property {boolean} [pluginEnabled=true] - Habilitar eslint-plugin-security
 * @property {Record<string, unknown>} [rules] - Regras adicionais ou overrides
 */

/**
 * Regras de segurança para prevenir vulnerabilidades comuns.
 * @param {SecurityOptions} [options={}]
 * @returns {import('eslint').Linter.Config[]}
 */
export function security(options = {}) {
  const { files, pluginEnabled = true, rules: extraRules = {} } = options;
  const resolvedFiles = resolveFiles('all', files);

  const configs = [
    {
      files: resolvedFiles,
      name: '@kitsune/security/rules',
      rules: {
        'no-eval': 'error',
        'no-new-func': 'error',
        'no-script-url': 'error',
        'no-implied-eval': 'error',
        ...extraRules,
      },
    },
  ];

  if (pluginEnabled) {
    configs.push({
      ...pluginSecurity.configs.recommended,
      files: resolvedFiles,
      name: '@kitsune/security/plugin',
    });
  }

  return configs;
}

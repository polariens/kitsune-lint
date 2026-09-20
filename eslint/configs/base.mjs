import globals from 'globals';

import { resolveFiles } from '../utils.mjs';

/**
 * @typedef {Object} BaseOptions
 * @property {string[]} [files] - File patterns override
 * @property {'browser' | 'node' | 'shared-node-browser'} [environment='browser'] - Ambiente global
 */

/**
 * Configuração base com globals do ambiente.
 * @param {BaseOptions} [options={}]
 * @returns {import('eslint').Linter.Config[]}
 */
export function base(options = {}) {
  const { files, environment = 'browser' } = options;

  return [
    {
      files: resolveFiles('all', files),
      name: '@kitsune/base/globals',
      languageOptions: {
        globals: globals[environment],
      },
    },
  ];
}

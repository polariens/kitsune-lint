import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

import { resolveFiles } from '../utils.mjs';

/**
 * @typedef {Object} VueOptions
 * @property {string[]} [files] - File patterns override
 * @property {'script-setup' | 'composition' | 'options'} [apiStyle='script-setup']
 * @property {Record<string, unknown>} [rules] - Regras adicionais ou overrides
 */

/**
 * Regras para projetos Vue 3 com TypeScript.
 * @param {VueOptions} [options={}]
 * @returns {import('eslint').Linter.Config[]}
 */
export function vue(options = {}) {
  const { 
    files, 
    apiStyle = 'script-setup', 
    rules: extraRules = {}, 
    componentsNameCasing = 'PascalCase', 
    componentsNameCasingIgnores = [], 
    propNameCasing = 'camelCase',
    slotNameCasing = 'kebab-case', 
  } = options;

  return [
    ...pluginVue.configs['flat/recommended'],
    {
      files: resolveFiles('vue', files),
      name: '@kitsune/vue/rules',
      languageOptions: {
        parser: vueParser,
        parserOptions: {
          parser: tseslint.parser,
        },
      },
      rules: {
        'no-undef': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'vue/block-lang': ['error', { script: { lang: 'ts' } }],
        'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
        'vue/block-tag-newline': 'error',
        'vue/component-api-style': ['error', [apiStyle]],
        'vue/define-props-declaration': ['error', 'type-based'],
        'vue/define-emits-declaration': ['error', 'type-based'],
        'vue/no-setup-props-reactivity-loss': 'error',
        'vue/no-undef-properties': 'error',
        'vue/no-unused-emit-declarations': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/no-static-inline-styles': 'error',
        'vue/require-typed-ref': 'error',
        'vue/prop-name-casing': ['error', propNameCasing],
        'vue/slot-name-casing': ['error', slotNameCasing],
        'vue/component-name-in-template-casing': [
          'error',
          componentsNameCasing,
          {
            registeredComponentsOnly: false,
            ignores: componentsNameCasingIgnores,
          },
        ],
        ...extraRules,
      },
    },
  ];
}

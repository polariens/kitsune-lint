/**
 * @typedef {Object} StylelintKitsuneConfig
 * @property {string | string[]} [extends] - Configurações que serão estendidas
 * @property {Record<string, any>} [rules] - Regras personalizadas para sobrescrever
 * @property {Array<Record<string, any>>} [overrides] - Regras específicas por padrão de arquivo
 */

/** @type {StylelintKitsuneConfig} */
const stylelintKitsuneConfig = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  rules: {
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'scss/double-slash-comment-empty-line-before': null,
    'scss/percent-placeholder-pattern': null,
    'scss/dollar-variable-pattern': null,
    'scss/at-mixin-pattern': null,
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'custom-property-pattern': null,
  },
};

/**
 * @typedef {Object} CreateStylelintKitsuneOptions
 * @property {string[]} [extends] - Configs adicionais a estender
 * @property {Record<string, any>} [rules] - Regras adicionais a adicionar/sobrescrever
 * @property {Array<Record<string, any>>} [overrides] - Overrides de arquivos adicionais
 */

/**
 * Factory para criar configurações do Stylelint com overrides.
 *
 * @param {CreateStylelintKitsuneOptions} [options={}]
 * @returns {StylelintKitsuneConfig}
 */
function createStylelintKitsuneConfig(options = {}) {
  const { extends: extraExtends = [], rules = {}, overrides = [] } = options;

  return {
    ...stylelintKitsuneConfig,
    extends: [
      ...stylelintKitsuneConfig.extends,
      ...extraExtends,
    ],
    rules: {
      ...stylelintKitsuneConfig.rules,
      ...rules,
    },
    overrides: [
      ...(stylelintKitsuneConfig.overrides || []),
      ...overrides,
    ],
  };
}

export { createStylelintKitsuneConfig, stylelintKitsuneConfig as default };

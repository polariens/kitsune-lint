const BEM_PATTERN = [
  '^[a-z]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
  {
    resolveNestedSelectors: true,
    message: 'Expected class selector to match BEM pattern (e.g. .block__element--modifier)',
  },
];

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
    'selector-class-pattern': BEM_PATTERN,
    'scss/double-slash-comment-empty-line-before': null,
    'scss/percent-placeholder-pattern': null,
    'scss/dollar-variable-pattern': null,
    'scss/at-mixin-pattern': null,
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'custom-property-pattern': null,
    'declaration-no-important': true,
    'selector-disallowed-list': [
      'div',
      'span',
      'p',
      'a',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'section',
      'article',
      'header',
      'footer',
      'aside',
      'nav',
      'main',
    ],
  },
};

/**
 * @typedef {Object} CreateStylelintKitsuneOptions
 * @property {string[]} [extends] - Configs adicionais a estender
 * @property {Record<string, any>} [rules] - Regras adicionais a adicionar/sobrescrever
 * @property {Array<Record<string, any>>} [overrides] - Overrides de arquivos adicionais
 * @property {'BEM' | null} [classPattern] - Padrão de nomenclatura das classes (ex: 'BEM')
 */

/**
 * Factory para criar configurações do Stylelint com overrides.
 *
 * @param {CreateStylelintKitsuneOptions} [options={}]
 * @returns {StylelintKitsuneConfig}
 */
function createStylelintKitsuneConfig(options = {}) {
  const { extends: extraExtends = [], rules = {}, overrides = [], classPattern = 'BEM' } = options;

  const resolvedRules = {
    ...stylelintKitsuneConfig.rules,
    ...rules,
  };

  if (classPattern === 'BEM') {
    resolvedRules['selector-class-pattern'] = BEM_PATTERN;
  } else if (classPattern === null) {
    resolvedRules['selector-class-pattern'] = null;
  }

  return {
    ...stylelintKitsuneConfig,
    extends: [
      ...stylelintKitsuneConfig.extends,
      ...extraExtends,
    ],
    rules: resolvedRules,
    overrides: [
      ...(stylelintKitsuneConfig.overrides || []),
      ...overrides,
    ],
  };
}

export { createStylelintKitsuneConfig, stylelintKitsuneConfig as default };

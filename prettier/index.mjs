/**
 * @typedef {Object} PrettierKitsuneOptions
 * @property {number} [printWidth=100]
 * @property {number} [tabWidth=2]
 * @property {boolean} [useTabs=false]
 * @property {boolean} [semi=true]
 * @property {boolean} [singleQuote=true]
 * @property {'all' | 'es5' | 'none'} [trailingComma='es5']
 * @property {boolean} [bracketSpacing=true]
 * @property {boolean} [bracketSameLine=false]
 * @property {'always' | 'avoid'} [arrowParens='always']
 * @property {'always' | 'never' | 'preserve'} [proseWrap='never']
 * @property {'css' | 'strict' | 'ignore'} [htmlWhitespaceSensitivity='strict']
 * @property {'lf' | 'crlf' | 'cr' | 'auto'} [endOfLine='lf']
 * @property {'as-needed' | 'consistent' | 'preserve'} [quoteProps='as-needed']
 * @property {'auto' | 'off'} [embeddedLanguageFormatting='auto']
 * @property {boolean} [vueIndentScriptAndStyle=false]
 */

/** @type {PrettierKitsuneOptions} */
const defaults = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  embeddedLanguageFormatting: 'auto',
};

/**
 * Configuração Prettier padrão.
 * Importar diretamente para usar sem modificações.
 *
 * @example
 * // prettier.config.mjs
 * import { prettierKitsuneConfig } from '@polariens/kitsune-lint/prettier';
 * export default prettierKitsuneConfig;
 */
const prettierKitsuneConfig = { ...defaults };

/**
 * @typedef {Object} Options
 * @property {boolean} [vue=false] - Habilita configurações relacionadas ao Vue, como vueIndentScriptAndStyle
 */

/**
 * Factory para criar config Prettier com opções.
 *
 * @param {Object} [options={}]
 * @param {Partial<PrettierKitsuneOptions>} [options.overrides={}] - Overrides diretos do Prettier
 * @param {boolean} [options.vue=false] - Se deve indentar script/style no Vue
 * @returns {PrettierKitsuneOptions}
 */
function createPrettierKitsuneConfig(options = {}) {
  const { overrides = {}, vue = false } = options;

  const config = {
    ...defaults,
    ...overrides
  };

  if (vue) {
    config.vueIndentScriptAndStyle = true;
  }

  return config;
}

export { createPrettierKitsuneConfig, prettierKitsuneConfig as default };

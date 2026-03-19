/**
 * @typedef {Object} PrettierOptions
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

/** @type {PrettierOptions} */
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
 * import { prettierConfig } from '@merieli/kitsune-lint/prettier';
 * export default prettierConfig;
 */
export const prettierConfig = { ...defaults };

/**
 * @typedef {Object} VueOptions
 * @property {boolean} [vueIndentScriptAndStyle=false] - Indentação dentro de <script> e <style> em SFCs
 */

/**
 * Factory para criar config Prettier com overrides.
 *
 * @example
 * import { createPrettierConfig } from '@merieli/kitsune-lint/prettier';
 * export default createPrettierConfig({ printWidth: 120 });
 *
 * @example
 * // Com opções Vue
 * import { createPrettierConfig } from '@merieli/kitsune-lint/prettier';
 * export default createPrettierConfig({ printWidth: 120 }, { vueIndentScriptAndStyle: false });
 *
 * @param {Partial<PrettierOptions>} [overrides={}]
 * @param {VueOptions} [vueOptions]
 * @returns {PrettierOptions}
 */
export function createPrettierConfig(overrides = {}, vueOptions) {
  const config = { ...defaults, ...overrides };

  if (vueOptions) {
    if (vueOptions.vueIndentScriptAndStyle !== undefined) {
      config.vueIndentScriptAndStyle = vueOptions.vueIndentScriptAndStyle;
    }
  }

  return config;
}

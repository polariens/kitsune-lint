export { base } from './configs/base.mjs';
export { cleanCode } from './configs/clean-code.mjs';
export { pinia } from './configs/pinia.mjs';
export { security } from './configs/security.mjs';
export { tests } from './configs/tests.mjs';
export { typescript } from './configs/typescript.mjs';
export { vitest } from './configs/vitest.mjs';
export { vue } from './configs/vue.mjs';

/**
 * @typedef {Object} CreateConfigOptions
 * @property {import('./configs/base.mjs').BaseOptions | boolean} [base=true]
 * @property {import('./configs/typescript.mjs').TypescriptOptions | boolean} [typescript=true]
 * @property {import('./configs/security.mjs').SecurityOptions | boolean} [security=true]
 * @property {import('./configs/clean-code.mjs').CleanCodeOptions | boolean} [cleanCode=true]
 * @property {import('./configs/vue.mjs').VueOptions | boolean} [vue=false]
 * @property {import('./configs/pinia.mjs').PiniaOptions | boolean} [pinia=false]
 * @property {import('./configs/tests.mjs').TestsOptions | boolean} [tests=false]
 * @property {import('./configs/vitest.mjs').VitestOptions | boolean} [vitest=false]
 * @property {import('eslint').Linter.Config[]} [extend] - Configs adicionais a incluir no final
 */

/**
 * Factory que compõe uma configuração ESLint completa a partir de módulos selecionados.
 *
 * @example
 * import { createConfig } from '@merieli/kitsune-lint/eslint';
 * export default await createConfig();
 *
 * @example
 * import { createConfig } from '@merieli/kitsune-lint/eslint';
 * export default await createConfig({ vue: true, pinia: true, tests: true, vitest: true });
 *
 * @example
 * import { createConfig } from '@merieli/kitsune-lint/eslint';
 * export default await createConfig({
 *   base: { environment: 'node' },
 *   cleanCode: { maxDepth: 3, maxParams: 3, complexity: 10 },
 *   vue: { apiStyle: 'composition' },
 *   pinia: true,
 *   tests: true,
 *   vitest: true,
 * });
 *
 * @param {CreateConfigOptions} [options={}]
 * @returns {Promise<import('eslint').Linter.Config[]>}
 */
export async function createConfig(options = {}) {
  const {
    base: baseOpt = true,
    typescript: tsOpt = true,
    security: secOpt = true,
    cleanCode: cleanOpt = true,
    vue: vueOpt = false,
    pinia: piniaOpt = false,
    tests: testsOpt = false,
    vitest: vitestOpt = false,
    extend = [],
  } = options;

  const configs = [];

  if (baseOpt) {
    const { base } = await import('./configs/base.mjs');
    configs.push(...base(baseOpt === true ? {} : baseOpt));
  }

  if (tsOpt) {
    const { typescript } = await import('./configs/typescript.mjs');
    configs.push(...typescript(tsOpt === true ? {} : tsOpt));
  }

  if (secOpt) {
    const { security } = await import('./configs/security.mjs');
    configs.push(...security(secOpt === true ? {} : secOpt));
  }

  if (cleanOpt) {
    const { cleanCode } = await import('./configs/clean-code.mjs');
    configs.push(...cleanCode(cleanOpt === true ? {} : cleanOpt));
  }

  if (vueOpt) {
    const { vue } = await import('./configs/vue.mjs');
    configs.push(...vue(vueOpt === true ? {} : vueOpt));
  }

  if (piniaOpt) {
    const { pinia } = await import('./configs/pinia.mjs');
    configs.push(...(await pinia(piniaOpt === true ? {} : piniaOpt)));
  }

  if (testsOpt) {
    const { tests } = await import('./configs/tests.mjs');
    configs.push(...tests(testsOpt === true ? {} : testsOpt));
  }

  if (vitestOpt) {
    const { vitest } = await import('./configs/vitest.mjs');
    configs.push(...(await vitest(vitestOpt === true ? {} : vitestOpt)));
  }

  configs.push(...extend);

  return configs;
}

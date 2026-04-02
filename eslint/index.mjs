export { base } from './configs/base.mjs';
export { cleanCode } from './configs/clean-code.mjs';
export { pinia } from './configs/pinia.mjs';
export { security } from './configs/security.mjs';
export { tests } from './configs/tests.mjs';
export { typescript } from './configs/typescript.mjs';
export { vitest } from './configs/vitest.mjs';
export { vue } from './configs/vue.mjs';

/**
 * @typedef {Object} CreateKitsuneConfigOptions
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
 * import { createKitsuneConfig } from '@merieli/kitsune-lint/eslint';
 * export default await createKitsuneConfig();
 *
 * @example
 * import { createKitsuneConfig } from '@merieli/kitsune-lint/eslint';
 * export default await createKitsuneConfig({ vue: true, pinia: true, tests: true, vitest: true });
 *
 * @example
 * import { createKitsuneConfig } from '@merieli/kitsune-lint/eslint';
 * export default await createKitsuneConfig({
 *   base: { environment: 'node' },
 *   cleanCode: { maxDepth: 3, maxParams: 3, complexity: 10 },
 *   vue: { apiStyle: 'composition' },
 *   pinia: true,
 *   tests: true,
 *   vitest: true,
 * });
 *
 * @param {CreateKitsuneConfigOptions} [options={}]
 * @returns {Promise<import('eslint').Linter.Config[]>}
 */
export async function createKitsuneConfig(options = {}) {
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

  const moduleMap = [
    { opt: baseOpt, name: 'base', file: 'base' },
    { opt: tsOpt, name: 'typescript', file: 'typescript' },
    { opt: secOpt, name: 'security', file: 'security' },
    { opt: cleanOpt, name: 'cleanCode', file: 'clean-code' },
    { opt: vueOpt, name: 'vue', file: 'vue' },
    { opt: piniaOpt, name: 'pinia', file: 'pinia' },
    { opt: testsOpt, name: 'tests', file: 'tests' },
    { opt: vitestOpt, name: 'vitest', file: 'vitest' },
  ];

  for (const { opt, name, file } of moduleMap) {
    if (opt) {
      const mod = await import(`./configs/${file}.mjs`);
      const configArr = await mod[name](opt === true ? {} : opt);
      configs.push(...configArr);
    }
  }

  configs.push(...extend);

  return configs;
}

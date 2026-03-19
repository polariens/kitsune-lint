import type { Linter } from 'eslint';

import type { BaseOptions } from './configs/base.mjs';
import type { CleanCodeOptions } from './configs/clean-code.mjs';
import type { PiniaOptions } from './configs/pinia.mjs';
import type { SecurityOptions } from './configs/security.mjs';
import type { TestsOptions } from './configs/tests.mjs';
import type { TypescriptOptions } from './configs/typescript.mjs';
import type { VitestOptions } from './configs/vitest.mjs';
import type { VueOptions } from './configs/vue.mjs';

export type { BaseOptions } from './configs/base.mjs';
export type { CleanCodeOptions } from './configs/clean-code.mjs';
export type { PiniaOptions } from './configs/pinia.mjs';
export type { SecurityOptions } from './configs/security.mjs';
export type { TestsOptions } from './configs/tests.mjs';
export type { TypescriptOptions } from './configs/typescript.mjs';
export type { VitestFn, VitestOptions } from './configs/vitest.mjs';
export type { VueApiStyle, VueOptions } from './configs/vue.mjs';

export { base } from './configs/base.mjs';
export { cleanCode } from './configs/clean-code.mjs';
export { pinia } from './configs/pinia.mjs';
export { security } from './configs/security.mjs';
export { tests } from './configs/tests.mjs';
export { typescript } from './configs/typescript.mjs';
export { vitest } from './configs/vitest.mjs';
export { vue } from './configs/vue.mjs';

export interface CreateConfigOptions {
  /** Configuração base (globals do ambiente) @default true */
  base?: BaseOptions | boolean;
  /** Regras TypeScript + naming conventions @default true */
  typescript?: TypescriptOptions | boolean;
  /** Regras de segurança (eval, XSS, injection) @default true */
  security?: SecurityOptions | boolean;
  /** Regras de clean code (SRP, legibilidade, imutabilidade) @default true */
  cleanCode?: CleanCodeOptions | boolean;
  /** Regras Vue 3 (script setup, block order) @default false */
  vue?: VueOptions | boolean;
  /** Regras Pinia (naming, organização de stores) @default false */
  pinia?: PiniaOptions | boolean;
  /** Relaxamentos para arquivos de teste @default false */
  tests?: TestsOptions | boolean;
  /** Regras Vitest (plugin vitest) @default false */
  vitest?: VitestOptions | boolean;
  /** Configs adicionais a incluir no final (ex: eslint-config-prettier) */
  extend?: Linter.Config[];
}

export declare function createConfig(options?: CreateConfigOptions): Promise<Linter.Config[]>;

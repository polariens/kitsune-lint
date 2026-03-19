import type { Linter } from 'eslint';

export interface TestsOptions {
  /** File patterns override */
  files?: string[];
  /** Regras adicionais ou overrides */
  rules?: Partial<Linter.RulesRecord>;
}

export declare function tests(options?: TestsOptions): Linter.Config[];

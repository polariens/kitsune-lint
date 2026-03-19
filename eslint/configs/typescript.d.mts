import type { Linter } from 'eslint';

export interface TypescriptOptions {
  /** File patterns override */
  files?: string[];
  /** Patterns a ignorar */
  ignores?: string[];
  /** Regras adicionais ou overrides */
  rules?: Partial<Linter.RulesRecord>;
}

export declare function typescript(options?: TypescriptOptions): Linter.Config[];

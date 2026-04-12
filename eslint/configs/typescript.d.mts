import type { Linter } from 'eslint';

export interface TypescriptOptions {
  /** File patterns override */
  files?: string[];
  /** Patterns a ignorar */
  ignores?: string[];
  /** Patterns a ignorar substituindo qualquer padrão do pacote */
  replaceIgnores?: string[];
  /** Regras adicionais ou overrides */
  rules?: Partial<Linter.RulesRecord>;
}

export declare function typescript(options?: TypescriptOptions): Linter.Config[];

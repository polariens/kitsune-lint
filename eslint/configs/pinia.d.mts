import type { Linter } from 'eslint';

export interface PiniaOptions {
  /** File patterns override @default ['src/state/**\/*.ts'] */
  files?: string[];
  /** Regras adicionais ou overrides */
  rules?: Partial<Linter.RulesRecord>;
}

export declare function pinia(options?: PiniaOptions): Promise<Linter.Config[]>;

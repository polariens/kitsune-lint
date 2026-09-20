import type { Linter } from 'eslint';

export interface SecurityOptions {
  /** File patterns override */
  files?: string[];
  /** Habilitar eslint-plugin-security @default true */
  pluginEnabled?: boolean;
  /** Regras adicionais ou overrides */
  rules?: Partial<Linter.RulesRecord>;
}

export declare function security(options?: SecurityOptions): Linter.Config[];

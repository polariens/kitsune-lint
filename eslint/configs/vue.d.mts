import type { Linter } from 'eslint';

export type VueApiStyle = 'script-setup' | 'composition' | 'options';

export interface VueOptions {
  /** File patterns override */
  files?: string[];
  /** Estilo de API Vue preferido @default 'script-setup' */
  apiStyle?: VueApiStyle;
  /** Regras adicionais ou overrides */
  rules?: Partial<Linter.RulesRecord>;
}

export declare function vue(options?: VueOptions): Linter.Config[];

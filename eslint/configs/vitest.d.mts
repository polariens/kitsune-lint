import type { Linter } from 'eslint';

export type VitestFn = 'test' | 'it';

export interface VitestOptions {
  /** File patterns override */
  files?: string[];
  /** Regex para validação de títulos de testes @default Gherkin PT-BR */
  titlePattern?: string;
  /** Mensagem de erro para títulos inválidos */
  titleMessage?: string;
  /** Função de teste preferida @default 'test' */
  fn?: VitestFn;
  /** Máximo de describe aninhados @default 3 */
  maxNestedDescribe?: number;
  /** Regras adicionais ou overrides */
  rules?: Partial<Linter.RulesRecord>;
}

export declare function vitest(options?: VitestOptions): Promise<Linter.Config[]>;

import type { Linter } from 'eslint';

export interface CleanCodeOptions {
  /** File patterns override */
  files?: string[];
  /** Profundidade máxima de aninhamento @default 4 */
  maxDepth?: number;
  /** Número máximo de parâmetros por função @default 4 */
  maxParams?: number;
  /** Complexidade ciclomática máxima @default 14 */
  complexity?: number;
  /** Linhas máximas por arquivo @default 400 */
  maxLines?: number;
  /** Linhas máximas por função @default 80 */
  maxLinesPerFunction?: number;
  /** Regras adicionais ou overrides */
  rules?: Partial<Linter.RulesRecord>;
}

export declare function cleanCode(options?: CleanCodeOptions): Linter.Config[];

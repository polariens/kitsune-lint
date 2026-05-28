import type { Linter } from 'eslint';

export type VueApiStyle = 'script-setup' | 'composition' | 'options';

export type NameCasing = 'camelCase' | 'PascalCase' | 'kebab-case' | 'snake_case';


export interface VueOptions {
  /** File patterns override */
  files?: string[];
  /** Estilo de API Vue preferido @default 'script-setup' */
  apiStyle?: VueApiStyle;
  /** Nomeclatura para nomes de componentes @default 'PascalCase' */
  componentsNameCasing?: NameCasing;
  /** Padrões de componentes ignorados para validação de nomenclatura @default 'PascalCase' */
  componentsNameCasingIgnores?: string[];
  /** Nomeclatura para nomes de propriedades @default 'camelCase' */
  propNameCasing?: NameCasing;
  /** Nomeclatura para nomes de slots @default 'kebab-case' */
  slotNameCasing?: NameCasing;
  /** Profundidade máxima de aninhamento no template @default 6 */
  maxTemplateDepth?: number;
  /** Regras adicionais ou overrides */
  rules?: Partial<Linter.RulesRecord>;
}

export declare function vue(options?: VueOptions): Linter.Config[];

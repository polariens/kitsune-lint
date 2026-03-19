export interface PrettierConfig {
  /** Largura máxima da linha @default 100 */
  printWidth?: number;
  /** Espaços por nível de indentação @default 2 */
  tabWidth?: number;
  /** Usar tabs ao invés de espaços @default false */
  useTabs?: boolean;
  /** Adicionar ponto e vírgula no final @default true */
  semi?: boolean;
  /** Usar aspas simples @default true */
  singleQuote?: boolean;
  /** Estilo de trailing comma @default 'es5' */
  trailingComma?: 'all' | 'es5' | 'none';
  /** Espaços dentro de chaves de objetos @default true */
  bracketSpacing?: boolean;
  /** Colocar > de tags na mesma linha @default false */
  bracketSameLine?: boolean;
  /** Parênteses em arrow functions @default 'always' */
  arrowParens?: 'always' | 'avoid';
  /** Quebra de linha em prosa (markdown) @default 'never' */
  proseWrap?: 'always' | 'never' | 'preserve';
  /** Sensibilidade a espaços em HTML @default 'strict' */
  htmlWhitespaceSensitivity?: 'css' | 'strict' | 'ignore';
  /** Estilo de fim de linha @default 'lf' */
  endOfLine?: 'lf' | 'crlf' | 'cr' | 'auto';
  /** Aspas em propriedades de objeto @default 'as-needed' */
  quoteProps?: 'as-needed' | 'consistent' | 'preserve';
  /** Formatar código embutido em template literals @default 'auto' */
  embeddedLanguageFormatting?: 'auto' | 'off';
  /** Indentação dentro de <script> e <style> em Vue SFCs @default false */
  vueIndentScriptAndStyle?: boolean;
}

export interface PrettierVueOptions {
  /** Indentação dentro de <script> e <style> em Vue SFCs @default false */
  vueIndentScriptAndStyle?: boolean;
}

export declare const prettierConfig: PrettierConfig;

export declare function createPrettierConfig(
  overrides?: Partial<PrettierConfig>,
  vueOptions?: PrettierVueOptions
): PrettierConfig;

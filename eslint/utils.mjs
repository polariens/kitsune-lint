export const FILE_PATTERNS = {
  all: ['**/*.{vue,js,mjs,cjs,ts}'],
  tests: ['tests/**/*.{js,mjs,cjs,ts}'],
  vue: ['**/*.vue'],
  pinia: ['src/state/**/*.{ts}'],
  configs: ['**/*.config.{js,mjs,cjs,ts}'],
};

export const IGNORE_PATTERNS = ['coverage', 'dist', 'node_modules'];

/**
 * Mescla file patterns customizados com os padrões.
 * @param {string} key - Chave do FILE_PATTERNS a usar como base
 * @param {string[] | undefined} custom - Patterns adicionais do consumidor
 * @returns {string[]}
 */
export function resolveFiles(key, custom) {
  if (custom) return custom;
  return FILE_PATTERNS[key] ?? FILE_PATTERNS.all;
}

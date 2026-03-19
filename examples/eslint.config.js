/**
 * Exemplo de eslint.config.js consumindo @merieli/kitsune-lint.
 * Copie para o projeto e ajuste conforme necessário.
 */
import eslintConfigPrettier from 'eslint-config-prettier';

import { createConfig } from '@merieli/kitsune-lint/eslint';

/** @type {import('eslint').Linter.Config[]} */
export default await createConfig({
  vue: true,
  vitest: true,
  extend: [eslintConfigPrettier],
});

/**
 * Exemplo de eslint.config.js consumindo @polariens/kitsune-lint.
 * Copie para o projeto e ajuste conforme necessário.
 */
import eslintConfigPrettier from 'eslint-config-prettier';

import { createKitsuneConfig } from '@polariens/kitsune-lint/eslint';

/** @type {import('eslint').Linter.Config[]} */
export default await createKitsuneConfig({
  vue: true,
  vitest: true,
  extend: [eslintConfigPrettier],
});

#!/usr/bin/env node

import { cpSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = resolve(__dirname, '..', 'prettier', '.prettierignore');
const dest = resolve(process.cwd(), '.prettierignore');

const force = process.argv.includes('--force');

if (existsSync(dest) && !force) {
  const existing = readFileSync(dest, 'utf-8');
  const template = readFileSync(source, 'utf-8');

  if (existing === template) {
    console.info('[lint-config] .prettierignore já está atualizado.');
    process.exit(0);
  }

  console.error(
    '[lint-config] .prettierignore já existe e difere do template.\n' +
      '  Use --force para sobrescrever.'
  );
  process.exit(1);
}

cpSync(source, dest);
console.info(`[lint-config] .prettierignore copiado para ${dest}`);

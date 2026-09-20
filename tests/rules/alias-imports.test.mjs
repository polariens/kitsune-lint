import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import path from 'node:path';
import aliasImportsRule from '../../eslint/rules/alias-imports.mjs';

globalThis.describe = describe;
globalThis.it = it;

const rootDir = process.cwd();
const resolvePath = (relative) => path.resolve(rootDir, relative);

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('alias-imports', aliasImportsRule, {
  valid: [
    {
      code: "import foo from '@/components/Button';",
      filename: resolvePath('src/components/Button.ts'),
    },
    {
      code: "import { something } from '#tests/utils';",
      filename: resolvePath('src/components/Button.ts'),
    },
    {
      code: "import pkg from 'pkg';",
      filename: resolvePath('src/components/Button.ts'),
    },
    {
      code: "import './local-style';",
      filename: resolvePath('src/components/Button.ts'),
    },
    {
      code: "import bar from '~lib/core/helper';",
      filename: resolvePath('src/components/Button.ts'),
      options: [[{ prefix: 'lib/', alias: '~lib/' }]],
    },
    {
      code: "import bar from '~lib/core/helper';\nimport baz from '@/components/Button';",
      filename: resolvePath('src/components/Button.ts'),
      options: [[
        { prefix: 'lib/', alias: '~lib/' },
        { prefix: 'src/', alias: '@/' },
      ]],
    },
  ],
  invalid: [
    {
      code: "import bar from 'lib/core/helper';\nimport baz from 'src/components/Button';",
      filename: resolvePath('src/components/Button.ts'),
      options: [[
        { prefix: 'lib/', alias: '~lib/' },
        { prefix: 'src/', alias: '@/' },
      ]],
      errors: [
        { message: 'Utilize o path alias "~lib/core/helper" em vez de "lib/core/helper".' },
        { message: 'Utilize o path alias "@/components/Button" em vez de "src/components/Button".' },
      ],
      output: "import bar from '~lib/core/helper';\nimport baz from '@/components/Button';",
    },
    {
      code: "import bar from 'lib/core/helper';",
      filename: resolvePath('src/components/Button.ts'),
      options: [[{ prefix: 'lib/', alias: '~lib/' }]],
      errors: [{ message: 'Utilize o path alias "~lib/core/helper" em vez de "lib/core/helper".' }],
      output: "import bar from '~lib/core/helper';",
    },
    {
      code: "import { something } from 'tests/utils';",
      filename: resolvePath('src/components/Button.ts'),
      errors: [{ message: 'Utilize o path alias "#tests/utils" em vez de "tests/utils".' }],
      output: "import { something } from '#tests/utils';",
    },
    {
      code: "import foo from 'src/components/Button';",
      filename: resolvePath('src/components/Button.ts'),
      errors: [{ message: 'Utilize o path alias "@/components/Button" em vez de "src/components/Button".' }],
      output: "import foo from '@/components/Button';",
    },
    {
      code: "import { something } from '../../tests/utils';",
      filename: resolvePath('src/components/Button.ts'),
      errors: [{ message: 'Utilize o path alias "#tests/utils" em vez de "../../tests/utils".' }],
      output: "import { something } from '#tests/utils';",
    },
    {
      code: "import pkg from '../package.json';",
      filename: resolvePath('src/Button.ts'),
      errors: [{ message: 'Utilize o path alias "pkg" em vez de "../package.json".' }],
      output: "import pkg from 'pkg';",
    },
    {
      code: "import pkg from './package.json';",
      filename: resolvePath('package.json'),
      errors: [{ message: 'Utilize o path alias "pkg" em vez de "./package.json".' }],
      output: "import pkg from 'pkg';",
    },
    {
      code: "import pkg from 'package.json';",
      filename: resolvePath('src/components/Button.ts'),
      errors: [{ message: 'Utilize o path alias "pkg" em vez de "package.json".' }],
      output: "import pkg from 'pkg';",
    },
    {
      code: "export * from '../../tests/utils';",
      filename: resolvePath('src/components/Button.ts'),
      errors: [{ message: 'Utilize o path alias "#tests/utils" em vez de "../../tests/utils".' }],
      output: "export * from '#tests/utils';",
    },
  ],
});

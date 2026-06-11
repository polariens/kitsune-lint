import { RuleTester } from 'eslint';
import aliasImportsRule from '../eslint/rules/alias-imports.mjs';

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
      filename: '/home/merieli/projects/kitsune-lint/src/components/Button.ts',
    },
    {
      code: "import { something } from '#tests/utils';",
      filename: '/home/merieli/projects/kitsune-lint/src/components/Button.ts',
    },
    {
      code: "import pkg from 'pkg';",
      filename: '/home/merieli/projects/kitsune-lint/src/components/Button.ts',
    },
    {
      code: "import './local-style';",
      filename: '/home/merieli/projects/kitsune-lint/src/components/Button.ts',
    },
  ],
  invalid: [
    {
      code: "import foo from 'src/components/Button';",
      filename: '/home/merieli/projects/kitsune-lint/src/components/Button.ts',
      errors: [{ message: 'Utilize o path alias "@/components/Button" em vez de "src/components/Button".' }],
      output: "import foo from '@/components/Button';",
    },
    {
      code: "import { something } from '../../tests/utils';",
      filename: '/home/merieli/projects/kitsune-lint/src/components/Button.ts',
      errors: [{ message: 'Utilize o path alias "#tests/utils" em vez de "../../tests/utils".' }],
      output: "import { something } from '#tests/utils';",
    },
    {
      code: "import pkg from '../package.json';",
      filename: '/home/merieli/projects/kitsune-lint/src/components/Button.ts',
      errors: [{ message: 'Utilize o path alias "pkg" em vez de "../package.json".' }],
      output: "import pkg from 'pkg';",
    },
    {
      code: "import pkg from './package.json';",
      filename: '/home/merieli/projects/kitsune-lint/package.json',
      errors: [{ message: 'Utilize o path alias "pkg" em vez de "./package.json".' }],
      output: "import pkg from 'pkg';",
    },
    {
      code: "import pkg from 'package.json';",
      filename: '/home/merieli/projects/kitsune-lint/src/components/Button.ts',
      errors: [{ message: 'Utilize o path alias "pkg" em vez de "package.json".' }],
      output: "import pkg from 'pkg';",
    },
    {
      code: "export * from '../tests/utils';",
      filename: '/home/merieli/projects/kitsune-lint/src/components/Button.ts',
      errors: [{ message: 'Utilize o path alias "#tests/utils" em vez de "../tests/utils".' }],
      output: "export * from '#tests/utils';",
    },
  ],
});

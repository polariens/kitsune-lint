import { RuleTester } from 'eslint';
import tsParser from 'typescript-eslint';
import { describe, it } from 'vitest';
import noNullInTypesRule from '../../eslint/rules/no-null-in-types.mjs';

globalThis.describe = describe;
globalThis.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser.parser,
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-null-in-types', noNullInTypesRule, {
  valid: [
    {
      code: `
        interface User {
          name: string;
          age?: number;
        }
      `,
    },
    {
      code: `
        type User = {
          name: string;
          age?: number;
        };
      `,
    },
    {
      code: `
        interface UserApiResponse {
          name: string | null;
          avatar: null;
        }
      `,
    },
    {
      code: `
        type UserApiResponse = {
          data: string | null;
        };
      `,
    },
    {
      code: `
        interface CustomPayloadDTO {
          details: string | null;
        }
      `,
      options: [{ skipPattern: 'DTO' }],
    },
    {
      code: `
        type CustomResponse = {
          details: string | null;
        };
      `,
      options: [{ skipPattern: ['DTO', 'Response'] }],
    },
  ],
  invalid: [
    {
      code: `
        interface User {
          name: string | null;
        }
      `,
      errors: [
        {
          message:
            'Type "User" uses `null`; only interfaces/types whose name contains "Api" may contain `null`.',
        },
      ],
    },
    {
      code: `
        type User = {
          id: number;
          deletedAt: Date | null;
        };
      `,
      errors: [
        {
          message:
            'Type "User" uses `null`; only interfaces/types whose name contains "Api" may contain `null`.',
        },
      ],
    },
    {
      code: `
        interface UserProfile {
          bio: string | null;
        }
      `,
      options: [{ skipPattern: ['External', 'Remote'] }],
      errors: [
        {
          message:
            'Type "UserProfile" uses `null`; only interfaces/types whose name contains "External, Remote" may contain `null`.',
        },
      ],
    },
  ],
});

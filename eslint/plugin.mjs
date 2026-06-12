import aliasImports from './rules/alias-imports.mjs';
import noNullInTypes from './rules/no-null-in-types.mjs';

export const kitsunePlugin = {
  rules: {
    'alias-imports': aliasImports,
    'no-null-in-types': noNullInTypes,
  },
};

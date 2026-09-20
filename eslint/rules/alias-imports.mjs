import path from 'node:path';

const DEFAULT_ALIAS_RULES = [
  { prefix: 'src/', alias: '@/' },
  { prefix: 'tests/', alias: '#tests/' },
];

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Auto-correct relative or absolute imports to use configured aliases (@, #tests, pkg).',
      category: 'Possible Errors',
      recommended: false,
    },
    fixable: 'code',
    messages: {
      useAlias: 'Utilize o path alias "{{alias}}" em vez de "{{importPath}}".',
    },
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            prefix: { type: 'string' },
            alias: { type: 'string' },
          },
          required: ['prefix', 'alias'],
          additionalProperties: false,
        },
      },
    ],
  },

  create(context) {
    const rootDir = context.cwd || process.cwd();
    const currentFile = context.filename || context.getFilename();
    const userRules = context.options[0] || [];
    const aliasRules = userRules.length > 0 ? userRules : DEFAULT_ALIAS_RULES;

    function checkImport(node) {
      if (!node.source || typeof node.source.value !== 'string') {
        return;
      }

      const importPath = node.source.value;
      let targetAlias = null;

      // Helper to resolve paths to root relative normalized path
      function getNormalizedRelative(pathStr) {
        const fileDir = path.dirname(currentFile);
        const absoluteImported = path.resolve(fileDir, pathStr);
        const relativeToRoot = path.relative(rootDir, absoluteImported);
        return relativeToRoot.split(path.sep).join('/');
      }

      // 1. Check if the import targets the root package.json
      const isPotentialPackageJson = importPath === 'package.json' ||
        importPath === './package.json' ||
        importPath.startsWith('../') ||
        aliasRules.some(rule => importPath.startsWith(rule.prefix));

      if (isPotentialPackageJson) {
        const normalizedRelative = getNormalizedRelative(importPath);
        if (normalizedRelative === 'package.json' || importPath === 'package.json') {
          targetAlias = 'pkg';
        }
      }

      // 2. Check path rules
      if (!targetAlias) {
        const matchingRule = aliasRules.find(rule => importPath.startsWith(rule.prefix));
        if (matchingRule) {
          targetAlias = importPath.replace(new RegExp(`^${matchingRule.prefix}`), matchingRule.alias);
        } else if (importPath.startsWith('../')) {
          const normalizedRelative = getNormalizedRelative(importPath);
          const relativeMatchingRule = aliasRules.find(rule => normalizedRelative.startsWith(rule.prefix));
          if (relativeMatchingRule) {
            targetAlias = normalizedRelative.replace(new RegExp(`^${relativeMatchingRule.prefix}`), relativeMatchingRule.alias);
          }
        }
      }

      if (targetAlias && targetAlias !== importPath) {
        context.report({
          node: node.source,
          messageId: 'useAlias',
          data: {
            alias: targetAlias,
            importPath,
          },
          fix(fixer) {
            // Keep the same quote style
            const quote = node.source.raw ? node.source.raw[0] : "'";
            return fixer.replaceText(node.source, `${quote}${targetAlias}${quote}`);
          },
        });
      }
    }

    return {
      ImportDeclaration(node) {
        checkImport(node);
      },
      ExportNamedDeclaration(node) {
        checkImport(node);
      },
      ExportAllDeclaration(node) {
        checkImport(node);
      },
      ImportExpression(node) {
        checkImport(node);
      },
    };
  },
};

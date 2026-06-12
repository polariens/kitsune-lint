import path from 'node:path';

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
    schema: [],
  },

  create(context) {
    const rootDir = context.cwd || process.cwd();
    const currentFile = context.filename || context.getFilename();

    function checkImport(node) {
      if (!node.source || typeof node.source.value !== 'string') {
        return;
      }

      const importPath = node.source.value;
      let targetAlias = null;

      // 1. Check if the import targets the root package.json
      if (importPath === 'package.json' || importPath === './package.json' || importPath.startsWith('../') || importPath.startsWith('src/')) {
        const fileDir = path.dirname(currentFile);
        const absoluteImported = path.resolve(fileDir, importPath);
        const relativeToRoot = path.relative(rootDir, absoluteImported);
        const normalizedRelative = relativeToRoot.split(path.sep).join('/');

        if (normalizedRelative === 'package.json' || importPath === 'package.json') {
          targetAlias = 'pkg';
        }
      }

      // 2. If it's not package.json, check for other aliases if they start with 'src/' or '../'
      if (!targetAlias) {
        if (importPath.startsWith('src/')) {
          // e.g. "src/components/Button" -> "@/components/Button"
          targetAlias = importPath.replace(/^src\//, '@/');
        } else if (importPath.startsWith('../')) {
          const fileDir = path.dirname(currentFile);
          const absoluteImported = path.resolve(fileDir, importPath);
          const relativeToRoot = path.relative(rootDir, absoluteImported);
          const normalizedRelative = relativeToRoot.split(path.sep).join('/');

          if (normalizedRelative.startsWith('src/')) {
            targetAlias = normalizedRelative.replace(/^src\//, '@/');
          } else if (normalizedRelative.startsWith('tests/')) {
            targetAlias = normalizedRelative.replace(/^tests\//, '#tests/');
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

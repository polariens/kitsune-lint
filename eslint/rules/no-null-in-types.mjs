/**
 * Custom ESLint rule: disallow `null` in interfaces/types unless
 * the interface/type name contains a specific string defined via
 * configuration. Default is "Api".
 *
 * @file
 */
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow `null` in interfaces/types unless the name contains a configured string.',
      category: 'Possible Errors',
      recommended: false,
    },
    messages: {
      noNull:
        'Type "{{name}}" uses `null`; only interfaces/types whose name contains "{{skipPattern}}" may contain `null`.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          skipPattern: {
            oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' }, minItems: 1 }],
            description:
              'String or array of strings that, if present in the type name, skips the null check.',
            default: 'Api',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options?.[0] ?? {};
    let skipPatterns = options.skipPattern ?? 'Api';
    if (!Array.isArray(skipPatterns)) {
      skipPatterns = [skipPatterns];
    }

    /**
     * Detects if a type node contains a `null` literal.
     *
     * @param {TSESTree.TSType} node
     * @returns {boolean}
     */
    function containsNull(node) {
      if (!node) return false;

      switch (node.type) {
        case AST_NODE_TYPES.TSNullKeyword:
          return true;
        case AST_NODE_TYPES.TSUnionType:
          return node.types.some(containsNull);
        case AST_NODE_TYPES.TSTypeAnnotation:
          return containsNull(node.typeAnnotation);
        case AST_NODE_TYPES.TSTypeLiteral:
          // Check members only for object literal types
          return node.members.some(
            (m) =>
              m.type === AST_NODE_TYPES.TSPropertySignature &&
              containsNull(m.typeAnnotation?.typeAnnotation),
          );
        default:
          return false;
      }
    }

    /**
     * Handles property signatures inside interfaces or type literals.
     *
     * @param {TSESTree.TSPropertySignature} prop
     * @param {string} typeName
     */
    function checkProperty(prop, typeName) {
      const typeNode = prop.typeAnnotation?.typeAnnotation;
      if (typeNode && containsNull(typeNode)) {
        context.report({
          node: prop,
          messageId: 'noNull',
          data: { name: typeName, skipPattern: skipPatterns.join(', ') },
        });
      }
    }

    return {
      TSInterfaceDeclaration(node) {
        const name = node.id?.name;
        if (!name || skipPatterns.some((pattern) => name.includes(pattern))) return; // skip based on config

        node.body.body.forEach((member) => {
          if (member.type === AST_NODE_TYPES.TSPropertySignature) {
            checkProperty(member, name);
          }
        });
      },

      TSTypeAliasDeclaration(node) {
        const name = node.id?.name;
        if (!name || skipPatterns.some((pattern) => name.includes(pattern))) return; // skip based on config

        if (node.typeAnnotation.type === 'TSTypeLiteral') {
          node.typeAnnotation.members.forEach((member) => {
            if (member.type === AST_NODE_TYPES.TSPropertySignature) {
              checkProperty(member, name);
            }
          });
        }
      },
    };
  },
};

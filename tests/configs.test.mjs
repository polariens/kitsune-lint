import { describe, expect, it } from 'vitest';
import { createKitsuneConfig } from '../eslint/index.mjs';
import { mergeConfigRules } from '../eslint/utils/merge.mjs';

describe('Kitsune ESLint Config Merging', () => {
  it('should successfully merge no-restricted-syntax rules from typescript and clean-code', async () => {
    const config = await createKitsuneConfig({
      typescript: true,
      cleanCode: true,
    });

    // Find all blocks that define 'no-restricted-syntax' and do not turn it 'off'
    const blocksWithRule = config.filter(
      (block) => block.rules && block.rules['no-restricted-syntax'] && block.rules['no-restricted-syntax'] !== 'off'
    );

    expect(blocksWithRule.length).toBeGreaterThan(0);

    // The rule in the blocks should contain all selectors merged
    for (const block of blocksWithRule) {
      const ruleValue = block.rules['no-restricted-syntax'];
      expect(Array.isArray(ruleValue)).toBe(true);
      expect(ruleValue[0]).toBe('error');

      const selectors = ruleValue.slice(1).map((opt) => opt.selector);

      // Should contain the typescript rule selectors
      expect(selectors).toContain('ExportDefaultDeclaration');
      expect(selectors).toContain('ImportDeclaration[specifiers.length = 0]');

      // Should contain the clean-code rule selectors
      expect(selectors).toContain('IfStatement > BlockStatement > IfStatement');
    }
  });

  describe('Specific merge strategies by rule type', () => {
    it('should merge no-restricted-globals correctly by name', () => {
      const mockConfigs = [
        {
          files: ['**/*.js'],
          rules: {
            'no-restricted-globals': [
              'error',
              { name: 'event', message: 'Use local event.' },
              'fdescribe',
            ],
          },
        },
        {
          files: ['**/*.js'],
          rules: {
            'no-restricted-globals': [
              'error',
              { name: 'event', message: 'Event is forbidden.' }, // duplicate name
              'fit',
            ],
          },
        },
      ];

      const result = mergeConfigRules(mockConfigs);
      const ruleVal = result[0].rules['no-restricted-globals'];

      expect(ruleVal[0]).toBe('error');
      const names = ruleVal.slice(1).map(opt => typeof opt === 'object' ? opt.name : opt);
      expect(names).toEqual(['event', 'fdescribe', 'fit']);
    });

    it('should merge no-restricted-properties correctly by object+property', () => {
      const mockConfigs = [
        {
          files: ['**/*.js'],
          rules: {
            'no-restricted-properties': [
              'error',
              { object: 'arguments', property: 'callee', message: 'arguments.callee is forbidden' },
            ],
          },
        },
        {
          files: ['**/*.js'],
          rules: {
            'no-restricted-properties': [
              'error',
              { object: 'arguments', property: 'callee', message: 'Duplicated arguments.callee' },
              { object: 'Object', property: 'assign' },
            ],
          },
        },
      ];

      const result = mergeConfigRules(mockConfigs);
      const ruleVal = result[0].rules['no-restricted-properties'];

      expect(ruleVal[0]).toBe('error');
      const properties = ruleVal.slice(1).map(opt => `${opt.object}.${opt.property}`);
      expect(properties).toEqual(['arguments.callee', 'Object.assign']);
    });

    it('should merge no-restricted-imports correctly with paths and patterns', () => {
      const mockConfigs = [
        {
          files: ['**/*.js'],
          rules: {
            'no-restricted-imports': [
              'error',
              {
                paths: [
                  { name: 'lodash', message: 'Use lodash-es.' },
                  'react',
                ],
                patterns: ['src/legacy/*'],
              },
            ],
          },
        },
        {
          files: ['**/*.js'],
          rules: {
            'no-restricted-imports': [
              'error',
              {
                paths: [
                  { name: 'lodash', message: 'lodash is blocked.' }, // duplicate name
                  'vue',
                ],
                patterns: ['src/legacy/*', 'dist/*'], // duplicate pattern
              },
              'forbidden-package',
            ],
          },
        },
      ];

      const result = mergeConfigRules(mockConfigs);
      const ruleVal = result[0].rules['no-restricted-imports'];

      expect(ruleVal[0]).toBe('error');

      const objOpt = ruleVal.find(x => typeof x === 'object');
      expect(objOpt).toBeDefined();

      const paths = objOpt.paths.map(p => typeof p === 'object' ? p.name : p);
      expect(paths).toEqual(['lodash', 'react', 'vue']);

      const patterns = objOpt.patterns;
      expect(patterns).toEqual(['src/legacy/*', 'dist/*']);

      const extraStrings = ruleVal.filter(x => typeof x === 'string');
      expect(extraStrings).toContain('forbidden-package');
    });

    it('should merge custom rule patterns when passed in the mergeable list', () => {
      const mockConfigs = [
        {
          files: ['**/*.js'],
          rules: {
            'custom-rule': ['error', 'option-a'],
          },
        },
        {
          files: ['**/*.js'],
          rules: {
            'custom-rule': ['error', 'option-b'],
          },
        },
      ];

      const result = mergeConfigRules(mockConfigs, ['custom-rule']);
      const ruleVal = result[0].rules['custom-rule'];
      expect(ruleVal).toEqual(['error', 'option-a', 'option-b']);
    });
  });

  describe('Vue max-template-depth configuration', () => {
    it('should include vue/max-template-depth with correct default maxDepth', async () => {
      const config = await createKitsuneConfig({
        vue: true,
      });

      const vueBlock = config.find((block) => block.name === '@kitsune/vue/rules');
      expect(vueBlock).toBeDefined();
      expect(vueBlock.rules['vue/max-template-depth']).toEqual([
        'warn',
        { maxDepth: 9 },
      ]);
    });

    it('should allow custom maxTemplateDepth configuration', async () => {
      const config = await createKitsuneConfig({
        vue: { maxTemplateDepth: 8 },
      });

      const vueBlock = config.find((block) => block.name === '@kitsune/vue/rules');
      expect(vueBlock).toBeDefined();
      expect(vueBlock.rules['vue/max-template-depth']).toEqual([
        'warn',
        { maxDepth: 8 },
      ]);
    });
  });

  describe('Config modules loading order', () => {
    it('should load configuration modules in the exact expected order: base -> typescript -> security -> cleanCode -> vue -> pinia -> tests -> vitest', async () => {
      const config = await createKitsuneConfig({
        base: true,
        typescript: true,
        security: true,
        cleanCode: true,
        vue: true,
        pinia: true,
        tests: true,
        vitest: true,
      });

      const baseIdx = config.findIndex((block) => block.name === '@kitsune/base/globals');
      const tsIdx = config.findIndex((block) => block.name === '@kitsune/typescript/rules');
      const secIdx = config.findIndex((block) => block.name === '@kitsune/security/rules');
      const cleanIdx = config.findIndex((block) => block.name === '@kitsune/clean-code/rules');
      const vueIdx = config.findIndex((block) => block.name === '@kitsune/vue/rules');
      const piniaIdx = config.findIndex((block) => block.name === '@kitsune/pinia/rules');
      const testsIdx = config.findIndex((block) => block.name === '@kitsune/tests/relaxations');
      const vitestIdx = config.findIndex((block) => block.name === '@kitsune/vitest/rules');

      // Make sure all blocks are found
      expect(baseIdx).toBeGreaterThan(-1);
      expect(tsIdx).toBeGreaterThan(-1);
      expect(secIdx).toBeGreaterThan(-1);
      expect(cleanIdx).toBeGreaterThan(-1);
      expect(vueIdx).toBeGreaterThan(-1);
      expect(piniaIdx).toBeGreaterThan(-1);
      expect(testsIdx).toBeGreaterThan(-1);
      expect(vitestIdx).toBeGreaterThan(-1);

      // Verify they load in the exact specified order
      expect(baseIdx).toBeLessThan(tsIdx);
      expect(tsIdx).toBeLessThan(secIdx);
      expect(secIdx).toBeLessThan(cleanIdx);
      expect(cleanIdx).toBeLessThan(vueIdx);
      expect(vueIdx).toBeLessThan(piniaIdx);
      expect(piniaIdx).toBeLessThan(testsIdx);
      expect(testsIdx).toBeLessThan(vitestIdx);
    });
  });
});

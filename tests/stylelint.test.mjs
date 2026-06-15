import { describe, expect, it } from 'vitest';
import stylelintConfig, { createStylelintKitsuneConfig } from '../stylelint/index.mjs';

describe('Stylelint Kitsune Config', () => {
  it('should have default extends and rules', () => {
    expect(stylelintConfig.extends).toContain('stylelint-config-standard-scss');
    expect(stylelintConfig.extends).toContain('stylelint-config-recommended-vue/scss');
    expect(stylelintConfig.rules['no-descending-specificity']).toBeNull();
    expect(stylelintConfig.rules['selector-class-pattern']).toBeInstanceOf(Array);
    expect(stylelintConfig.rules['selector-class-pattern'][0]).toContain('^[a-z]+');
    expect(stylelintConfig.rules['declaration-no-important']).toBe(true);
    expect(stylelintConfig.rules['selector-disallowed-list']).toContain('div');
    expect(stylelintConfig.rules['selector-disallowed-list']).not.toContain('body');
  });

  it('should support createStylelintKitsuneConfig with extra extends and rules', () => {
    const customConfig = createStylelintKitsuneConfig({
      extends: ['stylelint-config-prettier'],
      rules: {
        'color-hex-length': 'short',
        'no-descending-specificity': 'error', // override null
      },
    });

    expect(customConfig.extends).toContain('stylelint-config-standard-scss');
    expect(customConfig.extends).toContain('stylelint-config-recommended-vue/scss');
    expect(customConfig.extends).toContain('stylelint-config-prettier');
    
    expect(customConfig.rules['color-hex-length']).toBe('short');
    expect(customConfig.rules['no-descending-specificity']).toBe('error');
    expect(customConfig.rules['selector-class-pattern']).toBeInstanceOf(Array); // remains BEM by default
  });

  it('should merge overrides correctly', () => {
    const customConfig = createStylelintKitsuneConfig({
      overrides: [
        {
          files: ['*.vue'],
          rules: {
            'vue/no-unused-vars': 'error',
          },
        },
      ],
    });

    expect(customConfig.overrides).toHaveLength(1);
    expect(customConfig.overrides[0].files).toContain('*.vue');
    expect(customConfig.overrides[0].rules['vue/no-unused-vars']).toBe('error');
  });



  it('should support classPattern option with BEM', () => {
    const customConfig = createStylelintKitsuneConfig({
      classPattern: 'BEM',
    });

    expect(customConfig.rules['selector-class-pattern']).toBeInstanceOf(Array);
    expect(customConfig.rules['selector-class-pattern'][0]).toContain('^[a-z]+');
    expect(customConfig.rules['selector-class-pattern'][1].resolveNestedSelectors).toBe(true);
  });

  it('should support classPattern option with null', () => {
    const customConfig = createStylelintKitsuneConfig({
      classPattern: null,
      rules: {
        'selector-class-pattern': 'some-other-pattern', // classPattern should override
      },
    });

    expect(customConfig.rules['selector-class-pattern']).toBeNull();
  });
});

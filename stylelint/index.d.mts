export interface StylelintKitsuneConfig {
  extends?: string | string[];
  rules?: Record<string, any>;
  overrides?: Array<{
    files: string | string[];
    extends?: string | string[];
    rules?: Record<string, any>;
  }>;
}

export interface CreateStylelintKitsuneOptions {
  extends?: string[];
  rules?: Record<string, any>;
  overrides?: Array<{
    files: string | string[];
    extends?: string | string[];
    rules?: Record<string, any>;
  }>;
}

export declare const stylelintKitsuneConfig: StylelintKitsuneConfig;

export declare function createStylelintKitsuneConfig(
  options?: CreateStylelintKitsuneOptions
): StylelintKitsuneConfig;

export default stylelintKitsuneConfig;

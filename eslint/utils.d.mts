export type FilePatternKey = 'all' | 'tests' | 'vue' | 'pinia' | 'configs';

export declare const FILE_PATTERNS: Record<FilePatternKey, string[]>;

export declare const IGNORE_PATTERNS: string[];

export declare function resolveFiles(key: FilePatternKey, custom?: string[]): string[];

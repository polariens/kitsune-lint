import type { Linter } from 'eslint';

export interface BaseOptions {
  /** File patterns override */
  files?: string[];
  /** Ambiente de globals a aplicar @default 'browser' */
  environment?: 'browser' | 'node' | 'shared-node-browser' | 'worker' | 'serviceworker';
}

export declare function base(options?: BaseOptions): Linter.Config[];

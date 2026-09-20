# kitsune-lint 🦊

> **English** | [Português](README.pt-BR.md)

Opinionated, modular **ESLint**, **Prettier**, and **Stylelint** configurations for high-quality **Vue 3**, **TypeScript**, and **Vitest** codebases. Clean code with sharp rules.

Helps developers kickstart JavaScript/TypeScript projects without the headache of setting up rules one by one, providing production-ready security, linting, and formatting guardrails out of the box to guarantee clean, secure code — especially in AI-assisted development environments.

Officially maintained by **[Polariens](https://github.com/polariens)**, a non-profit institution dedicated to sustainable open-source software and developer productivity.

> **Kitsune** (狐) is the mythical fox of Japanese folklore — clever, agile, and able to shapeshift to fit any context. Like the kitsune, this package adapts seamlessly to your codebase: select the modules and options you need, and it composes the exact rules for your setup. Clean code with the precision of a fox.

---

## Table of Contents

- [kitsune-lint 🦊](#kitsune-lint-)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Installation](#installation)
    - [1. Core Dependencies (Required)](#1-core-dependencies-required)
    - [2. Full Setup (All Modules)](#2-full-setup-all-modules)
    - [3. Modular Setup (On-demand)](#3-modular-setup-on-demand)
  - [ESLint Configuration](#eslint-configuration)
    - [Factory Function (Recommended)](#factory-function-recommended)
    - [Customizing Modules](#customizing-modules)
    - [Granular Imports](#granular-imports)
    - [Extending External Configs](#extending-external-configs)
  - [Prettier Configuration](#prettier-configuration)
    - [Installation](#installation-1)
    - [Default Usage](#default-usage)
    - [With Overrides](#with-overrides)
  - [Stylelint Configuration](#stylelint-configuration)
    - [Installation](#installation-2)
    - [Default Usage](#default-usage-1)
    - [With Overrides](#with-overrides-1)
  - [CLI Utilities](#cli-utilities)
  - [Module Reference](#module-reference)
    - [Overview](#overview-1)
    - [Detailed Options](#detailed-options)
      - [`base`](#base)
      - [`typescript`](#typescript)
      - [`security`](#security)
      - [`cleanCode`](#cleancode)
      - [`vue`](#vue)
      - [`pinia`](#pinia)
      - [`tests`](#tests)
      - [`vitest`](#vitest)
  - [Package Architecture](#package-architecture)
  - [License and Governance](#license-and-governance)

---

## Overview

`kitsune-lint` provides a standardized, battle-tested toolchain based on ESLint Flat Config (v9+), integrated with Prettier and Stylelint (SCSS & Vue SFCs).

- **Modular Architecture**: Toggle only the modules your project requires (`vue`, `pinia`, `vitest`, etc.).
- **TypeScript First**: Full static typing across all module options via `.d.mts`.
- **Custom AST Rules**: Built-in rules tailored for enterprise codebases (`kitsune/alias-imports` and `kitsune/no-null-in-types`).
- **Zero Lock-in**: Seamlessly compose external plugins and overrides via the `extend` option.

---

## Installation

Install the package as a development dependency:

```bash
npm install --save-dev kitsune-lint
```

> *Note:* If consuming via the organization scope:
> ```bash
> npm install --save-dev @polariens/kitsune-lint
> ```

Install peer dependencies according to your selected modules.

### 1. Core Dependencies (Required)

Required for the default enabled modules (`base`, `typescript`, `cleanCode`):

```bash
npm install --save-dev eslint @eslint/js typescript-eslint globals
```

### 2. Full Setup (All Modules)

If you plan to use all modules (`security`, `cleanCode`, `pinia`, `vitest`, `typescript`, and `vue`):

```bash
npm install --save-dev eslint @eslint/js typescript-eslint globals eslint-plugin-security eslint-plugin-vue vue-eslint-parser eslint-plugin-pinia @vitest/eslint-plugin
```

### 3. Modular Setup (On-demand)

Install only what you enable in your config:

- **`security` module** (enabled by default):
  ```bash
  npm install --save-dev eslint-plugin-security
  ```

- **`vue` module**:
  ```bash
  npm install --save-dev eslint-plugin-vue vue-eslint-parser
  ```

- **`pinia` module**:
  ```bash
  npm install --save-dev eslint-plugin-pinia
  ```

- **`vitest` module**:
  ```bash
  npm install --save-dev @vitest/eslint-plugin
  ```

---

## ESLint Configuration

### Factory Function (Recommended)

`createKitsuneConfig` is an async helper that bundles your active modules into an ESLint Flat Config array:

```javascript
// eslint.config.js or eslint.config.mjs
import { createKitsuneConfig } from 'kitsune-lint/eslint';

export default await createKitsuneConfig({
  vue: true,
  pinia: true,
  tests: true,
  vitest: true,
});
```

> By default, `base`, `typescript`, `security`, and `cleanCode` are **enabled** (`true`). Set them to `false` to disable:

```javascript
export default await createKitsuneConfig({
  security: false,
  vue: true,
});
```

### Customizing Modules

Pass an options object instead of `true` to configure specific rules:

```javascript
// eslint.config.js
import { createKitsuneConfig } from 'kitsune-lint/eslint';

export default await createKitsuneConfig({
  base: {
    environment: 'node', // 'browser' | 'node' | 'shared-node-browser'
  },
  cleanCode: {
    maxDepth: 3,
    maxParams: 3,
    complexity: 10,
    maxLines: 300,
    maxLinesPerFunction: 60,
  },
  vue: {
    apiStyle: 'script-setup', // 'script-setup' | 'composition' | 'options'
    componentsNameCasing: 'PascalCase',
    propNameCasing: 'camelCase',
    maxTemplateDepth: 5,
  },
  pinia: {
    files: ['src/stores/**/*.ts'],
  },
  vitest: {
    fn: 'test', // 'test' | 'it'
    maxNestedDescribe: 2,
  },
});
```

### Granular Imports

For complete control over composition order, import modules individually:

```javascript
// eslint.config.js
import { base } from 'kitsune-lint/eslint/base';
import { typescript } from 'kitsune-lint/eslint/typescript';
import { cleanCode } from 'kitsune-lint/eslint/clean-code';
import { security } from 'kitsune-lint/eslint/security';
import { vue } from 'kitsune-lint/eslint/vue';
import { pinia } from 'kitsune-lint/eslint/pinia';

export default [
  ...base({ environment: 'browser' }),
  ...typescript(),
  ...cleanCode(),
  ...security(),
  ...vue(),
  ...(await pinia()),
];
```

### Extending External Configs

Append third-party configurations (such as `eslint-config-prettier`):

```javascript
// eslint.config.js
import { createKitsuneConfig } from 'kitsune-lint/eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default await createKitsuneConfig({
  vue: true,
  extend: [
    eslintConfigPrettier,
  ],
});
```

---

## Prettier Configuration

Standardized Prettier rules for clean, uniform formatting.

### Installation

```bash
npm install --save-dev prettier
```

### Default Usage

```javascript
// prettier.config.mjs or .prettierrc.mjs
import prettierConfig from 'kitsune-lint/prettier';

export default prettierConfig;
```

### With Overrides

```javascript
// prettier.config.mjs
import { createPrettierKitsuneConfig } from 'kitsune-lint/prettier';

export default createPrettierKitsuneConfig({
  overrides: {
    printWidth: 120,
    singleQuote: true,
  },
  vue: true, // enables indent inside <script> and <style>
});
```

---

## Stylelint Configuration

Rules targeting SCSS and Vue Single File Components (SFCs), enforcing BEM naming conventions by default.

### Installation

```bash
npm install --save-dev stylelint stylelint-config-standard-scss stylelint-config-recommended-vue postcss-html
```

### Default Usage

```javascript
// stylelint.config.mjs
import stylelintConfig from 'kitsune-lint/stylelint';

export default stylelintConfig;
```

### With Overrides

```javascript
// stylelint.config.mjs
import { createStylelintKitsuneConfig } from 'kitsune-lint/stylelint';

export default createStylelintKitsuneConfig({
  classPattern: 'BEM', // 'BEM' | null
  rules: {
    'color-hex-length': 'short',
  },
});
```

---

## CLI Utilities

Synchronize the recommended `.prettierignore` template into your project root:

```bash
npx kitsune-prettierignore
```

To overwrite an existing file:

```bash
npx kitsune-prettierignore --force
```

---

## Module Reference

### Overview

| Module       | Default | Purpose                                                             |
| :----------- | :-----: | :------------------------------------------------------------------ |
| `base`       |  ✅ On   | Environment globals (`browser`, `node`, etc.)                       |
| `typescript` |  ✅ On   | Recommended TS rules, naming conventions, import hygiene            |
| `security`   |  ✅ On   | Injection, eval, and XSS prevention via `eslint-plugin-security`    |
| `cleanCode`  |  ✅ On   | Complexity limits, nesting depth, and function size controls        |
| `vue`        |  ❌ Off  | Vue 3 SFCs, template casing, block ordering, typed props            |
| `pinia`      |  ❌ Off  | Store structure, naming conventions, and best practices             |
| `tests`      |  ❌ Off  | Rule relaxations for test suites (disables strict complexity/lines) |
| `vitest`     |  ❌ Off  | Vitest-specific testing semantics and assertions                    |

---

### Detailed Options

#### `base`

| Option        | Type       | Default     | Description                                                                                        |
| :------------ | :--------- | :---------- | :------------------------------------------------------------------------------------------------- |
| `files`       | `string[]` | `undefined` | Overrides targeted file patterns                                                                   |
| `environment` | `string`   | `'browser'` | Environment globals: `'browser'`, `'node'`, `'shared-node-browser'`, `'worker'`, `'serviceworker'` |

#### `typescript`

| Option           | Type       | Default            | Description                            |
| :--------------- | :--------- | :----------------- | :------------------------------------- |
| `files`          | `string[]` | `undefined`        | Overrides targeted file patterns       |
| `ignores`        | `string[]` | `['dist/**', ...]` | Additional file patterns to ignore     |
| `replaceIgnores` | `string[]` | `undefined`        | Fully replaces default ignore patterns |
| `rules`          | `object`   | `{}`               | Additional or overridden rules         |

#### `security`

| Option          | Type       | Default     | Description                            |
| :-------------- | :--------- | :---------- | :------------------------------------- |
| `files`         | `string[]` | `undefined` | Overrides targeted file patterns       |
| `pluginEnabled` | `boolean`  | `true`      | Toggles `eslint-plugin-security` rules |
| `rules`         | `object`   | `{}`        | Additional or overridden rules         |

#### `cleanCode`

| Option                | Type       | Default     | Description                                        |
| :-------------------- | :--------- | :---------- | :------------------------------------------------- |
| `files`               | `string[]` | `undefined` | Overrides targeted file patterns                   |
| `maxDepth`            | `number`   | `4`         | Maximum block nesting depth                        |
| `maxParams`           | `number`   | `4`         | Maximum parameters per function                    |
| `complexity`          | `number`   | `10`        | Maximum cyclomatic complexity per function         |
| `maxLines`            | `number`   | `400`       | Maximum lines per file (excluding blanks/comments) |
| `maxLinesPerFunction` | `number`   | `80`        | Maximum lines per function body                    |
| `rules`               | `object`   | `{}`        | Additional or overridden rules                     |

#### `vue`

| Option                        | Type       | Default          | Description                                               |
| :---------------------------- | :--------- | :--------------- | :-------------------------------------------------------- |
| `files`                       | `string[]` | `undefined`      | Overrides targeted file patterns                          |
| `apiStyle`                    | `string`   | `'script-setup'` | API style: `'script-setup'`, `'composition'`, `'options'` |
| `componentsNameCasing`        | `string`   | `'PascalCase'`   | Component name casing in template                         |
| `componentsNameCasingIgnores` | `string[]` | `[]`             | Component tags exempt from casing validation              |
| `propNameCasing`              | `string`   | `'camelCase'`    | Props casing validation                                   |
| `slotNameCasing`              | `string`   | `'kebab-case'`   | Slot name casing validation                               |
| `maxTemplateDepth`            | `number`   | `6`              | Maximum template nesting depth                            |
| `rules`                       | `object`   | `{}`             | Additional or overridden rules                            |

#### `pinia`

| Option  | Type                 | Default                 | Description                    |
| :------ | :------------------- | :---------------------- | :----------------------------- |
| `files` | `string[]`           | `['src/state/**/*.ts']` | Targeted Pinia store files     |
| `path`  | `string \| string[]` | `undefined`             | Additional store file paths    |
| `rules` | `object`             | `{}`                    | Additional or overridden rules |

#### `tests`

| Option  | Type       | Default                          | Description                    |
| :------ | :--------- | :------------------------------- | :----------------------------- |
| `files` | `string[]` | `['tests/**/*.{js,mjs,cjs,ts}']` | Files treated as test suites   |
| `rules` | `object`   | `{}`                             | Additional or overridden rules |

#### `vitest`

| Option              | Type       | Default        | Description                                 |
| :------------------ | :--------- | :------------- | :------------------------------------------ |
| `files`             | `string[]` | `undefined`    | Overrides targeted file patterns            |
| `fn`                | `string`   | `'test'`       | Preferred test function: `'test'` or `'it'` |
| `titlePattern`      | `string`   | Gherkin format | Test title validation regex                 |
| `titleMessage`      | `string`   | Custom message | Error message for invalid test titles       |
| `maxNestedDescribe` | `number`   | `3`            | Maximum nested `describe` blocks            |
| `rules`             | `object`   | `{}`           | Additional or overridden rules              |

---

## Package Architecture

```
kitsune-lint/
├── bin/
│   └── copy-prettierignore.mjs   # CLI utility (npx kitsune-prettierignore)
├── eslint/
│   ├── index.mjs                 # Factory createKitsuneConfig + module exports
│   ├── index.d.mts               # TypeScript definitions
│   ├── plugin.mjs                # Internal 'kitsune' ESLint plugin
│   ├── utils.mjs                 # Shared file pattern resolvers
│   ├── configs/                  # Modular rule sets
│   │   ├── base.mjs
│   │   ├── clean-code.mjs
│   │   ├── pinia.mjs
│   │   ├── security.mjs
│   │   ├── tests.mjs
│   │   ├── typescript.mjs
│   │   ├── vitest.mjs
│   │   └── vue.mjs
│   └── rules/                    # Custom AST rules
│       ├── alias-imports.mjs
│       └── no-null-in-types.mjs
├── prettier/
│   ├── index.mjs                 # Prettier configuration & factory
│   └── index.d.mts
├── stylelint/
│   ├── index.mjs                 # Stylelint configuration & factory
│   └── index.d.mts
├── LICENSE
├── README.md                     # Documentation (English - Default)
├── README.pt-BR.md               # Documentation (Portuguese)
└── package.json
```

---

## License and Governance

Distributed under the **MIT License**. See `LICENSE` for details.

Maintained by **[Polariens](https://github.com/polariens)** — A non-profit institution advancing developer tooling and open-source infrastructure for modern web engineering.

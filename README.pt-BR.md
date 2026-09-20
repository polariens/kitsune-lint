# kitsune-lint 🦊

> **Português** | [English](README.md)

Configurações opinativas de **ESLint**, **Prettier** e **Stylelint** para projetos de alta qualidade em **Vue 3**, **TypeScript** e **Vitest**. Código limpo com regras afiadas.

Ajuda desenvolvedores a iniciar projetos JavaScript/TypeScript sem a complexidade de configurar regra por regra, entregando padrões rigorosos de linting, segurança e qualidade já travados para garantir código limpo e seguro — especialmente em bases aceleradas por Inteligência Artificial.

Mantido oficialmente pela **[Polariens](https://github.com/polariens)**, uma instituição sem fins lucrativos focada em tecnologia aberta e impacto comunitário.

> **Kitsune** (狐) é a raposa mística do folclore japonês — astuta, adaptável e capaz de se transformar conforme o contexto. Assim como a kitsune, este pacote se molda ao seu projeto: você escolhe os módulos e as opções, e ele compõe as regras certas para cada cenário. Código limpo com a precisão de uma raposa.

---

## Sumário

- [kitsune-lint 🦊](#kitsune-lint-)
  - [Sumário](#sumário)
  - [O que é](#o-que-é)
  - [Instalação](#instalação)
    - [1. Dependências Básicas (Obrigatório)](#1-dependências-básicas-obrigatório)
    - [2. Instalação Completa (Todos os módulos)](#2-instalação-completa-todos-os-módulos)
    - [3. Instalação Modular (Por Demanda)](#3-instalação-modular-por-demanda)
  - [ESLint](#eslint)
    - [Factory Function (Recomendado)](#factory-function-recomendado)
    - [Customizando Módulos](#customizando-módulos)
    - [Imports Granulares](#imports-granulares)
    - [Estendendo Configurações Externas](#estendendo-configurações-externas)
  - [Prettier](#prettier)
    - [Instalação](#instalação-1)
    - [Uso Padrão](#uso-padrão)
    - [Com Overrides](#com-overrides)
  - [Stylelint](#stylelint)
    - [Instalação](#instalação-2)
    - [Uso Padrão](#uso-padrão-1)
    - [Com Overrides](#com-overrides-1)
  - [CLI e Utilitários](#cli-e-utilitários)
  - [Referência dos Módulos](#referência-dos-módulos)
    - [Visão Geral](#visão-geral)
    - [Opções Detalhadas](#opções-detalhadas)
      - [`base`](#base)
      - [`typescript`](#typescript)
      - [`security`](#security)
      - [`cleanCode`](#cleancode)
      - [`vue`](#vue)
      - [`pinia`](#pinia)
      - [`tests`](#tests)
      - [`vitest`](#vitest)
  - [Estrutura do Pacote](#estrutura-do-pacote)
  - [Licença e Governança](#licença-e-governança)

---

## O que é

O `kitsune-lint` padroniza regras de linting, formatação e qualidade de código através do formato moderno Flat Config do ESLint (v9+), além de integrar Prettier e Stylelint (SCSS & Vue SFC).

- **Modular**: Ative apenas o que seu projeto utiliza (`vue`, `pinia`, `vitest`, etc.).
- **TypeScript First**: Tipagem nativa completa para todas as opções (`.d.mts`).
- **Regras Customizadas**: Regras AST exclusivas (`kitsune/alias-imports` e `kitsune/no-null-in-types`).
- **Zero Lock-in**: Compatível com extensões e plugins de terceiros via `extend`.

---

## Instalação

Instale o pacote principal como dependência de desenvolvimento:

```bash
npm install --save-dev kitsune-lint
```

> *Nota:* Se o seu projeto estiver consumindo via escopo da organização:
> ```bash
> npm install --save-dev @polariens/kitsune-lint
> ```

As *peer dependencies* devem ser instaladas no projeto consumidor de acordo com os módulos desejados.

### 1. Dependências Básicas (Obrigatório)

Essenciais para os módulos base que vêm ativos por padrão (`base`, `typescript`, `cleanCode`):

```bash
npm install --save-dev eslint @eslint/js typescript-eslint globals
```

### 2. Instalação Completa (Todos os módulos)

Para projetos que utilizam a suíte completa (TypeScript + Vue 3 + Pinia + Vitest + Security):

```bash
npm install --save-dev eslint @eslint/js typescript-eslint globals eslint-plugin-security eslint-plugin-vue vue-eslint-parser eslint-plugin-pinia @vitest/eslint-plugin
```

### 3. Instalação Modular (Por Demanda)

Instale apenas os plugins necessários para os módulos que for ativar:

- **Módulo `security`** (ativo por padrão):
  ```bash
  npm install --save-dev eslint-plugin-security
  ```

- **Módulo `vue`**:
  ```bash
  npm install --save-dev eslint-plugin-vue vue-eslint-parser
  ```

- **Módulo `pinia`**:
  ```bash
  npm install --save-dev eslint-plugin-pinia
  ```

- **Módulo `vitest`**:
  ```bash
  npm install --save-dev @vitest/eslint-plugin
  ```

---

## ESLint

### Factory Function (Recomendado)

O método `createKitsuneConfig` é assíncrono e unifica as regras ativando/desativando módulos de forma declarativa:

```javascript
// eslint.config.js ou eslint.config.mjs
import { createKitsuneConfig } from 'kitsune-lint/eslint';

export default await createKitsuneConfig({
  vue: true,
  pinia: true,
  tests: true,
  vitest: true,
});
```

> Por padrão, `base`, `typescript`, `security` e `cleanCode` vêm **ativados** (`true`). Para desligar algum, basta passar `false`:

```javascript
export default await createKitsuneConfig({
  security: false,
  vue: true,
});
```

### Customizando Módulos

Em vez de `true`, passe um objeto com opções específicas:

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

### Imports Granulares

Para controle manual completo da composição da configuração:

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

### Estendendo Configurações Externas

Adicione regras e plugins externos diretamente pela chave `extend`:

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

## Prettier

Configuração com regras estritas para consistência visual.

### Instalação

```bash
npm install --save-dev prettier
```

### Uso Padrão

```javascript
// prettier.config.mjs ou .prettierrc.mjs
import prettierConfig from 'kitsune-lint/prettier';

export default prettierConfig;
```

### Com Overrides

Utilize a factory `createPrettierKitsuneConfig`:

```javascript
// prettier.config.mjs
import { createPrettierKitsuneConfig } from 'kitsune-lint/prettier';

export default createPrettierKitsuneConfig({
  overrides: {
    printWidth: 120,
    singleQuote: true,
  },
  vue: true, // ativa indentação em <script> e <style>
});
```

---

## Stylelint

Configuração focada em SCSS e SFCs do Vue, aplicando arquitetura de classes BEM por padrão.

### Instalação

```bash
npm install --save-dev stylelint stylelint-config-standard-scss stylelint-config-recommended-vue postcss-html
```

### Uso Padrão

```javascript
// stylelint.config.mjs
import stylelintConfig from 'kitsune-lint/stylelint';

export default stylelintConfig;
```

### Com Overrides

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

## CLI e Utilitários

O pacote inclui um utilitário CLI para sincronizar o `.prettierignore` recomendado em seu projeto:

```bash
npx kitsune-prettierignore
```

Para sobrescrever um arquivo existente:

```bash
npx kitsune-prettierignore --force
```

---

## Referência dos Módulos

### Visão Geral

| Módulo | Padrão | Descrição |
| :--- | :---: | :--- |
| `base` | ✅ Ativo | Globais de ambiente (`browser`, `node`, etc.) |
| `typescript` | ✅ Ativo | Boas práticas TS, naming conventions, regras de imports |
| `security` | ✅ Ativo | Prevenção contra injeções, eval e XSS (`eslint-plugin-security`) |
| `cleanCode` | ✅ Ativo | Limites de complexidade, tamanho de função e aninhamento |
| `vue` | ❌ Inativo | Vue 3 SFCs, template casing, ordem de blocos, tipagem |
| `pinia` | ❌ Inativo | Padrões e boas práticas para stores do Pinia |
| `tests` | ❌ Inativo | Relaxamento de regras rígidas de produção em pastas de teste |
| `vitest` | ❌ Inativo | Validação semântica e boas práticas para suites Vitest |

---

### Opções Detalhadas

#### `base`

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `files` | `string[]` | `undefined` | Sobrescreve os padrões de arquivos |
| `environment` | `string` | `'browser'` | Ambientes: `'browser'`, `'node'`, `'shared-node-browser'`, `'worker'`, `'serviceworker'` |

#### `typescript`

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `files` | `string[]` | `undefined` | Sobrescreve os padrões de arquivos |
| `ignores` | `string[]` | `['dist/**', ...]` | Padrões adicionais a ignorar |
| `replaceIgnores` | `string[]` | `undefined` | Substitui integralmente a lista de ignores |
| `rules` | `object` | `{}` | Regras adicionais ou overrides |

#### `security`

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `files` | `string[]` | `undefined` | Sobrescreve os padrões de arquivos |
| `pluginEnabled` | `boolean` | `true` | Habilita regras de `eslint-plugin-security` |
| `rules` | `object` | `{}` | Regras adicionais ou overrides |

#### `cleanCode`

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `files` | `string[]` | `undefined` | Sobrescreve os padrões de arquivos |
| `maxDepth` | `number` | `4` | Profundidade máxima de aninhamento de blocos |
| `maxParams` | `number` | `4` | Quantidade máxima de parâmetros por função |
| `complexity` | `number` | `10` | Complexidade ciclomática máxima por função |
| `maxLines` | `number` | `400` | Máximo de linhas por arquivo (ignora comentários/espaços) |
| `maxLinesPerFunction` | `number` | `80` | Máximo de linhas por corpo de função |
| `rules` | `object` | `{}` | Regras adicionais ou overrides |

#### `vue`

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `files` | `string[]` | `undefined` | Sobrescreve os padrões de arquivos |
| `apiStyle` | `string` | `'script-setup'` | Estilo de API: `'script-setup'`, `'composition'`, `'options'` |
| `componentsNameCasing` | `string` | `'PascalCase'` | Nomenclatura de tags de componentes no template |
| `componentsNameCasingIgnores` | `string[]` | `[]` | Componentes ignorados na verificação de nomenclatura |
| `propNameCasing` | `string` | `'camelCase'` | Nomenclatura das props |
| `slotNameCasing` | `string` | `'kebab-case'` | Nomenclatura de slots |
| `maxTemplateDepth` | `number` | `6` | Profundidade máxima de aninhamento no template |
| `rules` | `object` | `{}` | Regras adicionais ou overrides |

#### `pinia`

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `files` | `string[]` | `['src/state/**/*.ts']` | Arquivos de stores analisados |
| `path` | `string \| string[]` | `undefined` | Caminhos adicionais de stores |
| `rules` | `object` | `{}` | Regras adicionais ou overrides |

#### `tests`

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `files` | `string[]` | `['tests/**/*.{js,mjs,cjs,ts}']` | Arquivos considerados testes |
| `rules` | `object` | `{}` | Regras adicionais ou overrides |

#### `vitest`

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `files` | `string[]` | `undefined` | Sobrescreve os padrões de arquivos |
| `fn` | `string` | `'test'` | Função de teste preferida: `'test'` ou `'it'` |
| `titlePattern` | `string` | Gherkin PT-BR | Regex para títulos de teste |
| `titleMessage` | `string` | Mensagem PT-BR | Mensagem emitida para títulos fora do padrão |
| `maxNestedDescribe` | `number` | `3` | Limite de `describe()` aninhados |
| `rules` | `object` | `{}` | Regras adicionais ou overrides |

---

## Estrutura do Pacote

```
kitsune-lint/
├── bin/
│   └── copy-prettierignore.mjs   # CLI npx kitsune-prettierignore
├── eslint/
│   ├── index.mjs                 # Factory createKitsuneConfig + re-exports
│   ├── index.d.mts               # Tipos TypeScript das configurações
│   ├── plugin.mjs                # Plugin ESLint interno 'kitsune'
│   ├── utils.mjs                 # Utilitários compartilhados
│   ├── configs/                  # Módulos independentes de regras
│   │   ├── base.mjs
│   │   ├── clean-code.mjs
│   │   ├── pinia.mjs
│   │   ├── security.mjs
│   │   ├── tests.mjs
│   │   ├── typescript.mjs
│   │   ├── vitest.mjs
│   │   └── vue.mjs
│   └── rules/                    # Regras customizadas AST
│       ├── alias-imports.mjs
│       └── no-null-in-types.mjs
├── prettier/
│   ├── index.mjs                 # Configuração Prettier e factory
│   └── index.d.mts
├── stylelint/
│   ├── index.mjs                 # Configuração Stylelint e factory
│   └── index.d.mts
├── LICENSE
├── README.md                     # Documentação (Inglês)
├── README.pt-BR.md               # Documentação (Português)
└── package.json
```

---

## Licença e Governança

Distribuído sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

Desenvolvido e mantido pela **[Polariens](https://github.com/polariens)** — Instituição sem fins lucrativos comprometida com a sustentabilidade de ferramentas open-source para a comunidade.


# @polariens/kitsune-lint 🦊

Opinionated ESLint & Prettier configs for high-quality Vue, TypeScript & Vitest projects.

> **Kitsune** (狐) é a raposa mística do folclore japonês — astuta, adaptável e capaz de se transformar conforme o contexto. Assim como a kitsune, este pacote se molda ao seu projeto: você escolhe os módulos e as opções, e ele compõe as regras certas para cada cenário. Código limpo com a precisão de uma raposa.

## O que é

Um pacote instalável que padroniza regras de linting e formatação entre múltiplos projetos. As configurações são **modulares** — cada conjunto de regras (TypeScript, Vue, Pinia, segurança, etc.) é independente e configurável via opções.

## Como usar

### Instalação

Primeiro, instale o pacote principal em seu projeto como dependência de desenvolvimento:

```bash
npm install --save-dev @polariens/kitsune-lint
```

As _peer dependencies_ correspondentes devem ser instaladas no projeto consumidor. Veja abaixo as opções de instalação dependendo do seu cenário.

#### Instalação Completa (Todos os módulos)

Se você planeja utilizar a configuração máxima com todos os módulos ativados no seu ecossistema (`security`, `cleanCode`, `pinia`, `vitest`, `typescript` e `vue`), execute este comando para instalar todas as ferramentas de uma vez:

```bash
npm install --save-dev eslint @eslint/js typescript-eslint globals eslint-plugin-security eslint-plugin-vue vue-eslint-parser eslint-plugin-pinia @vitest/eslint-plugin
```

#### Instalação Específica (Por módulo)

Se preferir incluir apenas as peças que for usar, você deve sempre iniciar instalando as **Dependências Base**, que são essenciais para os módulos principais (que já vêm ativos por padrão, como `base`, `cleanCode` e `typescript`):

```bash
npm install --save-dev eslint @eslint/js typescript-eslint globals
```

Em seguida, instale os complementos exclusivos para cada módulo extra que for habilitar em seu `createConfig()`:

**Módulo `security` (Habilitado por padrão)**
Necessário para a suíte de regras focadas em prevenir vulnerabilidades de segurança e injeções de código:
```bash
npm install --save-dev eslint-plugin-security
```

**Módulo `vue`**
Pacotes necessários para realizar o lint na sintaxe `<template>`, `script setup` e validar as regras do Vue 3:
```bash
npm install --save-dev eslint-plugin-vue vue-eslint-parser
```
> *(Exemplo prático de setup em um projeto para uso apenas dos essenciais e módulo Vue:)*
> ```bash
> npm install --save-dev eslint @eslint/js typescript-eslint globals eslint-plugin-vue vue-eslint-parser
> ```

**Módulo `pinia`**
O verificador de store e regras recomendadas para o gerenciamento de estado via Pinia:
```bash
npm install --save-dev eslint-plugin-pinia
```

**Módulo `vitest`**
Para linting focado em arquivos de teste especificados nativamente pelas boas práticas do Vitest:
```bash
npm install --save-dev @vitest/eslint-plugin
```

### ESLint — Factory function (recomendado)

A forma mais simples. O `createConfig` compõe os módulos selecionados:

```javascript
// eslint.config.js
import { createConfig } from '@polariens/kitsune-lint/eslint';

export default await createConfig({
  vue: true,
  pinia: true,
  tests: true,
  vitest: true,
});
```

Por padrão, `base`, `typescript`, `security` e `cleanCode` já vêm habilitados. Passe `false` para desativar:

```javascript
export default await createConfig({
  security: false,
  vue: true,
});
```

### ESLint — Customizando módulos

Cada módulo aceita um objeto de opções no lugar de `true`:

```javascript
export default await createConfig({
  base: { environment: 'node' },
  cleanCode: { maxDepth: 3, maxParams: 3, complexity: 10, maxLines: 300 },
  vue: { apiStyle: 'composition' },
  pinia: true,
  vitest: {
    titlePattern: '^should .+',
    titleMessage: 'Test title must start with "should"',
    fn: 'it',
    maxNestedDescribe: 2,
  },
});
```

### ESLint — Imports granulares

Para controle total, importe cada módulo diretamente:

```javascript
// eslint.config.js
import { base } from '@polariens/kitsune-lint/eslint/base';
import { typescript } from '@polariens/kitsune-lint/eslint/typescript';
import { vue } from '@polariens/kitsune-lint/eslint/vue';
import { pinia } from '@polariens/kitsune-lint/eslint/pinia';

export default [
  ...base(),
  ...typescript(),
  ...vue(),
  ...(await pinia()),
];
```

### ESLint — Estendendo com configs extras

Use `extend` para adicionar configs de plugins externos (ex: `eslint-config-prettier`):

```javascript
import { createConfig } from '@polariens/kitsune-lint/eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';

export default await createConfig({
  vue: true,
  pinia: true,
  tests: true,
  vitest: true,
  extend: [
    ...pluginVue.configs['flat/recommended'],
    eslintConfigPrettier,
  ],
});
```

### Prettier

Uso direto da config padrão:

```javascript
// prettier.config.mjs
import { prettierConfig } from '@polariens/kitsune-lint/prettier';
export default prettierConfig;
```

Com overrides:

```javascript
import { createPrettierConfig } from '@polariens/kitsune-lint/prettier';
export default createPrettierConfig({ printWidth: 120 });
```

## Módulos

| Módulo       | Default | Descrição                                                    |
| ------------ | ------- | ------------------------------------------------------------ |
| `base`       | ✅ on   | Globals do ambiente (browser/node)                           |
| `typescript` | ✅ on   | Regras TS recomendadas + naming conventions                  |
| `security`   | ✅ on   | Prevenção de eval, XSS, injection + eslint-plugin-security   |
| `cleanCode`  | ✅ on   | SRP, legibilidade, imutabilidade, organização                |
| `vue`        | ❌ off  | Vue 3 + script setup + type-based props/emits                |
| `pinia`      | ❌ off  | Stores Pinia — naming, organização, boas práticas            |
| `tests`      | ❌ off  | Relaxamentos para arquivos de teste (desliga regras rígidas) |
| `vitest`     | ❌ off  | Regras do plugin Vitest (naming, hooks, describe)            |

## Opções dos módulos

### base

| Opção         | Padrão      | Descrição                                        |
| ------------- | ----------- | ------------------------------------------------ |
| `environment` | `'browser'` | Globals: `browser`, `node`, `shared-node-browser`|

### typescript

| Opção    | Padrão         | Descrição          |
| -------- | -------------- | ------------------ |
| `ignores`| configs + dist | Patterns a ignorar |
| `rules`  | `{}`           | Regras extras      |

### security

| Opção           | Padrão | Descrição                     |
| --------------- | ------ | ----------------------------- |
| `pluginEnabled` | `true` | Usar `eslint-plugin-security` |
| `rules`         | `{}`   | Regras extras                 |

### cleanCode

| Opção                 | Padrão | Descrição                          |
| --------------------- | ------ | ---------------------------------- |
| `maxDepth`            | `4`    | Profundidade máxima de aninhamento |
| `maxParams`           | `4`    | Parâmetros máximos por função      |
| `complexity`          | `14`   | Complexidade ciclomática máxima    |
| `maxLines`            | `400`  | Linhas máximas por arquivo         |
| `maxLinesPerFunction` | `80`   | Linhas máximas por função          |
| `rules`               | `{}`   | Regras extras                      |

### vue

| Opção      | Padrão           | Descrição           |
| ---------- | ---------------- | ------------------- |
| `apiStyle` | `'script-setup'` | Estilo de API Vue   |
| `rules`    | `{}`             | Regras extras       |

### pinia

| Opção   | Padrão                    | Descrição                       |
| ------- | ------------------------- | ------------------------------- |
| `files` | `['src/state/**/*.ts']`   | Override dos file patterns      |
| `rules` | `{}`                      | Regras extras                   |

### tests

Relaxamentos para arquivos de teste — desliga regras rígidas de produção como `complexity`, `max-lines`, `max-lines-per-function`, `no-explicit-any`, `naming-convention`, etc.

| Opção   | Padrão                          | Descrição                  |
| ------- | ------------------------------- | -------------------------- |
| `files` | `['tests/**/*.{js,mjs,cjs,ts}']`| Override dos file patterns |
| `rules` | `{}`                            | Regras extras              |

### vitest

| Opção              | Padrão         | Descrição                        |
| ------------------ | -------------- | -------------------------------- |
| `fn`               | `'test'`       | `test()` ou `it()`              |
| `titlePattern`     | Gherkin PT-BR  | Regex do título dos testes       |
| `titleMessage`     | mensagem PT-BR | Mensagem de erro                 |
| `maxNestedDescribe`| `3`            | Máximo de describe aninhados     |
| `rules`            | `{}`           | Regras extras                    |

## Estrutura

```
@polariens/kitsune-lint/
├── package.json
├── eslint/
│   ├── index.mjs            # Factory createConfig + re-exports
│   ├── utils.mjs             # Patterns de arquivos compartilhados
│   └── configs/
│       ├── base.mjs          # Globals do ambiente (browser/node)
│       ├── typescript.mjs    # Regras TypeScript + naming conventions
│       ├── security.mjs      # Prevenção de eval, XSS, injection
│       ├── clean-code.mjs    # SRP, legibilidade, imutabilidade
│       ├── vue.mjs           # Vue 3 + script setup
│       ├── pinia.mjs         # Stores Pinia
│       ├── tests.mjs         # Relaxamentos para testes
│       └── vitest.mjs        # Regras plugin Vitest
└── prettier/
    └── index.mjs             # Config Prettier exportável
```

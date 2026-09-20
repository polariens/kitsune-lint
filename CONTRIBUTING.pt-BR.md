# Contribuindo com o kitsune-lint 🦊

> [English](CONTRIBUTING.md) | **Português**

Obrigado pelo seu interesse em contribuir com o **kitsune-lint**! Este projeto é mantido pela **[Polariens](https://github.com/polariens)** com o objetivo de oferecer configurações modulares, opinativas e precisas para ESLint, Prettier e Stylelint.

---

## Código de Conduta

Temos o compromisso de manter um ambiente acolhedor, inclusivo e livre de assédio para todas as pessoas. Trate todos os contribuidores e usuários com respeito, empatia e profissionalismo.

---

## Como Posso Contribuir?

- **Reportar bugs**: Se encontrar comportamentos inesperados ou conflitos de regras.
- **Sugerir regras ou melhorias**: Propor ajustes em regras existentes, ganhos de desempenho ou novos módulos.
- **Melhorar documentação**: Corrigir textos, adicionar exemplos práticos ou melhorar explicações em português ou inglês.
- **Enviar código**: Criar novas regras AST, ajustar configurações ou corrigir issues abertas.

---

## Configuração do Ambiente Local

### 1. Clonar o repositório

```bash
git clone git@github.com:polariens/kitsune-lint.git
cd kitsune-lint
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Executar testes

Os testes são executados com [Vitest](https://vitest.dev/):

```bash
npm test
```

---

## Estrutura do Projeto

```
kitsune-lint/
├── bin/          # Utilitários CLI (ex: kitsune-prettierignore)
├── eslint/       # Configurações do ESLint e ponto de entrada
│   ├── configs/  # Módulos individuais (base, vue, typescript, security, etc.)
│   └── index.mjs # Função factory e export padrão
├── plugins/      # Regras AST customizadas (kitsune/alias-imports, etc.)
├── prettier/     # Configuração do Prettier
├── stylelint/    # Configuração do Stylelint
└── tests/        # Testes unitários e de integração (Vitest)
```

---

## Diretrizes para Contribuição de Código

1. **Definições de Tipos (TypeScript)**: Se alterar opções de módulos em `eslint/configs/*.mjs`, mantenha os arquivos `.d.mts` sincronizados e estritamente tipados.
2. **Regras Customizadas**: Toda nova regra adicionada em `plugins/` deve conter testes unitários completos em `tests/rules/`.
3. **Foco e Baixo Ruído**: O kitsune prioriza código limpo e regras cirúrgicas. Evite regras que gerem falsos positivos frequentes sem ganho arquitetural real.
4. **Validação Obrigatória**: Sempre rode a suíte de testes antes de abrir um Pull Request:
   ```bash
   npm test
   ```

---

## Fluxo de Trabalho no Git & Commits

1. Crie uma branch descritiva:
   ```bash
   git checkout -b feat/nova-regra
   # ou
   git checkout -b fix/conflito-parser-vue
   ```
2. Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/):
   - `feat:` novas funcionalidades ou regras
   - `fix:` correções de bugs
   - `docs:` melhorias na documentação
   - `refactor:` refatoração sem alterar comportamento
   - `test:` adição ou ajuste de testes
   - `chore:` tarefas de manutenção ou atualização de dependências

---

## Enviando um Pull Request (PR)

1. Envie sua branch para o repositório remoto:
   ```bash
   git push origin feat/nome-da-sua-feature
   ```
2. Abra um Pull Request direcionado para a branch `main`.
3. Descreva no PR:
   - O que foi alterado e o motivo da mudança.
   - Se há breaking changes ou impactos em peer dependencies.
   - Como a alteração foi testada e validada.

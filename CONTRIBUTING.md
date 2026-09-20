# Contributing to kitsune-lint 🦊

> **English** | [Português](CONTRIBUTING.pt-BR.md)

Thank you for your interest in contributing to **kitsune-lint**! This project is maintained by **[Polariens](https://github.com/polariens)** and aims to provide opinionated, sharp, and modular configurations for ESLint, Prettier, and Stylelint.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Treat all contributors and users with respect, kindness, and professionalism.

---

## How Can I Contribute?

- **Report bugs**: If you encounter unexpected behavior or broken rules.
- **Suggest rules or improvements**: Propose rule adjustments, performance improvements, or new modules.
- **Improve documentation**: Fix typos, add examples, or improve explanations in English or Portuguese.
- **Submit code**: Add new AST rules, update configs, or fix issues.

---

## Development Setup

### 1. Clone the repository

```bash
git clone git@github.com:polariens/kitsune-lint.git
cd kitsune-lint
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run tests

Tests are powered by [Vitest](https://vitest.dev/):

```bash
npm test
```

---

## Project Structure

```
kitsune-lint/
├── bin/          # CLI utilities (e.g. kitsune-prettierignore)
├── eslint/       # ESLint configurations and entry points
│   ├── configs/  # Modular configs (base, vue, typescript, security, etc.)
│   └── index.mjs # Factory function and default export
├── plugins/      # Custom ESLint AST rules (kitsune/alias-imports, etc.)
├── prettier/     # Prettier configuration
├── stylelint/    # Stylelint configuration
└── tests/        # Unit and integration tests (Vitest)
```

---

## Guidelines for Code Contributions

1. **TypeScript Definitions**: If you modify any module options in `eslint/configs/*.mjs`, make sure corresponding `.d.mts` types remain in sync and statically typed.
2. **Custom Rules**: Any new rule added to `plugins/` must include comprehensive unit tests in `tests/rules/`.
3. **Keep Rules Focused**: Kitsune favors strict, clean code with low noise. Avoid rules that cause frequent false positives without clear architectural benefits.
4. **Validation**: Always ensure tests pass before opening a Pull Request:
   ```bash
   npm test
   ```

---

## Git Workflow & Commits

1. Create a descriptive branch:
   ```bash
   git checkout -b feat/add-new-rule
   # or
   git checkout -b fix/vue-parser-conflict
   ```
2. Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features or rules
   - `fix:` for bug fixes
   - `docs:` for documentation updates
   - `refactor:` for code refactoring without behavior changes
   - `test:` for adding or modifying tests
   - `chore:` for maintenance or dependency updates

---

## Submitting a Pull Request (PR)

1. Push your branch to GitHub:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request pointing to `main`.
3. Fill out the PR description with:
   - What changed and why.
   - Any breaking changes or peer dependency modifications.
   - Verification steps or test results.

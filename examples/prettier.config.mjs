/**
 * Exemplo de prettier.config.mjs consumindo @merieli/kitsune-lint.
 * Copie para o projeto e ajuste conforme necessário.
 */

// =================================================================
// Opção 1: Usar a config padrão diretamente
// =================================================================
// import { prettierConfig } from '@merieli/kitsune-lint/prettier';

// export default prettierConfig;
// =================================================================
// Opção 2: Usar a config padrão diretamente
// =================================================================
import { createPrettierConfig } from '@merieli/kitsune-lint/prettier';

export default createPrettierConfig(
    // Overrides das opções do Prettier
    {
        printWidth: 120,
    },
    // Opções específicas para Vue (opcional)
    {
        vueIndentScriptAndStyle: true,
    }
)
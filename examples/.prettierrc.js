/**
 * Exemplo de prettier.config.mjs consumindo @polariens/kitsune-lint.
 * Copie para o projeto e ajuste conforme necessário.
 */

// =================================================================
// Opção 1: Usar a config padrão diretamente
// =================================================================
// import { prettierKitsuneConfig } from '@polariens/kitsune-lint/prettier';

// export default prettierKitsuneConfig;
// =================================================================
// Opção 2: Usar a config padrão diretamente
// =================================================================
import { createPrettierKitsuneConfig } from '@polariens/kitsune-lint/prettier';

export default createPrettierKitsuneConfig({
    // Overrides das opções do Prettier
    overrides : {
        printWidth: 120
    },
    // Opções específicas para Vue (opcional)
    vue: true
},)
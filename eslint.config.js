// Configuração do ESLint (TypeScript, React Hooks, React Refresh e Storybook).
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([globalIgnores(['dist']), {
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
  ],
  languageOptions: {
    globals: globals.browser,
  },
}, {
  // O manager do Storybook não usa Fast Refresh e não exporta nada: a regra não se aplica.
  files: ['.storybook/**/*.{ts,tsx}'],
  rules: { 'react-refresh/only-export-components': 'off' },
}, ...storybook.configs["flat/recommended"]])

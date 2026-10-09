// Configuração do preview das stories: importa os estilos, aplica o tema (data-theme) e define fundo e texto.
import { useEffect } from 'react';
import type { Preview } from '@storybook/react-vite'
import { addons } from 'storybook/preview-api'
import '../src/styles/tailwind.css'
import { NexusDocsContainer } from './NexusDocsContainer'

const STORAGE_KEY = 'nexus-sb-theme'
const EVENT = 'nexus/theme-change'

// Fundo e texto vêm dos semantics (src/tokens/tokens.css, gerado dos JSON do Figma).
// São os mesmos nomes nos dois temas: o valor muda sozinho conforme o data-theme do <html>.
const SURFACE = { bg: 'var(--color-surface-primary)', text: 'var(--color-text-primary)' } as const

const applyTheme = (mode: string) => {
  const root = document.documentElement
  root.dataset.theme = mode
  root.style.colorScheme = mode
  let style = document.getElementById('nexus-sb-theme-style')
  if (!style) {
    style = document.createElement('style')
    style.id = 'nexus-sb-theme-style'
    document.head.appendChild(style)
  }
  const { bg, text } = SURFACE
  style.textContent = `html[data-theme="${mode}"] body,
    html[data-theme="${mode}"] .sbdocs-wrapper,
    html[data-theme="${mode}"] .sbdocs-content { background: ${bg}; color: ${text}; }`
}

const readStored = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

applyTheme(readStored())

const preview: Preview = {
  decorators: [
    (Story) => {
      useEffect(() => {
        const channel = addons.getChannel()
        channel.on(EVENT, applyTheme)
        return () => channel.off(EVENT, applyTheme)
      }, [])
      return <Story />
    },
  ],

  parameters: {
    docs: { container: NexusDocsContainer },

    options: {
      storySort: {
        // Foundations primeiro, depois Components; o restante em ordem alfabética.
        order: ['Foundations', ['Colors', 'Typography', 'Spacing', 'Radius', 'Elevation', 'Glow'], 'Components', ['Button', 'Input', 'Modal']],
        method: 'alphabetical',
      },
    },

    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;

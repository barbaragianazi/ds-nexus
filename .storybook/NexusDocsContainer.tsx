// Container da aba Docs do Storybook: aplica o tema Nexus (claro/escuro) e acompanha o botão de tema da barra.
import { useEffect, useState, type PropsWithChildren } from 'react'
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks'
import { addons } from 'storybook/preview-api'
import { nexusDark, nexusLight } from './theme'

const STORAGE_KEY = 'nexus-sb-theme'
const EVENT = 'nexus/theme-change'

const readStored = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

// A página Docs usa um tema próprio do Storybook (quadro do exemplo, títulos, tabela de props).
// Sem isto ela fica sempre clara, mesmo com o resto no dark. Acompanha o botão de tema.
export function NexusDocsContainer({ children, context }: PropsWithChildren<DocsContainerProps>) {
  const [mode, setMode] = useState(readStored)
  useEffect(() => {
    const channel = addons.getChannel()
    channel.on(EVENT, setMode)
    return () => channel.off(EVENT, setMode)
  }, [])
  return (
    <DocsContainer context={context} theme={mode === 'light' ? nexusLight : nexusDark}>
      {children}
    </DocsContainer>
  )
}

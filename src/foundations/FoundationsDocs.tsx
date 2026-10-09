// Componentes de layout (página, seção, grade e card) usados nas páginas de Foundations.
import { createContext, useContext, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import '../tokens/tokens.css'
import './foundations.css'
import { friendly, type Token } from './tokenUtils'

// Componentes de layout compartilhados pelas Stories de Foundations.

// Alias (origem na primitiva) e CSS variables são detalhes técnicos: ficam escondidos por padrão
// e o interruptor do DocsPage os mostra em todos os cards da página.
const DetailsContext = createContext(false)

export function DocsPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const [showDetails, setShowDetails] = useState(false)
  return (
    <DetailsContext.Provider value={showDetails}>
      <div className="ds-docs">
        <div className="ds-docs__inner">
          <h1>{title}</h1>
          <p>{description}</p>
          <label className="ds-docs__toggle">
            <input type="checkbox" checked={showDetails} onChange={(e) => setShowDetails(e.target.checked)} />
            Mostrar detalhes técnicos (origem na primitiva e CSS variables)
          </label>
          {children}
        </div>
      </div>
    </DetailsContext.Provider>
  )
}

export function DocsSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </section>
  )
}

export function DocsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3>{title}</h3>
      {children}
    </section>
  )
}

export function DocsGrid({ min = 180, children }: { min?: number; children: ReactNode }) {
  return (
    <div className="ds-docs__grid" style={{ '--min': `${min}px` } as CSSProperties}>
      {children}
    </div>
  )
}

type TokenCardProps = {
  token: Token
  preview: ReactNode
  title?: string
  value?: string
  details?: ReactNode // linhas técnicas extras (origem/alias); só aparecem com o interruptor ligado
  cssVars?: string[] // quando o card usa mais de uma variável; só aparecem com o interruptor ligado
  stage?: boolean // fundo cinza para previews de sombra/glow
  fill?: boolean // preview sem padding (swatches)
}

export function TokenCard({ token, preview, title, value, details, cssVars, stage, fill }: TokenCardProps) {
  const showDetails = useContext(DetailsContext)
  const previewClass = ['ds-docs__preview', stage && 'ds-docs__preview--stage', fill && 'ds-docs__preview--fill']
    .filter(Boolean)
    .join(' ')
  return (
    <div className="ds-docs__card">
      <div className={previewClass}>{preview}</div>
      <div className="ds-docs__body">
        <span className="ds-docs__title">{title ?? friendly(token.path)}</span>
        <span className="ds-docs__code ds-docs__code--strong">{token.name}</span>
        <span className="ds-docs__value">{value ?? token.value}</span>
        {showDetails && details}
        {showDetails &&
          (cssVars ?? [token.cssVar]).map((v) => (
            <span key={v} className="ds-docs__code">
              {v}
            </span>
          ))}
      </div>
    </div>
  )
}

/** Linha "→ origem" para tokens semânticos que apontam para um primitivo (e a do dark, se for outra). */
export function AliasLine({ token }: { token: Token }) {
  const light = token.alias && token.alias.join('/') !== token.name ? token.alias : undefined
  const dark = token.dark?.alias && token.dark.alias.join('/') !== light?.join('/') ? token.dark.alias : undefined
  if (!light && !dark) return null
  return (
    <>
      {light && (
        <span className="ds-docs__code">
          {dark ? 'Light' : ''} → {light.join('/')} · var(--{light.join('-')})
        </span>
      )}
      {dark && (
        <span className="ds-docs__code">
          Dark → {dark.join('/')} · var(--{dark.join('-')})
        </span>
      )}
    </>
  )
}

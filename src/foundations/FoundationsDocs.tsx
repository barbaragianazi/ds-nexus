import type { CSSProperties, ReactNode } from 'react'
import '../tokens/tokens.css'
import './foundations.css'
import { friendly, type Token } from './tokenUtils'

// Componentes de layout compartilhados pelas Stories de Foundations.

export function DocsPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="ds-docs">
      <div className="ds-docs__inner">
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    </div>
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
  details?: ReactNode // linhas extras (origem/alias, x/y/blur...)
  cssVars?: string[] // quando o card usa mais de uma variável
  stage?: boolean // fundo cinza para previews de sombra/glow
  fill?: boolean // preview sem padding (swatches)
}

export function TokenCard({ token, preview, title, value, details, cssVars, stage, fill }: TokenCardProps) {
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
        {details}
        {(cssVars ?? [token.cssVar]).map((v) => (
          <span key={v} className="ds-docs__code">
            {v}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Linha "→ origem" para tokens semânticos que apontam para um primitivo. */
export function AliasLine({ token }: { token: Token }) {
  if (!token.alias || token.alias.join('/') === token.name) return null
  return (
    <span className="ds-docs__code">
      → {token.alias.join('/')} · var(--{token.alias.join('-')})
    </span>
  )
}

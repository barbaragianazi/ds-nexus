import { DocsGrid, DocsPage, DocsSection, TokenCard } from './FoundationsDocs'
import { hasCssVar, primitiveTokens, tokensIn } from './tokenUtils'

const PARTS = ['x', 'y', 'blur', 'spread']

// Cor usada SOMENTE se o tokens.css não tiver a variável composta (--shadow-sm etc.).
// É cor de preview/documentação, não um token oficial do Design System.
const PREVIEW_FALLBACK_COLOR = 'rgba(0, 0, 0, 0.16)'

/** Página compartilhada por Elevation (effects/shadow) e Glow (effects/glow). */
export function EffectPage({ group, title, description }: { group: 'shadow' | 'glow'; title: string; description: string }) {
  const effects = tokensIn(primitiveTokens, 'effects', group)
  const sizes = [...new Set(effects.map((t) => t.path[2]))]

  return (
    <DocsPage title={title} description={description}>
      <DocsSection title={`${title} Levels`} description="Cada nível é composto por x, y, blur e spread. A cor vem da variável composta do tokens.css.">
        <DocsGrid min={260}>
          {sizes.map((size) => {
            const parts = PARTS.flatMap((p) => effects.filter((t) => t.path[2] === size && t.path[3] === p))
            const composed = `--${group}-${size}`
            const composedExists = hasCssVar(composed)
            const boxShadow = composedExists
              ? `var(${composed})`
              : `${parts.map((t) => `var(${t.cssVar})`).join(' ')} ${PREVIEW_FALLBACK_COLOR}`
            return (
              <TokenCard
                key={size}
                token={{ ...parts[0], name: `effects/${group}/${size}`, cssVar: composed, value: '' }}
                title={size}
                value={composedExists ? undefined : 'sem variável composta (cor de preview)'}
                stage
                preview={<div style={{ width: 120, height: 80, borderRadius: 8, background: 'var(--color-neutral-0)', boxShadow }} />}
                cssVars={[composed, ...parts.map((t) => t.cssVar)]}
                details={parts.map((t) => (
                  <span key={t.cssVar} className="ds-docs__value">
                    {t.path[3]}: {t.value}
                  </span>
                ))}
              />
            )
          })}
        </DocsGrid>
      </DocsSection>
    </DocsPage>
  )
}

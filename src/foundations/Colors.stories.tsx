// Página de documentação das cores (primitives e semantics) no Storybook.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AliasLine, DocsGrid, DocsGroup, DocsPage, DocsSection, TokenCard } from './FoundationsDocs'
import { groupBy, primitiveTokens, semanticTokens, titleCase, tokensIn, type Token } from './tokenUtils'

const FAMILY_ORDER = ['blue', 'neutral']
const rank = (family: string) => (FAMILY_ORDER.includes(family) ? FAMILY_ORDER.indexOf(family) : FAMILY_ORDER.length)

const primitiveFamilies = groupBy(
  tokensIn(primitiveTokens, 'color').filter((t) => t.type === 'color'),
  1,
)
  .sort(([a], [b]) => rank(a) - rank(b))
  .map(([family, tokens]): [string, Token[]] => [family, [...tokens].sort((a, b) => Number(a.path.at(-1)) - Number(b.path.at(-1)))])

const semanticGroups = groupBy(
  semanticTokens.filter((t) => t.type === 'color'),
  1,
)

// Semantics com valor diferente no dark mostram os dois; a amostra já segue o tema ativo.
const hexLabel = (token: Token) =>
  token.dark && token.dark.hex !== token.hex ? `Light ${token.hex} · Dark ${token.dark.hex}` : token.hex

function ColorGrid({ tokens }: { tokens: Token[] }) {
  return (
    <DocsGrid>
      {tokens.map((token) => (
        <TokenCard
          key={token.cssVar}
          token={token}
          value={hexLabel(token)}
          fill
          preview={<div style={{ height: 88, width: '100%', background: `var(${token.cssVar})`, boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.08)' }} />}
          details={<AliasLine token={token} />}
        />
      ))}
    </DocsGrid>
  )
}

function ColorPage() {
  return (
    <DocsPage
      title="Colors"
      description="Cores do Design System geradas a partir dos tokens do Figma. Semânticas dão significado de uso e apontam para uma primitiva; primitivas são a paleta base."
    >
      <DocsSection title="Semantic Colors" description="Cores por função (texto, superfícies, feedback). Use estas nos componentes.">
        {semanticGroups.map(([group, tokens]) => (
          <DocsGroup key={group} title={titleCase(group)}>
            <ColorGrid tokens={tokens} />
          </DocsGroup>
        ))}
      </DocsSection>
      <DocsSection title="Primitive Colors" description="Paleta base, agrupada por família. Evite usar diretamente nos componentes.">
        {primitiveFamilies.map(([family, tokens]) => (
          <DocsGroup key={family} title={titleCase(family)}>
            <ColorGrid tokens={tokens} />
          </DocsGroup>
        ))}
      </DocsSection>
    </DocsPage>
  )
}

const meta = {
  title: 'Foundations/Colors',
  component: ColorPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ColorPage>

export default meta
type Story = StoryObj<typeof meta>

export const Colors: Story = {}

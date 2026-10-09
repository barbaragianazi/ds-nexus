// Página de documentação dos raios de borda (radius) no Storybook.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AliasLine, DocsGrid, DocsPage, DocsSection, TokenCard } from './FoundationsDocs'
import { byValue, primitiveTokens, semanticTokens, tokensIn, type Token } from './tokenUtils'

const primitiveRadius = tokensIn(primitiveTokens, 'radius').sort(byValue)
const semanticRadius = tokensIn(semanticTokens, 'radius').sort(byValue)

function RadiusGrid({ tokens }: { tokens: Token[] }) {
  return (
    <DocsGrid min={160}>
      {tokens.map((token) => (
        <TokenCard
          key={token.cssVar}
          token={token}
          title={token.path.at(-1)}
          details={<AliasLine token={token} />}
          preview={
            <div
              style={{
                width: 88,
                height: 88,
                background: 'var(--color-blue-50)',
                border: '2px solid var(--color-blue-500)',
                borderRadius: `var(${token.cssVar})`,
              }}
            />
          }
        />
      ))}
    </DocsGrid>
  )
}

function RadiusPage() {
  return (
    <DocsPage title="Radius" description="Raios de borda do Design System. Os semânticos apontam para um raio primitivo.">
      <DocsSection title="Primitive Radius" description="Escala base de raios.">
        <RadiusGrid tokens={primitiveRadius} />
      </DocsSection>
      <DocsSection title="Semantic Radius" description="Nomes por tamanho (sm, md, lg…). Use estes nos componentes.">
        <RadiusGrid tokens={semanticRadius} />
      </DocsSection>
    </DocsPage>
  )
}

const meta = {
  title: 'Foundations/Radius',
  component: RadiusPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof RadiusPage>

export default meta
type Story = StoryObj<typeof meta>

export const Radius: Story = {}

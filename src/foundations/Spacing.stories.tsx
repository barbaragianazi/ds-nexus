// Página de documentação da escala de espaçamento (spacing) no Storybook.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocsGrid, DocsPage, DocsSection, TokenCard } from './FoundationsDocs'
import { byValue, primitiveTokens, tokensIn } from './tokenUtils'

const spacing = tokensIn(primitiveTokens, 'spacing').sort(byValue)

// As barras usam o valor do token multiplicado por SCALE só para facilitar a comparação.
const SCALE = 6

function SpacingPage() {
  return (
    <DocsPage title="Spacing" description="Escala de espaçamento usada em gaps, paddings e margens.">
      <DocsSection title="Spacing Scale" description={`Barras desenhadas em escala ${SCALE}× (o valor real do token é o mostrado no card).`}>
        <DocsGrid min={260}>
          {spacing.map((token) => (
            <TokenCard
              key={token.cssVar}
              token={token}
              title={token.path.at(-1)}
              preview={
                <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      height: 24,
                      width: `calc(var(${token.cssVar}) * ${SCALE})`,
                      maxWidth: '100%',
                      background: 'var(--color-blue-500)',
                      borderRadius: 2,
                    }}
                  />
                </div>
              }
            />
          ))}
        </DocsGrid>
      </DocsSection>
    </DocsPage>
  )
}

const meta = {
  title: 'Foundations/Spacing',
  component: SpacingPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SpacingPage>

export default meta
type Story = StoryObj<typeof meta>

export const Spacing: Story = {}

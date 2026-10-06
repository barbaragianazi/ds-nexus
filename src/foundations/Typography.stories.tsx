import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocsGrid, DocsPage, DocsSection, TokenCard } from './FoundationsDocs'
import { byValue, primitiveTokens, tokensIn } from './tokenUtils'

const fontSizes = tokensIn(primitiveTokens, 'typography', 'font-size')
// Font weight vem do Figma como nome ("Extra Bold"); o tokens.css já traz o número (800).
const weights = tokensIn(primitiveTokens, 'typography', 'weight').sort(byValue)
const lineHeights = tokensIn(primitiveTokens, 'typography', 'line-height')
const letterSpacings = tokensIn(primitiveTokens, 'typography', 'letter-spacing').sort(byValue)

function TypographyPage() {
  return (
    <DocsPage
      title="Typography"
      description="Escalas tipográficas do Design System: tamanho, peso, altura de linha e espaçamento entre letras."
    >
      <DocsSection title="Font Size" description="Tamanhos de fonte disponíveis.">
        <DocsGrid min={160}>
          {fontSizes.map((token) => (
            <TokenCard
              key={token.cssVar}
              token={token}
              title={token.path.at(-1)}
              preview={<span style={{ fontSize: `var(${token.cssVar})`, lineHeight: 1.1 }}>Aa</span>}
            />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection title="Font Weight" description="Pesos exportados do Figma como nome; o CSS usa o valor numérico equivalente.">
        <DocsGrid min={240}>
          {weights.map((token) => (
            <TokenCard
              key={token.cssVar}
              token={token}
              title={String(token.raw)}
              value={`${String(token.raw)} · ${token.value}`}
              preview={<span style={{ fontSize: 24, fontWeight: `var(${token.cssVar})` }}>Aa Bb Cc 123</span>}
            />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection title="Line Height" description="Amostras em 14px de fonte; as linhas guia marcam a altura de cada linha.">
        <DocsGrid min={240}>
          {lineHeights.map((token) => (
            <TokenCard
              key={token.cssVar}
              token={token}
              title={token.path.at(-1)}
              preview={
                <p
                  style={{
                    margin: 0,
                    maxWidth: 'none',
                    width: '100%',
                    fontSize: 14,
                    lineHeight: `var(${token.cssVar})`,
                    color: 'inherit',
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(var(${token.cssVar}) - 1px), #dcdde0 calc(var(${token.cssVar}) - 1px), #dcdde0 var(${token.cssVar}))`,
                  }}
                >
                  Design systems keep products consistent. Tokens turn decisions into code. Every line shares the same height.
                </p>
              }
            />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection title="Letter Spacing" description="A mesma frase com cada espaçamento entre letras.">
        <DocsGrid min={300}>
          {letterSpacings.map((token) => (
            <TokenCard
              key={token.cssVar}
              token={token}
              title={token.path.at(-1)}
              preview={<span style={{ fontSize: 24, letterSpacing: `var(${token.cssVar})` }}>Design System</span>}
            />
          ))}
        </DocsGrid>
      </DocsSection>
    </DocsPage>
  )
}

const meta = {
  title: 'Foundations/Typography',
  component: TypographyPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TypographyPage>

export default meta
type Story = StoryObj<typeof meta>

export const Typography: Story = {}

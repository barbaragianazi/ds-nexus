// Leitura centralizada dos tokens para a documentação (Stories de Foundations).
// Estrutura/nomes/aliases vêm dos JSON do Figma; valores finais e nomes de
// CSS variable vêm do tokens.css gerado, para a doc refletir exatamente o CSS.
import primitives from '../tokens/primitives.json'
import semantics from '../tokens/semantics.json'
import tokensCss from '../tokens/tokens.css?raw'

export type Token = {
  path: string[] // ex.: ['color', 'blue', '500']
  name: string // ex.: 'color/blue/500'
  cssVar: string // ex.: '--color-blue-500'
  type: string // $type do Figma: color, number, string
  raw: unknown // $value original do Figma
  value: string // valor final em CSS, com var() resolvido (ex.: '#0d88c3', '8px')
  alias?: string[] // semantics: caminho do primitivo de origem
  hex?: string // apenas cores
}

type FigmaNode = {
  $type?: string
  $value?: unknown
  $extensions?: { 'com.figma.aliasData'?: { targetVariableName: string } }
}

// Mesmo critério do generate-tokens.js: raiz 'colors' == 'color'.
const normalize = (path: string[]) => (path[0] === 'colors' ? ['color', ...path.slice(1)] : path)

const cssValues = new Map<string, string>(
  [...tokensCss.matchAll(/^\s*(--[\w-]+):\s*(.+);\s*$/gm)].map((m) => [m[1], m[2]]),
)

export const hasCssVar = (cssVar: string) => cssValues.has(cssVar)

function resolve(value: string, depth = 0): string {
  if (depth > 5) return value
  return value.replace(/var\((--[\w-]+)\)/g, (match, name: string) => {
    const target = cssValues.get(name)
    return target === undefined ? match : resolve(target, depth + 1)
  })
}

// Primitivos não devem ser aliases: referências '{...}' em primitives são grupos de
// aparência duplicados (surface, container...) que o generate-tokens.js descarta.
const isReference = (value: unknown) => typeof value === 'string' && /^{.+}$/.test(value)

function collect(tree: object, prefix: string[] = [], isPrimitive = false): Token[] {
  return Object.entries(tree).flatMap(([key, node]: [string, unknown]) => {
    if (key.startsWith('$') || typeof node !== 'object' || node === null) return []
    const path = [...prefix, key]
    if (!('$value' in node)) return collect(node, path, isPrimitive)

    const token = node as FigmaNode
    if (isPrimitive && isReference(token.$value)) return []
    const normalized = normalize(path)
    const cssVar = `--${normalized.join('-')}`
    const css = cssValues.get(cssVar)
    // Só entra o que o generate-tokens.js realmente gerou (ignora placeholders e grupos descartados).
    if (css === undefined) return []

    const target = token.$extensions?.['com.figma.aliasData']?.targetVariableName
    return [
      {
        path: normalized,
        name: normalized.join('/'),
        cssVar,
        type: token.$type ?? 'unknown',
        raw: token.$value,
        value: resolve(css),
        alias: target ? normalize(target.split('/')) : undefined,
        hex: token.$type === 'color' ? (token.$value as { hex?: string }).hex?.toUpperCase() : undefined,
      },
    ]
  })
}

export const primitiveTokens = collect(primitives, [], true)
export const semanticTokens = collect(semantics)

/** Tokens cujo caminho começa com o prefixo, ex.: tokensIn(primitiveTokens, 'typography', 'font-size'). */
export const tokensIn = (tokens: Token[], ...prefix: string[]) =>
  tokens.filter((t) => prefix.every((p, i) => t.path[i] === p))

/** Agrupa pela posição `index` do caminho, preservando a ordem do JSON. */
export function groupBy(tokens: Token[], index: number): [string, Token[]][] {
  const groups = new Map<string, Token[]>()
  for (const token of tokens) {
    const key = token.path[index]
    groups.set(key, [...(groups.get(key) ?? []), token])
  }
  return [...groups]
}

/** Ordena pelo valor numérico (px, peso) do token. */
export const byValue = (a: Token, b: Token) => parseFloat(a.value) - parseFloat(b.value)

export const titleCase = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

/** 'color/feedback/danger/foreground' -> 'Feedback · Danger · Foreground' */
export const friendly = (path: string[]) => path.slice(1).map(titleCase).join(' · ')

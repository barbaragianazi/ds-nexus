# React + TypeScript + Vite

## Design System

`tokens.css`, `tokens.flat.json`, `tailwind-theme.css` e `design.md` são gerados a partir de `src/tokens/*.json`. Não edite à mão; rode `npm run generate:ds`.

### Atualizando tokens do Figma

1. Atualize `src/tokens/primitives.json`, `src/tokens/semantics.light.tokens.json` e `src/tokens/semantics.dark.tokens.json` com o export do Figma (a coleção de semantics tem um modo `light` e um `dark`, exportados em arquivos separados).
2. Rode o que for usar (`npm run dev`, `npm run storybook` ou `npm run build`): o `generate:ds` roda automaticamente antes e tudo já está atualizado.
3. Para só regenerar os arquivos, sem subir nada, use `npm run generate:ds`.

Sempre que uma alteração impactar o Design System (tokens, Foundations, componentes, props, variantes, estados, regras de uso, acessibilidade ou depreciações), regenere o `design.md`.

## Explicando o projeto

### Ideia geral

O Nexus/DS é um **Design System**: um kit de componentes (Button, Input, Modal) com cores, espaçamentos, tipografia, radius e efeitos padronizados, para que o produto fique consistente. O **Figma é a fonte da verdade**; o código é gerado a partir dele.

```
Figma → primitives.json + semantics.light/dark.tokens.json → generate-tokens.js → tokens.css / tokens.flat.json / tailwind-theme.css
                                         → generate-design-md.js → design.md
tokens.css → componentes React → Storybook (vitrine)
```

### Tecnologias

| Tecnologia | O que é |
|---|---|
| **React** | Biblioteca para criar interfaces com **componentes** reutilizáveis (`<Button />`) em vez de repetir HTML. |
| **TypeScript** | JavaScript com tipos. Avisa erros antes de rodar (ex.: um valor de `variant` que não existe). |
| **Vite** | Roda o projeto em desenvolvimento e gera o build final. |
| **Storybook** | Vitrine onde cada componente é visto e testado isolado, com todas as variações. |
| **Tailwind CSS v4** | Framework de utilities CSS (`p-nexus-16`). Está configurado e ligado aos tokens, mas **nenhum componente usa ainda**; eles continuam com CSS tradicional. |
| **npm** | Instala as bibliotecas e roda os comandos (`npm run ...`). |

### Pastas e arquivos

**Raiz**

- `package.json`: ficha do projeto, com as dependências e os comandos (scripts).
- `node_modules/`: bibliotecas baixadas pelo npm. Não editar.
- `vite.config.ts`: configuração do Vite (plugins React e Tailwind, testes do Storybook).
- `tsconfig*.json`: regras do TypeScript.
- `eslint.config.js`: regras do linter, que aponta más práticas no código.
- `index.html`: página única do app; o React é montado na `<div id="root">`.
- `generate-tokens.js`: **gerador principal**. Lê os JSONs do Figma e escreve `tokens.css`, `tokens.flat.json` e `tailwind-theme.css`.
- `generate-design-md.js`: gera o `design.md` a partir dos tokens e do código dos componentes.
- `design.md`: documentação gerada, para pessoas e IAs. Não editar à mão.
- `dist/` e `storybook-static/`: resultado dos builds. Gerados, não editar.

**`src/`**

- `tokens/`
  - `primitives.json`, `semantics.light.tokens.json` e `semantics.dark.tokens.json`: exportados do Figma. *Primitive* é o valor cru (`blue/500` = `#0D88C3`); *semantic* é o uso (`surface/brand`, que aponta para `blue/500`).
  - `tokens.css`: **gerado**. CSS Custom Properties oficiais (`--color-surface-brand: var(--color-blue-500)`).
  - `tokens.flat.json`: **gerado**. Lista simples `{ "--nome": "valor" }`, usada pela interface do Storybook, que não importa CSS.
  - `tailwind-theme.css`: **gerado**. Expõe tokens selecionados ao Tailwind, só referenciando as variáveis de `tokens.css`, com prefixo `nexus`.
- `components/`: `Button`, `Input` e `Modal`. Cada pasta tem `.tsx` (lógica e HTML via React), `.css` (estilo) e `.stories.tsx` (como aparece no Storybook).
- `foundations/`: páginas do Storybook que documentam cores, tipografia, spacing, radius, elevation e glow.
- `styles/tailwind.css`: entrada do Tailwind (carrega `tokens.css`, o tema e as utilities).
- `index.css`, `main.tsx`, `App.tsx`: o app em si. `main.tsx` liga o React à página; `App.tsx` é o componente raiz.

**`.storybook/`**

- `main.ts`: onde estão as stories e quais addons usar.
- `preview.tsx`: como as stories são renderizadas (carrega o CSS, tema claro/escuro).
- `manager.tsx`, `theme.ts`, `tokens.ts`, `*-head.html`: personalização da interface do próprio Storybook (logo, cores, tema).

### Scripts (`npm run ...`)

| Script | O que faz |
|---|---|
| `generate:tokens` | Roda `generate-tokens.js`: gera `tokens.css`, `tokens.flat.json` e `tailwind-theme.css`. |
| `generate:design` | Roda `generate-design-md.js`: gera o `design.md`. |
| `generate:ds` | Roda os dois acima em sequência. **Atualiza tudo.** |
| `dev` | Sobe o app em desenvolvimento. |
| `build` | Valida o TypeScript e gera o app final em `dist/`. |
| `storybook` | Sobe o Storybook em `localhost:6006`. |
| `build-storybook` | Gera o Storybook estático em `storybook-static/` (para publicar). |
| `lint` | Roda o ESLint. |

`dev`, `build`, `storybook` e `build-storybook` têm um script `pre...` que roda `generate:ds` automaticamente antes (o npm executa o `pre<nome>` sozinho). Por isso não é preciso lembrar de gerar os tokens à mão.

### Como um token viaja do Figma até a tela

Exemplo com a cor da marca:

1. **Figma**: `color/surface/brand` aponta (alias) para `color/blue/500` = `#0D88C3`.
2. **JSON**: `semantics.light.tokens.json` (e o `.dark`) guarda o valor e a pista do alias (`com.figma.aliasData`).
3. **Gerador**: `generate-tokens.js` escreve em `tokens.css`: `--color-surface-brand: var(--color-blue-500);` e `--color-blue-500: #0d88c3;`.
4. **Tailwind**: `tailwind-theme.css` registra `--color-nexus-surface-brand: var(--color-surface-brand);`, o que permite usar `bg-nexus-surface-brand`.
5. **Componente**: `Button.css` usa `background: var(--color-surface-brand);`.
6. **Tela**: o navegador resolve a cadeia de variáveis e pinta o botão de `#0d88c3`.

Mudar `--color-blue-500` em `primitives.json` e rodar `npm run storybook` atualiza tudo que aponta para essa cor, sem mexer nos componentes.

### Primitive x semantic

- **Primitive**: valor-base, sem intenção de uso (`--color-blue-500`, `--spacing-16`). É o "tubo de tinta".
- **Semantic**: nome pelo propósito (`--color-surface-brand`, `--color-text-primary`). É a "etiqueta" que diz onde usar a tinta.
- Componentes devem usar **semantics**. Se a marca mudar, troca-se para onde o semantic aponta e os componentes não precisam mudar.

### Tailwind no projeto

- `tailwind-theme.css` usa `@theme inline` e **só referencia** as variáveis de `tokens.css`; nunca repete valores (HEX, px).
- O prefixo `nexus` evita colisão com a escala padrão do Tailwind e com nomes já existentes em `tokens.css` (ex.: `--radius-md` vs `--radius-nexus-md`).
- Expostos: cores semânticas, radius, spacing, font-size, line-height, letter-spacing, font-weight, shadow e glow.
- Primitives de cor ficam só em `tokens.css` (via `var()`), sem utility Tailwind.
- O **preflight** (reset do Tailwind) está desligado de propósito, para não alterar o visual dos componentes atuais.
- Exemplos de classes: `bg-nexus-surface-brand`, `text-nexus-text-primary`, `rounded-nexus-md`, `p-nexus-16`, `gap-nexus-8`, `shadow-nexus-md`, `shadow-nexus-glow-md`, `text-nexus-16`, `leading-nexus-24`, `font-nexus-bold`.

### Perguntas que podem fazer

**Por que gerar os tokens em vez de escrever o CSS à mão?**
Para o Figma ser a única fonte da verdade. Mudou no Figma, exporta, roda um comando e o código acompanha, sem copiar valor manualmente e sem risco de divergir.

**Por que `tokens.css` e `tailwind-theme.css` são arquivos separados?**
`tokens.css` guarda os valores e funciona em qualquer lugar (CSS puro, Storybook, componentes atuais). `tailwind-theme.css` só diz ao Tailwind quais variáveis virar utilities. Assim o Tailwind é opcional e os valores existem em um lugar só.

**Por que o Tailwind foi instalado se nenhum componente usa?**
Foi uma etapa só de infraestrutura, para validar a integração antes de migrar. A migração será feita componente por componente.

**Por que não usar `bg-blue-500` direto?**
Porque `blue-500` é um primitive. O semantic `surface/brand` expressa a intenção, e componentes devem depender da intenção.

**O que acontece se eu editar `tokens.css` à mão?**
A edição é perdida na próxima geração. Para mudar um token, altere os JSONs (vindos do Figma).

**O que é o Storybook e por que usamos?**
É a vitrine e a documentação viva dos componentes: mostra cada variante e estado isolados, sem precisar montar uma tela do produto.

**Por que o `design.md` existe?**
É a referência textual do sistema (tokens, componentes, regras), pensada para pessoas e IAs consultarem. É gerado automaticamente para não ficar desatualizado.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

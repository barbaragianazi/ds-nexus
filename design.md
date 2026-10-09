# Design System Nexus

> Status: em construção
> Este documento é gerado automaticamente a partir dos tokens do Design System e será evoluído junto com os componentes e regras de uso.

Arquivo gerado por `generate-design-md.js`. Não edite manualmente: altere os tokens ou o código e gere novamente com `npm run generate:design` (ou `npm run generate:ds` para atualizar também `tokens.css`, `tokens.flat.json` e `tailwind-theme.css`).

O Design System ainda está em desenvolvimento:

- tokens, componentes e regras podem sofrer alterações;
- implementações devem priorizar os tokens e componentes documentados aqui.

## Regras gerais

- Priorizar tokens semânticos em componentes.
- Usar primitives apenas quando não existir semantic adequado.
- Evitar valores hardcoded de cor, spacing, radius, tipografia e efeitos.
- Primitives representam valores-base.
- Semantics representam intenção e finalidade de uso.
- Componentes devem consumir semantics sempre que possível.
- Não criar novos tokens diretamente no código sem refletir essa decisão no Design System/Figma.
- O Storybook é a referência visual e funcional dos componentes implementados.
- O design.md é a referência textual estruturada para pessoas e agentes de IA.

## Primitive Tokens

Valores-base exportados do Figma (`src/tokens/primitives.json`).

### Color

#### Blue

- `color/blue/50`: `#CFE7F3`
- `color/blue/100`: `#9ECFE7`
- `color/blue/200`: `#6EB8DB`
- `color/blue/300`: `#3DA0CF`
- `color/blue/400`: `#2594C9`
- `color/blue/500`: `#0D88C3`
- `color/blue/600`: `#0A608A`
- `color/blue/700`: `#074867`
- `color/blue/800`: `#051D29`
- `color/blue/900`: `#090909`

#### Neutral

- `color/neutral/0`: `#FFFFFF`
- `color/neutral/50`: `#D2D2D2`
- `color/neutral/100`: `#D3D3D3`
- `color/neutral/200`: `#A7A7A8`
- `color/neutral/300`: `#4E5051`
- `color/neutral/400`: `#38393A`
- `color/neutral/500`: `#222425`
- `color/neutral/600`: `#151717`
- `color/neutral/700`: `#101011`
- `color/neutral/800`: `#090909`
- `color/neutral/900`: `#060606`

#### Danger

- `color/danger/100`: `#F3AEAE`
- `color/danger/500`: `#EB6F70`
- `color/danger/700`: `#EC2D30`
- `color/danger/900`: `#2A0F10`

#### Warning

- `color/warning/100`: `#EBD6AE`
- `color/warning/500`: `#FFC62B`
- `color/warning/700`: `#FE9B0E`
- `color/warning/900`: `#2A2008`

#### Success

- `color/success/100`: `#AEEBC4`
- `color/success/500`: `#6BC497`
- `color/success/700`: `#0C9D61`
- `color/success/900`: `#0B2A1B`

#### Info

- `color/info/100`: `#F1F8FF`
- `color/info/500`: `#4BA1FF`
- `color/info/700`: `#3A70E2`
- `color/info/900`: `#0C1E36`

### Typography

#### Font Size

- `typography/font-size/10`: `10px`
- `typography/font-size/12`: `12px`
- `typography/font-size/14`: `14px`
- `typography/font-size/16`: `16px`
- `typography/font-size/18`: `18px`
- `typography/font-size/20`: `20px`
- `typography/font-size/24`: `24px`
- `typography/font-size/32`: `32px`
- `typography/font-size/40`: `40px`
- `typography/font-size/48`: `48px`
- `typography/font-size/56`: `56px`
- `typography/font-size/64`: `64px`
- `typography/font-size/72`: `72px`

#### Line Height

- `typography/line-height/16`: `16px`
- `typography/line-height/20`: `20px`
- `typography/line-height/24`: `24px`
- `typography/line-height/28`: `28px`
- `typography/line-height/32`: `32px`
- `typography/line-height/40`: `40px`
- `typography/line-height/48`: `48px`
- `typography/line-height/56`: `56px`
- `typography/line-height/64`: `64px`
- `typography/line-height/80`: `80px`

#### Letter Spacing

- `typography/letter-spacing/tight`: `-0.2px`
- `typography/letter-spacing/normal`: `0px`
- `typography/letter-spacing/wide`: `0.2px`

#### Weight

- `typography/weight/bold`: `Bold`
- `typography/weight/regular`: `Regular`
- `typography/weight/light`: `Light`
- `typography/weight/extra-bold`: `Extra Bold`

### Spacing

- `spacing/4`: `4px`
- `spacing/8`: `8px`
- `spacing/12`: `12px`
- `spacing/16`: `16px`
- `spacing/20`: `20px`
- `spacing/24`: `24px`
- `spacing/28`: `28px`
- `spacing/32`: `32px`
- `spacing/36`: `36px`
- `spacing/40`: `40px`
- `spacing/42`: `42px`
- `spacing/44`: `44px`

### Radius

- `radius/0`: `0px`
- `radius/4`: `4px`
- `radius/8`: `8px`
- `radius/12`: `12px`
- `radius/16`: `16px`
- `radius/24`: `24px`
- `radius/pill`: `9999px`

### Effects

#### Shadow

- `effects/shadow/sm`: x 0px, y 2px, blur 4px, spread 0px
- `effects/shadow/md`: x 0px, y 4px, blur 12px, spread 0px
- `effects/shadow/lg`: x 0px, y 12px, blur 32px, spread -4px

#### Glow

- `effects/glow/sm`: x 0px, y 0px, blur 4px, spread 0px
- `effects/glow/md`: x 0px, y 0px, blur 14px, spread 0px
- `effects/glow/lg`: x 0px, y 0px, blur 16px, spread 0px

A cor de shadow e glow não está presente nos tokens exportados e, por isso, não é documentada aqui.

## Semantic Tokens

Tokens com intenção de uso (`src/tokens/semantics.light.tokens.json` e `semantics.dark.tokens.json`, um arquivo por modo). O alias indica o primitive de origem e só aparece quando o Figma o exporta. O tema escuro vale quando `<html data-theme="dark">`; sem o atributo, vale o light.

### Text

- `color/text/primary`
  - value (light): `#060606`
  - alias (light): `color/neutral/900`
  - value (dark): `#FFFFFF`
  - alias (dark): `color/neutral/0`
- `color/text/secondary`
  - value (light): `#222425`
  - alias (light): `color/neutral/500`
  - value (dark): `#D3D3D3`
  - alias (dark): `color/neutral/100`
- `color/text/tertiary`
  - value (light): `#4E5051`
  - alias (light): `color/neutral/300`
  - value (dark): `#A7A7A8`
  - alias (dark): `color/neutral/200`
- `color/text/disabled`
  - value (light): `#A7A7A8`
  - alias (light): `color/neutral/200`
  - value (dark): `#4E5051`
  - alias (dark): `color/neutral/300`
- `color/text/brand`
  - value (light): `#0D88C3`
  - alias (light): `color/blue/500`
  - value (dark): `#3DA0CF`
  - alias (dark): `color/blue/300`
- `color/text/brand-hover`
  - value (light): `#0A608A`
  - alias (light): `color/blue/600`
  - value (dark): `#6EB8DB`
  - alias (dark): `color/blue/200`
- `color/text/inverse`
  - value (light): `#FFFFFF`
  - alias (light): `color/neutral/0`
  - value (dark): `#060606`
  - alias (dark): `color/neutral/900`

### Feedback

- `color/feedback/danger/foreground`
  - value (light): `#EC2D30`
  - alias (light): `color/danger/700`
  - value (dark): `#F3AEAE`
  - alias (dark): `color/danger/100`
- `color/feedback/danger/default`
  - value (light): `#EB6F70`
  - alias (light): `color/danger/500`
  - dark: igual ao light
- `color/feedback/danger/background`
  - value (light): `#F3AEAE`
  - alias (light): `color/danger/100`
  - value (dark): `#2A0F10`
  - alias (dark): `color/danger/900`
- `color/feedback/warning/foreground`
  - value (light): `#FE9B0E`
  - alias (light): `color/warning/700`
  - value (dark): `#EBD6AE`
  - alias (dark): `color/warning/100`
- `color/feedback/warning/default`
  - value (light): `#FFC62B`
  - alias (light): `color/warning/500`
  - dark: igual ao light
- `color/feedback/warning/background`
  - value (light): `#EBD6AE`
  - alias (light): `color/warning/100`
  - value (dark): `#2A2008`
  - alias (dark): `color/warning/900`
- `color/feedback/success/foreground`
  - value (light): `#0C9D61`
  - alias (light): `color/success/700`
  - value (dark): `#AEEBC4`
  - alias (dark): `color/success/100`
- `color/feedback/success/default`
  - value (light): `#6BC497`
  - alias (light): `color/success/500`
  - dark: igual ao light
- `color/feedback/success/background`
  - value (light): `#AEEBC4`
  - alias (light): `color/success/100`
  - value (dark): `#0B2A1B`
  - alias (dark): `color/success/900`
- `color/feedback/info/foreground`
  - value (light): `#3A70E2`
  - alias (light): `color/info/700`
  - value (dark): `#F1F8FF`
  - alias (dark): `color/info/100`
- `color/feedback/info/default`
  - value (light): `#4BA1FF`
  - alias (light): `color/info/500`
  - dark: igual ao light
- `color/feedback/info/background`
  - value (light): `#F1F8FF`
  - alias (light): `color/info/100`
  - value (dark): `#0C1E36`
  - alias (dark): `color/info/900`

### Border

- `color/border/default`
  - value (light): `#A7A7A8`
  - alias (light): `color/neutral/200`
  - value (dark): `#4E5051`
  - alias (dark): `color/neutral/300`
- `color/border/hover`
  - value (light): `#4E5051`
  - alias (light): `color/neutral/300`
  - value (dark): `#A7A7A8`
  - alias (dark): `color/neutral/200`
- `color/border/readonly`
  - value (light): `#D3D3D3`
  - alias (light): `color/neutral/100`
  - value (dark): `#38393A`
  - alias (dark): `color/neutral/400`
- `color/border/focus`
  - value (light): `#0D88C3`
  - alias (light): `color/blue/500`
  - dark: igual ao light
- `color/border/focus-ring`
  - value (light): `#9ECFE7`
  - alias (light): `color/blue/100`
  - value (dark): `#074867`
  - alias (dark): `color/blue/700`

### Surface

- `color/surface/primary`
  - value (light): `#FFFFFF`
  - alias (light): `color/neutral/0`
  - value (dark): `#060606`
  - alias (dark): `color/neutral/900`
- `color/surface/secondary`
  - value (light): `#D3D3D3`
  - alias (light): `color/neutral/100`
  - value (dark): `#151717`
  - alias (dark): `color/neutral/600`
- `color/surface/tertiary`
  - value (light): `#A7A7A8`
  - alias (light): `color/neutral/200`
  - value (dark): `#38393A`
  - alias (dark): `color/neutral/400`
- `color/surface/brand`
  - value (light): `#0D88C3`
  - alias (light): `color/blue/500`
  - dark: igual ao light
- `color/surface/brand-hover`
  - value (light): `#0A608A`
  - alias (light): `color/blue/600`
  - value (dark): `#2594C9`
  - alias (dark): `color/blue/400`
- `color/surface/inverse`
  - value (light): `#060606`
  - alias (light): `color/neutral/900`
  - value (dark): `#FFFFFF`
  - alias (dark): `color/neutral/0`

### On Surface

- `color/on-surface/primary`
  - value (light): `#060606`
  - alias (light): `color/neutral/900`
  - value (dark): `#FFFFFF`
  - alias (dark): `color/neutral/0`
- `color/on-surface/secondary`
  - value (light): `#151717`
  - alias (light): `color/neutral/600`
  - value (dark): `#D3D3D3`
  - alias (dark): `color/neutral/100`
- `color/on-surface/tertiary`
  - value (light): `#222425`
  - alias (light): `color/neutral/500`
  - value (dark): `#A7A7A8`
  - alias (dark): `color/neutral/200`

### Container

- `color/container/high`
  - value (light): `#A7A7A8`
  - alias (light): `color/neutral/200`
  - value (dark): `#38393A`
  - alias (dark): `color/neutral/400`
- `color/container/default`
  - value (light): `#D3D3D3`
  - alias (light): `color/neutral/100`
  - value (dark): `#151717`
  - alias (dark): `color/neutral/600`
- `color/container/low`
  - value (light): `#D2D2D2`
  - alias (light): `color/neutral/50`
  - value (dark): `#101011`
  - alias (dark): `color/neutral/700`

### Radius

- `radius/0`
  - value (light): `0px`
  - alias (light): `radius/0`
  - dark: igual ao light
- `radius/sm`
  - value (light): `4px`
  - alias (light): `radius/4`
  - dark: igual ao light
- `radius/md`
  - value (light): `8px`
  - alias (light): `radius/8`
  - dark: igual ao light
- `radius/lg`
  - value (light): `12px`
  - alias (light): `radius/12`
  - dark: igual ao light
- `radius/xl`
  - value (light): `16px`
  - alias (light): `radius/16`
  - dark: igual ao light
- `radius/2xl`
  - value (light): `24px`
  - alias (light): `radius/24`
  - dark: igual ao light
- `radius/pill`
  - value (light): `9999px`
  - alias (light): `radius/pill`
  - dark: igual ao light

## Tailwind CSS

- Tailwind CSS v4 é suportado pelo Design System.
- `primitives.json`, `semantics.light.tokens.json` e `semantics.dark.tokens.json` continuam sendo a fonte de verdade.
- `src/tokens/tokens.css` contém as CSS Custom Properties oficiais.
- `src/tokens/tailwind-theme.css` expõe tokens selecionados para utilities Tailwind, sempre via `var(--...)` de `tokens.css` e com o prefixo `nexus`.
- `src/styles/tailwind.css` é a entrada do Tailwind (theme + utilities, sem preflight).
- Componentes devem priorizar semantic tokens.
- Valores arbitrários devem ser evitados quando existir token equivalente.
- `tokens.css` e `tailwind-theme.css` são arquivos gerados por `generate-tokens.js` e não devem ser editados manualmente.

Utilities disponíveis:

- Cores (semantics): `bg-nexus-surface-brand`, `text-nexus-text-primary`, `border-nexus-feedback-danger-default`
- Radius (semantics): `rounded-nexus-md`
- Spacing (primitives): `p-nexus-16`, `gap-nexus-8`, `m-nexus-4`
- Tipografia: `text-nexus-16` (font-size), `leading-nexus-24`, `tracking-nexus-wide`, `font-nexus-bold`
- Efeitos: `shadow-nexus-md`, `shadow-nexus-glow-md`

Primitives de cor (`--color-blue-500` etc.) ficam disponíveis apenas via `var()` em `tokens.css`, sem utility Tailwind.

## Components

Lista gerada a partir de `src/components`. Props e tipos são lidos do código; regras de uso ainda não foram documentadas.

### Button

Status: draft

- source: `src/components/Button/Button.tsx`
- stories: `src/components/Button/Button.stories.tsx`

Tipos com valores explícitos:

- `ButtonSize`: `small`, `medium`, `large`
- `ButtonState`: `enabled`, `hover`, `disabled`, `outlined`, `text`
- `ButtonVariant`: `primary`, `secondary`

Props:

- `label?`: `string`
- `variant?`: `ButtonVariant ("primary" | "secondary")` - Figma `type`
- `size?`: `ButtonSize ("small" | "medium" | "large")`
- `state?`: `ButtonState ("enabled" | "hover" | "disabled" | "outlined" | "text")` - Figma `state`. "hover" and "disabled" force the visual state; "outlined" and "text" are visual styles.
- `hasText?`: `boolean` - Figma `has-text`
- `iconLeft?`: `boolean` - Figma `icon-left`
- `iconRight?`: `boolean` - Figma `icon-right`

### Input

Status: draft

- source: `src/components/Input/Input.tsx`
- stories: `src/components/Input/Input.stories.tsx`

Tipos com valores explícitos:

- `InputSize`: `sm`, `md`, `lg`
- `InputState`: `default`, `error`, `success`

Props:

- `label?`: `string`
- `helperText?`: `string`
- `errorMessage?`: `string` - Shown instead of helperText when state is "error".
- `size?`: `InputSize ("sm" | "md" | "lg")`
- `state?`: `InputState ("default" | "error" | "success")`
- `leadingIcon?`: `ReactNode`
- `trailingIcon?`: `ReactNode`

### Modal

Status: draft

- source: `src/components/Modal/Modal.tsx`
- stories: `src/components/Modal/Modal.stories.tsx`

Tipos com valores explícitos:

- `ModalVariant`: `action`, `content`
- `ModalTone`: `success`, `alert`, `error`

Props:

- `open?`: `boolean`
- `onClose?`: `() => void`
- `variant?`: `ModalVariant ("action" | "content")` - "action": compact, icon + message. "content": wide, brand header + free content.
- `tone?`: `ModalTone ("success" | "alert" | "error")` - Colors the icon and the primary action. Defaults to "success" for the action variant.
- `title`: `string`
- `description?`: `string` - Short text under the title (action variant).
- `children?`: `ReactNode` - Free content (content variant body).
- `icon?`: `ReactNode` - Overrides the tone icon. Pass `null` to hide it.
- `showClose?`: `boolean`
- `closeLabel?`: `string`
- `primaryAction?`: `ModalAction`
- `secondaryAction?`: `ModalAction`
- `footer?`: `ReactNode` - Replaces the default footer buttons.
- `closeOnOverlayClick?`: `boolean`
- `closeOnEscape?`: `boolean`
- `inline?`: `boolean` - Renders the dialog in place, without overlay or portal (docs and previews).
- `className?`: `string`

## Maturity

- Foundations: draft
- Components: draft
- Documentation: draft

Significado dos status:

- `draft`: pode sofrer alterações
- `stable`: aprovado para uso consistente
- `deprecated`: evitar uso

## Manutenção

Sempre que houver alteração que impacte o Design System, o design.md deve ser regenerado. São impactos:

- novos tokens ou alteração de tokens
- novos Foundations
- novos componentes
- alteração de props, novas variantes ou novos estados
- regras de uso e acessibilidade
- depreciação de componentes
- mudanças estruturais do Design System

Comando: `npm run generate:ds`

Fluxo ao atualizar tokens do Figma:

1. Atualize `src/tokens/primitives.json`, `src/tokens/semantics.light.tokens.json` e `src/tokens/semantics.dark.tokens.json` com o export do Figma.
2. Rode `npm run dev`, `npm run storybook` ou `npm run build`: o `generate:ds` roda automaticamente antes e tudo já está atualizado.
3. Para só regenerar os arquivos, sem subir nada, use `npm run generate:ds`.

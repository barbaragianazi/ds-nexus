# Design System Nexus

> Status: em construção
> Este documento é gerado automaticamente a partir dos tokens do Design System e será evoluído junto com os componentes e regras de uso.

Arquivo gerado por `generate-design-md.js`. Não edite manualmente: altere os tokens ou o código e gere novamente com `npm run generate:design` (ou `npm run generate:ds` para atualizar também o `tokens.css`).

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

#### Warning

- `color/warning/100`: `#EBD6AE`
- `color/warning/500`: `#FFC62B`
- `color/warning/700`: `#FE9B0E`

#### Success

- `color/success/100`: `#AEEBC4`
- `color/success/500`: `#6BC497`
- `color/success/700`: `#0C9D61`

#### Info

- `color/info/100`: `#F1F8FF`
- `color/info/500`: `#4BA1FF`
- `color/info/700`: `#3A70E2`

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

Tokens com intenção de uso (`src/tokens/semantics.json`). O alias indica o primitive de origem e só aparece quando o Figma o exporta.

### Text

- `color/text/primary`
  - value: `#060606`
  - alias: `color/neutral/900`
- `color/text/secondary`
  - value: `#222425`
  - alias: `color/neutral/500`
- `color/text/tertiary`
  - value: `#4E5051`
  - alias: `color/neutral/300`
- `color/text/disabled`
  - value: `#A7A7A8`
  - alias: `color/neutral/200`
- `color/text/brand`
  - value: `#0D88C3`
  - alias: `color/blue/500`
- `color/text/inverse`
  - value: `#FFFFFF`
  - alias: `color/neutral/0`

### Feedback

- `color/feedback/danger/foreground`
  - value: `#EC2D30`
  - alias: `color/danger/700`
- `color/feedback/danger/default`
  - value: `#EB6F70`
  - alias: `color/danger/500`
- `color/feedback/danger/background`
  - value: `#F3AEAE`
  - alias: `color/danger/100`
- `color/feedback/warning/foreground`
  - value: `#FE9B0E`
  - alias: `color/warning/700`
- `color/feedback/warning/default`
  - value: `#FFC62B`
  - alias: `color/warning/500`
- `color/feedback/warning/background`
  - value: `#EBD6AE`
  - alias: `color/warning/100`
- `color/feedback/success/foreground`
  - value: `#0C9D61`
  - alias: `color/success/700`
- `color/feedback/success/default`
  - value: `#6BC497`
  - alias: `color/success/500`
- `color/feedback/success/background`
  - value: `#AEEBC4`
  - alias: `color/success/100`
- `color/feedback/info/foreground`
  - value: `#3A70E2`
  - alias: `color/info/700`
- `color/feedback/info/default`
  - value: `#4BA1FF`
  - alias: `color/info/500`
- `color/feedback/info/background`
  - value: `#F1F8FF`
  - alias: `color/info/100`

### Surface

- `color/surface/primary`
  - value: `#FFFFFF`
  - alias: `color/neutral/0`
- `color/surface/secondary`
  - value: `#D3D3D3`
  - alias: `color/neutral/100`
- `color/surface/tertiary`
  - value: `#A7A7A8`
  - alias: `color/neutral/200`
- `color/surface/brand`
  - value: `#0D88C3`
  - alias: `color/blue/500`
- `color/surface/inverse`
  - value: `#060606`
  - alias: `color/neutral/900`

### On Surface

- `color/on-surface/primary`
  - value: `#060606`
  - alias: `color/neutral/900`
- `color/on-surface/secondary`
  - value: `#151717`
  - alias: `color/neutral/600`
- `color/on-surface/tertiary`
  - value: `#222425`
  - alias: `color/neutral/500`

### Container

- `color/container/high`
  - value: `#A7A7A8`
  - alias: `color/neutral/200`
- `color/container/default`
  - value: `#D3D3D3`
  - alias: `color/neutral/100`
- `color/container/low`
  - value: `#D2D2D2`
  - alias: `color/neutral/50`

### Radius

- `radius/0`
  - value: `0px`
  - alias: `radius/0`
- `radius/sm`
  - value: `4px`
  - alias: `radius/4`
- `radius/md`
  - value: `8px`
  - alias: `radius/8`
- `radius/lg`
  - value: `12px`
  - alias: `radius/12`
- `radius/xl`
  - value: `16px`
  - alias: `radius/16`
- `radius/2xl`
  - value: `24px`
  - alias: `radius/24`
- `radius/pill`
  - value: `9999px`
  - alias: `radius/pill`

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

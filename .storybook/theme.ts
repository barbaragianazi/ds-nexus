// Define os temas Nexus (claro e escuro) do Storybook usando as cores dos tokens.
import { create } from 'storybook/theming/create';
import { token } from './tokens';

// Todas as cores vêm de src/tokens/tokens.css (gerado dos JSON do Figma).
const color = {
  blue400: token('color-blue-400'),
  blue500: token('color-blue-500'),
  blue600: token('color-blue-600'),
  neutral0: token('color-neutral-0'),
  neutral50: token('color-neutral-50'),
  neutral100: token('color-neutral-100'),
  neutral200: token('color-neutral-200'),
  neutral300: token('color-neutral-300'),
  neutral400: token('color-neutral-400'),
  neutral500: token('color-neutral-500'),
  neutral600: token('color-neutral-600'),
  neutral700: token('color-neutral-700'),
  neutral800: token('color-neutral-800'),
  neutral900: token('color-neutral-900'),
};

const radius = parseInt(token('radius-8'), 10);

const base = {
  brandTitle: 'Nexus/DS',
  brandUrl: './', // raiz do próprio Storybook
  brandTarget: '_self',

  fontBase: '"Nunito Sans", sans-serif', // mesma família dos componentes (Button/Input/Modal)
  fontCode: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace", // mesma stack de foundations.css

  appBorderRadius: radius,
  inputBorderRadius: radius,
} as const;

export const nexusDark = create({
  ...base,
  base: 'dark',
  brandImage: 'logo-on-dark.svg', // logo claro (#EAEAEA) para fundo escuro

  colorPrimary: color.blue500,
  colorSecondary: color.blue400,

  appBg: color.neutral800,
  appContentBg: color.neutral700,
  appPreviewBg: color.neutral700,
  appBorderColor: color.neutral400,

  textColor: color.neutral0,
  textInverseColor: color.neutral900,
  textMutedColor: color.neutral200,

  barBg: color.neutral600,
  barTextColor: color.neutral200,
  barHoverColor: color.blue400,
  barSelectedColor: color.blue400,

  buttonBg: color.neutral500,
  buttonBorder: color.neutral400,
  booleanBg: color.neutral500,
  booleanSelectedBg: color.blue500,

  inputBg: color.neutral600,
  inputBorder: color.neutral400,
  inputTextColor: color.neutral0,
});

export const nexusLight = create({
  ...base,
  base: 'light',
  brandImage: 'logo-on-light.svg', // logo escuro (#0A0A0A) para fundo claro

  colorPrimary: color.blue600,
  colorSecondary: color.blue500,

  appBg: color.neutral0,
  appContentBg: color.neutral0,
  appPreviewBg: color.neutral0,
  appBorderColor: color.neutral50,

  textColor: color.neutral900,
  textInverseColor: color.neutral0,
  textMutedColor: color.neutral300,

  barBg: color.neutral0,
  barTextColor: color.neutral300,
  barHoverColor: color.blue500,
  barSelectedColor: color.blue600,

  buttonBg: color.neutral0,
  buttonBorder: color.neutral50,
  booleanBg: color.neutral100,
  booleanSelectedBg: color.neutral0,

  inputBg: color.neutral0,
  inputBorder: color.neutral50,
  inputTextColor: color.neutral900,
});

export default nexusDark;

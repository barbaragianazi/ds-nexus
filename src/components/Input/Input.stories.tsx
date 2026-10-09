// Stories do Input no Storybook.
import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Campo de texto com label, mensagem de apoio e estados de erro/sucesso. Hover e focus são tratados via CSS, sem props. As bordas usam os tokens semânticos border/* e acompanham o tema claro/escuro.",
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    state: { control: "inline-radio", options: ["default", "error", "success"] },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

const column: CSSProperties = { display: "grid", gap: 24 };

export const Playground: Story = {
  args: {
    label: "Nome",
    placeholder: "Digite seu nome",
    helperText: "Como aparece no seu documento.",
    errorMessage: "Campo obrigatório.",
    required: false,
    disabled: false,
    readOnly: false,
    size: "md",
    state: "default",
    type: "text",
  },
};

export const Default: Story = {
  args: { placeholder: "Placeholder", "aria-label": "Campo de texto" },
};

export const WithLabel: Story = {
  args: { label: "E-mail", placeholder: "voce@exemplo.com", type: "email", required: true },
};

export const WithHelperText: Story = {
  args: {
    label: "Senha",
    type: "password",
    placeholder: "Mínimo de 8 caracteres",
    helperText: "Use letras, números e símbolos.",
  },
};

export const WithIcons: Story = {
  render: () => (
    <div style={column}>
      <Input label="Buscar" placeholder="Buscar..." leadingIcon="🔍" />
      <Input label="Valor" placeholder="0,00" trailingIcon="R$" />
      <Input label="Usuário" placeholder="usuario" leadingIcon="@" trailingIcon="✓" />
    </div>
  ),
};

export const Error: Story = {
  args: {
    label: "E-mail",
    defaultValue: "email-invalido",
    state: "error",
    errorMessage: "Informe um e-mail válido.",
    helperText: "Usaremos para enviar o recibo.",
  },
};

export const Success: Story = {
  args: {
    label: "Usuário",
    defaultValue: "bgianazi",
    state: "success",
    helperText: "Nome de usuário disponível.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Campo desabilitado",
    placeholder: "Indisponível",
    helperText: "Você não pode editar este campo.",
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: "ID do pedido",
    defaultValue: "ORD-2026-00123",
    helperText: "Somente leitura.",
    readOnly: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={column}>
      <Input size="sm" label="Small" placeholder="36px" />
      <Input size="md" label="Medium" placeholder="40px" />
      <Input size="lg" label="Large" placeholder="48px" />
    </div>
  ),
};

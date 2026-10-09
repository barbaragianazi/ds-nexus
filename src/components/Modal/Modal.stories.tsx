// Stories do Modal no Storybook.
import { useState } from "react";
import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { Modal } from "./Modal";

const meta = {
  title: "Components/Modal",
  component: Modal,
  parameters: { layout: "centered" },
  args: {
    title: "Ação concluída",
    description: "A operação foi realizada com sucesso e as alterações já estão disponíveis.",
    variant: "action",
    tone: "success",
    showClose: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    primaryAction: { label: "Continuar" },
    secondaryAction: { label: "Voltar" },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["action", "content"] },
    tone: { control: "inline-radio", options: ["success", "alert", "error"] },
    open: { control: false },
    onClose: { control: false },
    icon: { control: false },
    footer: { control: false },
    children: { control: false },
    inline: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

type ModalArgs = ComponentProps<typeof Modal>;

/** Wraps Modal with an "Abrir modal" button; starts open to match the Figma frames. */
function ModalDemo({ initialOpen = true, ...args }: ModalArgs & { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const close = () => setOpen(false);
  return (
    <>
      <Button label="Abrir modal" variant="primary" onClick={() => setOpen(true)} />
      <Modal
        {...args}
        open={open}
        onClose={close}
        primaryAction={args.primaryAction && { ...args.primaryAction, onClick: close }}
        secondaryAction={args.secondaryAction && { ...args.secondaryAction, onClick: close }}
      />
    </>
  );
}

const contentPlaceholder = (
  <div
    style={{
      height: 356,
      background: "var(--color-surface-secondary)",
    }}
  />
);

export const Playground: Story = {
  render: (args) => <ModalDemo {...args} initialOpen={false} />,
};

export const Modal1: Story = {
  render: (args) => <ModalDemo {...args} />,
};

export const Modal2: Story = {
  args: {
    variant: "content",
    tone: undefined,
    title: "Modal de conteúdo",
    description: undefined,
    primaryAction: { label: "Confirmar" },
    secondaryAction: { label: "Cancelar" },
    children: contentPlaceholder,
  },
  render: (args) => <ModalDemo {...args} />,
};

export const Variants: Story = {
  name: "States / Variants",
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "grid", gap: 24, justifyItems: "start" }}>
      <Modal
        inline
        title="Ação concluída"
        description="A operação foi realizada com sucesso e as alterações já estão disponíveis."
        tone="success"
        primaryAction={{ label: "Continuar" }}
        secondaryAction={{ label: "Voltar" }}
      />
      <Modal
        inline
        title="Alterações pendentes"
        description="Existem mudanças que ainda não foram salvas. Deseja continuar mesmo assim?"
        tone="alert"
        primaryAction={{ label: "Continuar" }}
        secondaryAction={{ label: "Cancelar" }}
      />
      <Modal
        inline
        title="Excluir item"
        description="Esta ação não poderá ser desfeita e o item será removido permanentemente."
        tone="error"
        primaryAction={{ label: "Excluir" }}
        secondaryAction={{ label: "Cancelar" }}
      />
      <Modal
        inline
        variant="content"
        title="Modal de conteúdo"
        primaryAction={{ label: "Confirmar" }}
        secondaryAction={{ label: "Cancelar" }}
      >
        {contentPlaceholder}
      </Modal>
    </div>
  ),
};

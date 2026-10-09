// Stories do Button no Storybook.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    label: "Texto botão",
    variant: "primary",
    size: "medium",
    state: "enabled",
    hasText: true,
    iconLeft: false,
    iconRight: false,
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
    size: { control: "inline-radio", options: ["small", "medium", "large"] },
    state: {
      control: "select",
      options: ["enabled", "hover", "disabled", "outlined", "text"],
    },
    hasText: { control: "boolean" },
    iconLeft: { control: "boolean" },
    iconRight: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Hover: Story = { args: { state: "hover" } };

export const Disabled: Story = { args: { state: "disabled" } };

export const Outlined: Story = { args: { state: "outlined" } };

export const Text: Story = { args: { state: "text" } };

export const Secondary: Story = { args: { variant: "secondary" } };

export const IconLeft: Story = { args: { iconLeft: true } };

export const IconRight: Story = { args: { iconRight: true } };

export const IconBoth: Story = { args: { iconLeft: true, iconRight: true } };

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {(["small", "medium", "large"] as const).map((size) => (
        <div key={size} style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {(["enabled", "hover", "disabled", "outlined", "text"] as const).map((state) => (
            <Button key={state} {...args} size={size} state={state} />
          ))}
          <Button {...args} size={size} variant="secondary" />
        </div>
      ))}
    </div>
  ),
};

// Componente Button: botão com variantes, tamanhos, estados e ícones opcionais.
import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

export type ButtonSize = "small" | "medium" | "large";
export type ButtonState = "enabled" | "hover" | "disabled" | "outlined" | "text";
export type ButtonVariant = "primary" | "secondary";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label?: string;
  /** Figma `type` */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Figma `state`. "hover" and "disabled" force the visual state; "outlined" and "text" are visual styles. */
  state?: ButtonState;
  /** Figma `has-text` */
  hasText?: boolean;
  /** Figma `icon-left` */
  iconLeft?: boolean;
  /** Figma `icon-right` */
  iconRight?: boolean;
};

function AddIcon() {
  return (
    <span className="button__icon" aria-hidden="true">
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="14" height="14" rx="2" />
        <path d="M10 6.5v7M6.5 10h7" />
      </svg>
    </span>
  );
}

export function Button({
  label = "Texto botão",
  variant = "primary",
  size = "medium",
  state = "enabled",
  hasText = true,
  iconLeft = false,
  iconRight = false,
  disabled,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || state === "disabled";
  const classes = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    `button--${state}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} disabled={isDisabled} {...rest}>
      {iconLeft && <AddIcon />}
      {hasText && <span className="button__label">{label}</span>}
      {iconRight && <AddIcon />}
    </button>
  );
}

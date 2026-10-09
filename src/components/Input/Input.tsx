// Componente Input: campo de texto com label, mensagem de apoio e estados de erro/sucesso.
import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import "./Input.css";

export type InputSize = "sm" | "md" | "lg";
export type InputState = "default" | "error" | "success";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  helperText?: string;
  /** Shown instead of helperText when state is "error". */
  errorMessage?: string;
  size?: InputSize;
  state?: InputState;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    errorMessage,
    size = "md",
    state = "default",
    leadingIcon,
    trailingIcon,
    id,
    type = "text",
    required,
    disabled,
    readOnly,
    className,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  const isError = state === "error";
  const message = isError ? errorMessage ?? helperText : helperText;
  const describedBy = [message ? messageId : null, ariaDescribedBy]
    .filter(Boolean)
    .join(" ") || undefined;

  const fieldClasses = [
    "input-field",
    `input-field--${size}`,
    `input-field--${state}`,
    disabled && "input-field--disabled",
    readOnly && "input-field--readonly",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={fieldClasses}>
      {label && (
        <label className="input-field__label" htmlFor={inputId}>
          {label}
          {required && (
            <span className="input-field__required" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
      )}
      <div className="input-field__control">
        {leadingIcon && (
          <span className="input-field__icon" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className="input-field__input"
          type={type}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={isError || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {trailingIcon && (
          <span className="input-field__icon" aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </div>
      {message && (
        <p
          id={messageId}
          className="input-field__message"
          role={isError ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
});

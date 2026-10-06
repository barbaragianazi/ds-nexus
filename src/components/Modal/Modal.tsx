import { useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button/Button";
import iconSuccess from "./assets/icon-success.svg";
import iconAlert from "./assets/icon-alert.svg";
import iconError from "./assets/icon-error.svg";
import closeDark from "./assets/close-dark.svg";
import closeLight from "./assets/close-light.svg";
import "./Modal.css";

export type ModalVariant = "action" | "content";
export type ModalTone = "success" | "alert" | "error";

export type ModalAction = {
  label: string;
  onClick?: () => void;
};

export type ModalProps = {
  open?: boolean;
  onClose?: () => void;
  /** "action": compact, icon + message. "content": wide, brand header + free content. */
  variant?: ModalVariant;
  /** Colors the icon and the primary action. Defaults to "success" for the action variant. */
  tone?: ModalTone;
  title: string;
  /** Short text under the title (action variant). */
  description?: string;
  /** Free content (content variant body). */
  children?: ReactNode;
  /** Overrides the tone icon. Pass `null` to hide it. */
  icon?: ReactNode;
  showClose?: boolean;
  closeLabel?: string;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  /** Replaces the default footer buttons. */
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  /** Renders the dialog in place, without overlay or portal (docs and previews). */
  inline?: boolean;
  className?: string;
};

const toneIcons: Record<ModalTone, string> = {
  success: iconSuccess,
  alert: iconAlert,
  error: iconError,
};

export function Modal({
  open = true,
  onClose,
  variant = "action",
  tone,
  title,
  description,
  children,
  icon,
  showClose = true,
  closeLabel = "Fechar",
  primaryAction,
  secondaryAction,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  inline = false,
  className,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const resolvedTone = tone ?? (variant === "action" ? "success" : undefined);
  const isContent = variant === "content";

  useEffect(() => {
    if (!open || inline) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") onCloseRef.current?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, inline, closeOnEscape]);

  if (!open) return null;

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) onClose?.();
  };

  const closeButton = showClose && (
    <button
      type="button"
      className="modal__close"
      aria-label={closeLabel}
      onClick={onClose}
    >
      <img src={isContent ? closeLight : closeDark} alt="" />
    </button>
  );

  const toneIcon =
    icon === undefined && resolvedTone && !isContent ? (
      <img src={toneIcons[resolvedTone]} alt="" />
    ) : (
      icon
    );

  const dialog = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal={inline ? undefined : true}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      tabIndex={-1}
      className={[
        "modal",
        `modal--${variant}`,
        resolvedTone && `modal--${resolvedTone}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isContent ? (
        <div className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          {closeButton}
        </div>
      ) : null}

      <div className="modal__body">
        {!isContent && (
          <div className="modal__top">
            {toneIcon ? <div className="modal__icon">{toneIcon}</div> : <span />}
            {closeButton}
          </div>
        )}

        {!isContent && (
          <div className="modal__text">
            <h2 id={titleId} className="modal__title">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="modal__description">
                {description}
              </p>
            )}
          </div>
        )}

        {children && <div className="modal__content">{children}</div>}

        {footer ??
          ((primaryAction || secondaryAction) && (
            <div className="modal__footer">
              {secondaryAction && (
                <Button
                  variant="secondary"
                  size="large"
                  label={secondaryAction.label}
                  onClick={secondaryAction.onClick}
                  className="modal__action modal__action--secondary"
                />
              )}
              {primaryAction && (
                <Button
                  variant="primary"
                  size="large"
                  label={primaryAction.label}
                  onClick={primaryAction.onClick}
                  className="modal__action modal__action--primary"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );

  if (inline) return dialog;

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {dialog}
    </div>,
    document.body,
  );
}

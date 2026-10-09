// Componente Modal: janela de diálogo (variantes de ação e de conteúdo) renderizada em portal.
import { useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button/Button";
import iconSuccess from "./assets/icon-success.svg";
import iconAlert from "./assets/icon-alert.svg";
import iconError from "./assets/icon-error.svg";
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

// Inline (not an <img>) so it follows currentColor and stays visible in light and dark.
// The content variant keeps close-light.svg: it always sits on the brand header.
function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <path d="M13.5858 2.39089C14.1324 1.84427 14.1324 0.956558 13.5858 0.40994C13.0391 -0.136679 12.1514 -0.136679 11.6048 0.40994L7.0001 5.01903L2.39101 0.414313C1.84439 -0.132306 0.95668 -0.132306 0.410062 0.414313C-0.136557 0.960931 -0.136557 1.84864 0.410062 2.39526L5.01915 6.99998L0.414435 11.6091C-0.132184 12.1557 -0.132184 13.0434 0.414435 13.59C0.961053 14.1366 1.84876 14.1366 2.39538 13.59L7.0001 8.98092L11.6092 13.5856C12.1558 14.1323 13.0435 14.1323 13.5901 13.5856C14.1368 13.039 14.1368 12.1513 13.5901 11.6047L8.98104 6.99998L13.5858 2.39089Z" />
    </svg>
  );
}

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
      {isContent ? <img src={closeLight} alt="" /> : <CloseIcon />}
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

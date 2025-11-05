import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { SheetCloseButton } from "./SheetCloseButton";

/**
 * Minimal, custom, NON-scrollable bottom sheet style modal specifically for the Refine view.
 * - No internal scrolling.
 * - No page/background scrolling while open.
 * - Fixed height (responsive) unless overridden by `height` prop.
 * - Only shows the illustration (no dynamic children).
 *
 * Usage (already in codebase):
 *   <RefinePage open={isRefineOpen} onOpenChange={setIsRefineOpen} height="70vh" />
 */
export interface RefineSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    height?: string; // Optional custom height (e.g. "60vh"). Defaults adapt to viewport.
    title?: string; // Optional heading (defaults to "Refine").
    illustrationSrc?: string; // Optional custom illustration src
    illustrationAlt?: string; // Optional custom alt text
    illustrationClassName?: string; // Optional extra className for the img
}

const DEFAULT_TITLE = "Refine";
const DEFAULT_ILLUSTRATION_SRC = "/undraw_halloween-2025_o47f.svg";
const DEFAULT_ILLUSTRATION_ALT = "Illustration";

const portalRootId = "__refine_portal_root";

function ensurePortalRoot(): HTMLElement {
    let el = document.getElementById(portalRootId);
    if (!el) {
        el = document.createElement("div");
        el.id = portalRootId;
        document.body.appendChild(el);
    }
    return el;
}

export const RefineSheet: React.FC<RefineSheetProps> = ({
    open,
    onOpenChange,
    height,
    title = DEFAULT_TITLE,
    illustrationSrc = DEFAULT_ILLUSTRATION_SRC,
    illustrationAlt = DEFAULT_ILLUSTRATION_ALT,
    illustrationClassName,
}) => {
    const portalElRef = useRef<HTMLElement | null>(null);
    const lastBodyOverflowRef = useRef<string>("");

    // Lock body scroll when open.
    useEffect(() => {
        if (open) {
            lastBodyOverflowRef.current = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            document.body.classList.add("modal-sheet-open");
        } else {
            document.body.style.overflow = lastBodyOverflowRef.current;
            document.body.classList.remove("modal-sheet-open");
        }
        return () => {
            document.body.style.overflow = lastBodyOverflowRef.current;
            document.body.classList.remove("modal-sheet-open");
        };
    }, [open]);

    // Prepare portal root.
    if (typeof document !== "undefined" && !portalElRef.current) {
        portalElRef.current = ensurePortalRoot();
    }

    if (!open || !portalElRef.current) {
        return null;
    }

    // Compute final height (prevent gigantic sheet on small devices).
    // If caller passes an explicit vh height (e.g. "95vh") for addPerson variant,
    // convert it to pixel height using visualViewport (or window.innerHeight) to
    // avoid iOS Safari dynamic 100vh inconsistencies that cause vertical misalignment.
    const computedHeight = (() => {
        if (height) {
            const trimmed = height.trim();
            if (variant === "addPerson" && /vh$/i.test(trimmed)) {
                const vhNumber = parseFloat(trimmed);
                if (!isNaN(vhNumber)) {
                    const vpH =
                        typeof window !== "undefined"
                            ? window.visualViewport?.height ||
                              window.innerHeight
                            : undefined;
                    if (vpH) {
                        return Math.round((vpH * vhNumber) / 100) + "px";
                    }
                }
            }
            return height;
        }
        return computeResponsiveHeight(variant);
    })();

    return ReactDOM.createPortal(
        <>
            <style>{modalCSS}</style>
            <div
                className="refine-modal-overlay"
                aria-hidden="true"
                onClick={() => onOpenChange(false)}
            />
            <div
                className="refine-modal-sheet"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                style={{ height: computedHeight }}
            >
                <div className="refine-modal-header">
                    <h2 className="refine-modal-title">{title}</h2>
                    <SheetCloseButton
                        onClick={() => onOpenChange(false)}
                        ariaLabel="Close"
                        size={40}
                    />
                </div>
                <div className="refine-modal-body">
                    <img
                        src={illustrationSrc}
                        alt={illustrationAlt || title}
                        className={`refine-illustration ${illustrationClassName || ""}`.trim()}
                        draggable={false}
                    />
                </div>
                <div className="refine-modal-bottom-spacer" />
            </div>
        </>,
        portalElRef.current,
    );
};

/**
 * Determine a reasonable default height for the sheet based on viewport.
 * Keeps it visually balanced and below full screen.
 */
function computeResponsiveHeight(): string {
    if (typeof window === "undefined") return "65vh";
    const h = window.innerHeight;
    if (h < 560) return "55vh";
    if (h < 680) return "60vh";
    return "95vh";
}

/**
 * All CSS isolated here to avoid external dependencies.
 * Absolutely no scrolling: overflow hidden everywhere inside the sheet.
 */
const modalCSS = `
.refine-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.32);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 9998;
  touch-action: none;
}

.refine-modal-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #ffffff;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  -webkit-user-select: none;
  user-select: none;
  animation: refine-sheet-in 180ms cubic-bezier(.32,.72,.33,.99);
  max-width: 100%;
  /* Prevent any native scrolling/bounce inside */
  overscroll-behavior: none;
  touch-action: none;
  /* Stabilize transform pipeline to mitigate iOS visualViewport jump */
  will-change: transform;
  transform: translateZ(0);
}

@keyframes refine-sheet-in {
  from { transform: translateY(35px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.refine-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* Unified spacing with AddPersonSheet (py-4 equivalent) */
  padding: 16px 28px;
  flex: 0 0 auto;
  min-height: 64px;
}

.refine-modal-title {
  margin: 0;
  width: 100%;
  text-align: center;
  font-size: 1.25rem;
  line-height: 1.2;
  font-weight: 700;
  color: #1f2937; /* gray-800 */
  font-family: system-ui,-apple-system,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif;
}

/* Close button now uses shared SheetCloseButton component; old styles removed */

.refine-modal-body {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 24px 24px 24px;
  overflow: hidden;
  /* Avoid scrollbars */
  scrollbar-width: none;
}
.refine-modal-body::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.refine-illustration {
  width: min(60vw, 260px);
  height: auto;
  max-height: 100%;
  object-fit: contain;
  opacity: 0.9;
  pointer-events: none;
  user-select: none;
}

.refine-modal-bottom-spacer {
  height: env(safe-area-inset-bottom);
  flex: 0 0 auto;
  width: 100%;
}

/* Body lock helper (added just in case external styles interfere) */
body.modal-sheet-open {
  overflow: hidden !important;
  overscroll-behavior: none;
}
`;

export default RefineSheet;

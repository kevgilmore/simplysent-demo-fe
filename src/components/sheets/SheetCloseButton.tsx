import React, { forwardRef, memo } from "react";
import { X } from "lucide-react";

/**
 * A reusable close button for sheets / slide-in panels.
 * Unifies styling and interaction behavior across AddPersonSheet and RefineSheet.
 *
 * Features:
 * - Accessible: proper aria-label, focus ring, keyboard support.
 * - Customizable size, icon, and additional className overrides.
 * - Consistent circular hit target (40px by default).
 *
 * Example:
 *   <SheetCloseButton onClick={() => onOpenChange(false)} />
 *
 * You can override the icon:
 *   <SheetCloseButton icon={<MyIcon />} />
 *
 * Or size:
 *   <SheetCloseButton size={48} />
 */
export interface SheetCloseButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  onClick: () => void;
  ariaLabel?: string;
  size?: number; // Pixel dimension for square button (default 40)
  icon?: React.ReactNode;
  className?: string;
  testId?: string;
}

export const SheetCloseButton = memo(
  forwardRef<HTMLButtonElement, SheetCloseButtonProps>(
    (
      {
        onClick,
        ariaLabel = "Close",
        size = 40,
        icon,
        className = "",
        testId = "sheet-close-button",
        ...buttonProps
      },
      ref,
    ) => {
      return (
        <button
          type="button"
          ref={ref}
            // Ensure fixed square size to eliminate layout shift on interaction
          style={{ width: size, height: size }}
          onClick={onClick}
          aria-label={ariaLabel}
          data-testid={testId}
          className={[
            "flex items-center justify-center rounded-full",
            "hover:bg-gray-100 active:bg-gray-200",
            "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            "select-none",
            // Prevent accidental text selection / dragging
            "touch-manipulation",
            className,
          ].join(" ")}
          {...buttonProps}
        >
          {icon ?? <X className="w-6 h-6 text-gray-700 pointer-events-none" />}
        </button>
      );
    },
  ),
);

SheetCloseButton.displayName = "SheetCloseButton";

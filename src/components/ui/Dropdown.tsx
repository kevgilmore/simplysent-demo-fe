import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
    label?: string;
    placeholder?: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    label,
    placeholder = "Select an option",
    value,
    options,
    onChange,
    error,
    disabled = false,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Calculate menu position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            // Use requestAnimationFrame to ensure layout is stable, especially on mobile
            const updatePosition = () => {
                if (buttonRef.current) {
                    const rect = buttonRef.current.getBoundingClientRect();
                    // Use button's exact position - getBoundingClientRect gives viewport coordinates
                    // which work perfectly with fixed positioning
                    // Subtract 2px to account for border alignment and move menu left to match input
                    setMenuPosition({
                        top: Math.round(rect.bottom) + 8,
                        left: Math.round(rect.left) - 2,
                        width: Math.round(rect.width),
                    });
                }
            };
            
            // Double RAF for mobile to ensure layout is fully stable
            requestAnimationFrame(() => {
                requestAnimationFrame(updatePosition);
            });
        } else {
            setMenuPosition(null);
        }
    }, [isOpen]);

    // Prevent scrolling when dropdown is open
    useEffect(() => {
        if (isOpen) {
            // Find the scrollable parent container
            let scrollableParent: HTMLElement | null = buttonRef.current?.closest('[style*="overflow-y"]') || null;
            if (!scrollableParent) {
                scrollableParent = buttonRef.current?.closest('.overflow-y-auto') || null;
            }
            
            if (scrollableParent) {
                const originalOverflow = scrollableParent.style.overflow;
                scrollableParent.style.overflow = 'hidden';
                return () => {
                    scrollableParent!.style.overflow = originalOverflow;
                };
            }
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            // Check if click is outside both the dropdown container and the portal menu
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(target) &&
                menuRef.current &&
                !menuRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            // Use a small delay to avoid immediate closing when opening
            const timeoutId = setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 0);
            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen]);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className={`w-full ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">
                    {label}
                </label>
            )}

            <div className="relative">
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`w-full px-6 py-4 rounded-full border-2 transition-all duration-200 font-medium text-left flex items-center justify-between
            ${
                error
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-200 focus:border-[#5E57AC]"
            }
            ${
                disabled
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-white hover:border-gray-300"
            }
            focus:outline-none focus:ring-4 focus:ring-[#5E57AC]/20
          `}
                >
                    <span
                        className={
                            selectedOption ? "text-gray-800" : "text-gray-400"
                        }
                    >
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        size={20}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
                            disabled ? "text-gray-400" : "text-gray-600"
                        }`}
                    />
                </button>

                {isOpen && !disabled && menuPosition && typeof document !== 'undefined' && createPortal(
                    <div 
                        ref={menuRef}
                        className="fixed bg-white border-2 border-gray-200 rounded-3xl shadow-lg overflow-hidden z-[10000] sheet-scrollable"
                        style={{
                            top: `${menuPosition.top}px`,
                            left: `${menuPosition.left}px`,
                            width: `${menuPosition.width}px`,
                            maxHeight: '280px',
                            overflowY: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            transform: 'translateZ(0)', // Force hardware acceleration and prevent subpixel rendering issues
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-6 py-4 text-left transition-colors duration-200 font-medium
                  ${
                      option.value === value
                          ? "bg-[#5E57AC] text-white"
                          : "hover:bg-gray-100 text-gray-800"
                  }
                `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
            </div>

            {error && <p className="mt-2 text-sm text-red-600 px-2">{error}</p>}
        </div>
    );
};

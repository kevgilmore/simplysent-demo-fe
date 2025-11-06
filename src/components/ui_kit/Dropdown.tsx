import React, { useState, useRef, useEffect } from "react";
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
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

                {isOpen && !disabled && (
                    <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-3xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
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
                    </div>
                )}
            </div>

            {error && <p className="mt-2 text-sm text-red-600 px-2">{error}</p>}
        </div>
    );
};

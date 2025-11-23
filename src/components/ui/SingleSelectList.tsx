import React from "react";
import { Check } from "lucide-react";

interface SingleSelectListProps {
    label?: string;
    options: { value: string; label: string; emoji?: string }[];
    selectedValue: string;
    onChange: (value: string) => void;
    className?: string;
}

export const SingleSelectList: React.FC<SingleSelectListProps> = ({
    label,
    options,
    selectedValue,
    onChange,
    className = "",
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-3 whitespace-nowrap">
                    {label}
                </label>
            )}
            <div className="flex flex-col gap-2.5 pb-1">
                {options.map((option) => {
                    const isSelected = selectedValue === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={`w-full px-6 py-4 rounded-full text-base font-medium transition-all duration-200 flex items-center justify-between
                                ${
                                    isSelected
                                        ? "bg-[#5E57AC] text-white border-2 border-[#5E57AC]"
                                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                {option.emoji && (
                                    <span className="text-2xl">
                                        {option.emoji}
                                    </span>
                                )}
                                <span>{option.label}</span>
                            </div>
                            {isSelected && (
                                <Check
                                    size={20}
                                    className="text-white flex-shrink-0"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


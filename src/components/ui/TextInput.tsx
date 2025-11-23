import React from "react";

interface TextInputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    type?: "text" | "email" | "password" | "number";
    error?: string;
    disabled?: boolean;
    className?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    inputMode?: "text" | "numeric" | "decimal" | "email" | "tel" | "url" | "search";
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    placeholder = "",
    value,
    onChange,
    type = "text",
    error,
    disabled = false,
    className = "",
    onKeyDown,
    inputMode,
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={inputMode}
        className={`w-full px-6 py-4 rounded-full border-2 transition-all duration-200 font-medium text-gray-900
          ${error
            ? 'border-red-500 focus:border-red-600'
            : 'border-gray-200 focus:border-[#5E57AC]'
          }
          ${
              disabled
                  ? "bg-gray-100 cursor-not-allowed text-gray-500"
                  : "bg-white hover:border-gray-300"
          }
          focus:outline-none focus:ring-4 focus:ring-[#5E57AC]/20
          placeholder:text-gray-400
        `}
            />
            {error && <p className="mt-2 text-sm text-red-600 px-2">{error}</p>}
        </div>
    );
};

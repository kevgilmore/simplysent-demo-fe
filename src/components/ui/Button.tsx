import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "cta";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    size = "medium",
    disabled = false,
    fullWidth = false,
    className = "",
    type = "button",
}) => {
    const baseStyles =
        "font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation relative overflow-hidden";

    const variantStyles = {
        primary:
            "bg-[#5E57AC] text-white hover:bg-[#4e47a0] active:bg-[#463f8f] active:opacity-95 focus:ring-[#5E57AC]/30 shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] active:shadow-[0_8px_30px_rgba(0,0,0,0.2)] disabled:hover:bg-[#5E57AC]",
        secondary:
            "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-300 active:opacity-95 focus:ring-gray-300/50 disabled:hover:bg-gray-200",
        outline:
            "bg-transparent border-2 border-[#5E57AC] text-[#5E57AC] hover:bg-[#5E57AC] hover:text-white active:bg-[#5E57AC] active:text-white active:opacity-95 focus:ring-[#5E57AC]/30 disabled:hover:bg-transparent disabled:hover:text-[#5E57AC]",
        ghost: "bg-transparent text-[#5E57AC] hover:bg-[#5E57AC]/10 active:bg-[#5E57AC]/20 active:opacity-95 focus:ring-[#5E57AC]/20 disabled:hover:bg-transparent",
        cta: "bg-gradient-to-r from-[#4A4490] via-[#5E57AC] to-[#7C6FBE] bg-[length:200%_auto] text-white font-bold shadow-[0_8px_16px_-4px_rgba(94,87,172,0.3),0_4px_8px_-2px_rgba(94,87,172,0.2)] hover:shadow-[0_12px_24px_-4px_rgba(94,87,172,0.4),0_6px_12px_-2px_rgba(94,87,172,0.3)] focus:ring-[#5E57AC]/40 animate-gradient-slide before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-[1500ms] disabled:animate-none disabled:opacity-60",
    };

    const sizeStyles = {
        small: "px-5 py-2 text-sm",
        medium: "px-7 py-3.5 text-base",
        large: "px-9 py-4 text-lg",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    const scaleStyles =
        !disabled && variant !== "cta"
            ? "hover:scale-105 active:scale-95"
            : !disabled && variant === "cta"
              ? "hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
              : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${scaleStyles} ${className}`}
        >
            <span className="relative z-10">{children}</span>
        </button>
    );
};

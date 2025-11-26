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
            "bg-[#5E57AC] text-white hover:bg-[#4e47a0] active:bg-[#463f8f] active:opacity-95 focus:ring-[#5E57AC]/30 disabled:hover:bg-[#5E57AC]",
        secondary:
            "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-300 active:opacity-95 focus:ring-gray-300/50 disabled:hover:bg-gray-200",
        outline:
            "bg-transparent border-2 border-gray-300 text-[#5E57AC] hover:bg-[#5E57AC] hover:text-white hover:border-[#5E57AC] active:bg-[#5E57AC] active:text-white active:border-[#5E57AC] active:opacity-95 focus:ring-[#5E57AC]/30 disabled:hover:bg-transparent disabled:hover:text-[#5E57AC] disabled:hover:border-gray-300",
        ghost: "bg-transparent text-[#5E57AC] hover:bg-[#5E57AC]/10 active:bg-[#5E57AC]/20 active:opacity-95 focus:ring-[#5E57AC]/20 disabled:hover:bg-transparent",
        cta: "bg-gradient-to-r from-[#4A4490] via-[#5E57AC] to-[#7C6FBE] bg-[length:200%_auto] text-white font-bold focus:ring-[#5E57AC]/40 animate-gradient-slide overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-[1500ms] disabled:animate-none disabled:opacity-60",
    };

    const sizeStyles = {
        small: "px-5 py-2 text-sm",
        medium: "px-7 py-3.5 text-base",
        large: "px-9 py-4 text-lg",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    // Removed scale hover effects to prevent clipping in containers
    // Use subtle opacity/shadow changes instead for better UX in constrained spaces
    const scaleStyles = "";

    // Remove any rounded classes from className prop to ensure rounded-full always applies
    const cleanClassName = className.replace(/\brounded-\w+\b/g, '').trim();
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${scaleStyles} ${cleanClassName} rounded-full`}
        >
            <span className="relative z-10">{children}</span>
        </button>
    );
};

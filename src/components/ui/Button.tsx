import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button'
}) => {
  const baseStyles = 'font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[#5E57AC] text-white hover:bg-[#4e47a0] focus:ring-[#5E57AC]/30 shadow-md hover:shadow-lg disabled:hover:bg-[#5E57AC]',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300/50 disabled:hover:bg-gray-200',
    outline: 'bg-transparent border-2 border-[#5E57AC] text-[#5E57AC] hover:bg-[#5E57AC] hover:text-white focus:ring-[#5E57AC]/30 disabled:hover:bg-transparent disabled:hover:text-[#5E57AC]',
    ghost: 'bg-transparent text-[#5E57AC] hover:bg-[#5E57AC]/10 focus:ring-[#5E57AC]/20 disabled:hover:bg-transparent'
  };

  const sizeStyles = {
    small: 'px-5 py-2 text-sm',
    medium: 'px-7 py-3.5 text-base',
    large: 'px-9 py-4 text-lg'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className} ${
        !disabled ? 'hover:scale-105 active:scale-95' : ''
      }`}
    >
      {children}
    </button>
  );
};

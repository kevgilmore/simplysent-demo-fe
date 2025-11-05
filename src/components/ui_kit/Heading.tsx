import React from 'react';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ level = 1, children, className = '' }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const baseStyles = 'font-heading text-gray-800';

  const sizeStyles = {
    1: 'text-4xl md:text-5xl font-bold',
    2: 'text-3xl md:text-4xl font-bold',
    3: 'text-2xl md:text-3xl font-semibold',
    4: 'text-xl md:text-2xl font-semibold',
    5: 'text-lg md:text-xl font-medium',
    6: 'text-base md:text-lg font-medium',
  };

  return (
    <Tag className={`${baseStyles} ${sizeStyles[level]} ${className}`}>
      {children}
    </Tag>
  );
};

import React, { useState } from 'react';
import { StarIcon } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function StarRating({ value, onChange, size = 'md', disabled = false }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleStarHover = (rating: number) => {
    if (!disabled) {
      setHoveredRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(0);
    }
  };

  return (
    <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoveredRating || value);
        const isHovered = star <= hoveredRating && hoveredRating > 0;
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={disabled}
            className={`${sizeClasses[size]} transition-colors duration-150 ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
            }`}
          >
            <StarIcon
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              } ${
                isHovered && !disabled
                  ? 'drop-shadow-sm'
                  : ''
              } transition-all duration-150`}
            />
          </button>
        );
      })}
    </div>
  );
}

import React, { useState, useRef, useEffect, useCallback } from "react";

interface RangeSliderProps {
    min: number;
    max: number;
    minValue: number;
    maxValue: number;
    onChange: (min: number, max: number) => void;
    label?: string;
    className?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
    min,
    max,
    minValue,
    maxValue,
    onChange,
    label,
    className = "",
}) => {
    const [isDraggingMin, setIsDraggingMin] = useState(false);
    const [isDraggingMax, setIsDraggingMax] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    const getPercentage = (value: number) => {
        return ((value - min) / (max - min)) * 100;
    };

    const getValueFromPosition = useCallback(
        (clientX: number) => {
            if (!sliderRef.current) return min;

            const rect = sliderRef.current.getBoundingClientRect();
            const percentage = Math.max(
                0,
                Math.min(1, (clientX - rect.left) / rect.width),
            );
            const value = Math.round(min + percentage * (max - min));
            return value;
        },
        [min, max],
    );

    const handleMouseDown = (type: "min" | "max") => {
        if (type === "min") {
            setIsDraggingMin(true);
        } else {
            setIsDraggingMax(true);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingMin || isDraggingMax) {
                e.preventDefault();
                const value = getValueFromPosition(e.clientX);

                if (isDraggingMin) {
                    const newMin = Math.min(value, maxValue - 1);
                    onChange(Math.max(min, newMin), maxValue);
                } else if (isDraggingMax) {
                    const newMax = Math.max(value, minValue + 1);
                    onChange(minValue, Math.min(max, newMax));
                }
            }
        };

        const handleMouseUp = () => {
            setIsDraggingMin(false);
            setIsDraggingMax(false);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDraggingMin || isDraggingMax) {
                e.preventDefault();
                const touch = e.touches[0];
                const value = getValueFromPosition(touch.clientX);

                if (isDraggingMin) {
                    const newMin = Math.min(value, maxValue - 1);
                    onChange(Math.max(min, newMin), maxValue);
                } else if (isDraggingMax) {
                    const newMax = Math.max(value, minValue + 1);
                    onChange(minValue, Math.min(max, newMax));
                }
            }
        };

        if (isDraggingMin || isDraggingMax) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("touchmove", handleTouchMove, {
                passive: false,
            });
            document.addEventListener("touchend", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleMouseUp);
        };
    }, [
        isDraggingMin,
        isDraggingMax,
        minValue,
        maxValue,
        min,
        max,
        onChange,
        getValueFromPosition,
    ]);

    const minPercentage = getPercentage(minValue);
    const maxPercentage = getPercentage(maxValue);

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-4">
                    {label}
                </label>
            )}

            <div className="px-2">
                {/* Value Display */}
                <div className="flex justify-between items-center mb-6">
                    <div className="bg-[#5E57AC] text-white px-5 py-2 rounded-full font-semibold">
                        ${minValue}
                    </div>
                    <span className="text-gray-500 font-medium">to</span>
                    <div className="bg-[#5E57AC] text-white px-5 py-2 rounded-full font-semibold">
                        ${maxValue}
                    </div>
                </div>

                {/* Slider Track */}
                <div className="relative" ref={sliderRef}>
                    {/* Background Track */}
                    <div className="h-3 bg-gray-200 rounded-full"></div>

                    {/* Active Range Track */}
                    <div
                        className="absolute top-0 h-3 bg-[#5E57AC] rounded-full"
                        style={{
                            left: `${minPercentage}%`,
                            right: `${100 - maxPercentage}%`,
                        }}
                    ></div>

                    {/* Min Handle */}
                    <button
                        type="button"
                        className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-4 border-[#5E57AC] rounded-full cursor-grab active:cursor-grabbing hover:scale-110 transition-transform shadow-lg focus:outline-none focus:ring-4 focus:ring-[#5E57AC]/30"
                        style={{
                            left: `calc(${minPercentage}% - 14px)`,
                        }}
                        onMouseDown={() => handleMouseDown("min")}
                        onTouchStart={() => handleMouseDown("min")}
                        aria-label={`Minimum value: $${minValue}`}
                    >
                        <span className="sr-only">Min: ${minValue}</span>
                    </button>

                    {/* Max Handle */}
                    <button
                        type="button"
                        className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-4 border-[#5E57AC] rounded-full cursor-grab active:cursor-grabbing hover:scale-110 transition-transform shadow-lg focus:outline-none focus:ring-4 focus:ring-[#5E57AC]/30"
                        style={{
                            left: `calc(${maxPercentage}% - 14px)`,
                        }}
                        onMouseDown={() => handleMouseDown("max")}
                        onTouchStart={() => handleMouseDown("max")}
                        aria-label={`Maximum value: $${maxValue}`}
                    >
                        <span className="sr-only">Max: ${maxValue}</span>
                    </button>
                </div>

                {/* Min/Max Labels */}
                <div className="flex justify-between items-center mt-3 px-1">
                    <span className="text-sm text-gray-500 font-medium">
                        ${min}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                        ${max}
                    </span>
                </div>
            </div>
        </div>
    );
};

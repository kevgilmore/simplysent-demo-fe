import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Heart } from "lucide-react";

interface ProductCardProps {
    image: string;
    name: string;
    price: number;
    className?: string;
    badge?: React.ReactNode;
    isFavorite?: boolean;
    onFavoriteToggle?: () => void;
    hideActions?: boolean;
    compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    image,
    name,
    price,
    className = "",
    badge,
    isFavorite,
    onFavoriteToggle,
    hideActions = false,
    compact = false,
}) => {
    const [isGood, setIsGood] = useState(false);
    const [isBad, setIsBad] = useState(false);
    const [isFavoriteInternal, setIsFavoriteInternal] = useState(false);

    const handleGoodClick = () => {
        setIsGood(!isGood);
        if (isBad) setIsBad(false);
    };

    const handleBadClick = () => {
        setIsBad(!isBad);
        if (isGood) setIsGood(false);
    };

    const favoriteActive =
        typeof isFavorite === "boolean" ? isFavorite : isFavoriteInternal;

    const handleFavoriteClick = () => {
        if (onFavoriteToggle) {
            onFavoriteToggle();
        } else {
            setIsFavoriteInternal(!favoriteActive);
        }
    };

    const truncateName = (text: string, maxLength = 20) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    return (
        <div
            className={`bg-white rounded-3xl overflow-hidden relative flex flex-col ${className} ${
                compact ? "shadow-md" : "shadow-lg"
            }`}
            style={compact ? { aspectRatio: "10 / 16" } : undefined}
        >
            {badge && <div className="absolute top-3 left-3 z-10">{badge}</div>}
            {/* Favorite Button - Top Right */}
            <button
                onClick={handleFavoriteClick}
                className={`absolute z-10 bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110 ${
                    compact ? "top-2 right-2 p-2.5" : "top-4 right-4 p-3"
                }`}
                aria-label="Add to favorites"
            >
                <Heart
                    size={compact ? 22 : 20}
                    className={`transition-colors duration-200 ${
                        favoriteActive
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                    }`}
                />
            </button>

            {/* Product Image */}
            <div
                className="w-full bg-gray-100 overflow-hidden flex-shrink-0"
                style={
                    compact
                        ? { aspectRatio: "10 / 10" }
                        : { aspectRatio: "1 / 1" }
                }
            >
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Product Info */}
            <div
                className={`flex flex-col flex-grow ${compact ? "p-3" : "p-5"}`}
            >
                <h3
                    className={`font-semibold text-gray-800 mb-1 ${
                        compact
                            ? "text-base leading-tight line-clamp-2"
                            : "text-lg mb-2"
                    }`}
                    title={name}
                    style={compact ? { minHeight: "40px" } : undefined}
                >
                    {compact ? name : truncateName(name, 20)}
                </h3>
                <p
                    className={`font-bold text-[#5E57AC] ${
                        compact ? "text-xl mb-auto" : "text-2xl"
                    }`}
                >
                    £{price.toFixed(2)}
                </p>

                {/* Action Buttons */}
                {!hideActions && (
                    <div
                        className={`flex gap-2 ${compact ? "mt-3" : "gap-3 mt-4"}`}
                    >
                        <button
                            onClick={handleGoodClick}
                            className={`flex-1 flex items-center justify-center rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                                compact ? "gap-1 py-3 px-2" : "gap-2 py-3 px-5"
                            } ${
                                isGood
                                    ? "bg-green-200 text-green-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            aria-label="Mark as good"
                        >
                            <ThumbsUp
                                size={compact ? 22 : 18}
                                className={isGood ? "fill-green-800" : ""}
                            />
                            {!compact && <span className="text-sm">Good</span>}
                        </button>

                        <button
                            onClick={handleBadClick}
                            className={`flex-1 flex items-center justify-center rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                                compact ? "gap-1 py-3 px-2" : "gap-2 py-3 px-5"
                            } ${
                                isBad
                                    ? "bg-red-200 text-red-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            aria-label="Mark as bad"
                        >
                            <ThumbsDown
                                size={compact ? 22 : 18}
                                className={isBad ? "fill-red-800" : ""}
                            />
                            {!compact && <span className="text-sm">Bad</span>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

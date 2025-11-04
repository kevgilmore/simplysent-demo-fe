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
            className={`bg-white rounded-3xl shadow-lg overflow-hidden relative ${className}`}
        >
            {badge && <div className="absolute top-3 left-3 z-10">{badge}</div>}
            {/* Favorite Button - Top Right */}
            <button
                onClick={handleFavoriteClick}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-3 shadow-md transition-all duration-200 hover:scale-110"
                aria-label="Add to favorites"
            >
                <Heart
                    size={20}
                    className={`transition-colors duration-200 ${
                        favoriteActive
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                    }`}
                />
            </button>

            {/* Product Image */}
            <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Product Info */}
            <div className="p-5">
                <h3
                    className="text-lg font-semibold text-gray-800 mb-2"
                    title={name}
                >
                    {truncateName(name)}
                </h3>
                <p className="text-2xl font-bold text-[#5E57AC]">
                    £{price.toFixed(2)}
                </p>

                {/* Action Buttons */}
                {!hideActions && (
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleGoodClick}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                                isGood
                                    ? "bg-[#5E57AC] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            aria-label="Mark as good"
                        >
                            <ThumbsUp
                                size={18}
                                className={isGood ? "fill-white" : ""}
                            />
                            <span className="text-sm">Good</span>
                        </button>

                        <button
                            onClick={handleBadClick}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                                isBad
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            aria-label="Mark as bad"
                        >
                            <ThumbsDown
                                size={18}
                                className={isBad ? "fill-white" : ""}
                            />
                            <span className="text-sm">Bad</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

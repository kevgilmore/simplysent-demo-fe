import React, { useState } from "react";
import { ThumbsDown, Heart, Star } from "lucide-react";

interface ProductCardProps {
    id?: string;
    image: string;
    name: string;
    price: number;
    className?: string;
    badge?: React.ReactNode;
    isFavorite?: boolean;
    onFavoriteToggle?: () => void;
    hideActions?: boolean;
    compact?: boolean;
    onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    image,
    name,
    price,
    className = "",
    badge,
    isFavorite,
    onFavoriteToggle,
    hideActions = false,
    compact = false,
    onClick,
}) => {
    const [isBad, setIsBad] = useState(false);
    const [isFavoriteInternal, setIsFavoriteInternal] = useState(false);

    const handleBadClick = () => {
        setIsBad(!isBad);
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
                compact
                    ? "shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                    : "shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
            } ${onClick ? "cursor-pointer hover:shadow-[0_15px_50px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1" : ""}`}
            style={compact ? { aspectRatio: "10 / 13.5" } : undefined}
            onClick={onClick}
        >
            {badge && <div className="absolute top-3 left-3 z-10">{badge}</div>}

            {/* Product Image */}
            <div
                className="w-full bg-gray-100 overflow-hidden flex-shrink-0"
                style={
                    compact
                        ? { aspectRatio: "10 / 8.5" }
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
                className={`flex flex-col flex-grow font-['Stack_Sans'] ${compact ? "px-5 py-3 pb-2.5" : "px-7 py-5 pb-4"}`}
            >
                <h3
                    className={`font-['Stack_Sans'] font-semibold text-gray-600 mb-1 ${
                        compact
                            ? "text-base leading-tight line-clamp-2"
                            : "text-lg mb-2"
                    }`}
                    style={
                        compact
                            ? { minHeight: "40px", fontWeight: 600 }
                            : { fontWeight: 600 }
                    }
                    title={name}
                >
                    {compact ? name : truncateName(name, 20)}
                </h3>

                {/* Star Rating */}
                <div className="flex items-center gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={compact ? 12 : 14}
                            className="fill-amber-400 text-amber-400"
                        />
                    ))}
                </div>

                {/* Bottom Row: Price, Thumbs Down, Favorites */}
                {!hideActions && (
                    <div className="flex items-center justify-between gap-2 mt-1">
                        <p
                            className={`font-light text-[#816fe8] ${
                                compact ? "text-lg" : "text-xl"
                            }`}
                        >
                            £{price.toFixed(2)}
                        </p>

                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleBadClick();
                                }}
                                className={`flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 ${
                                    compact ? "p-3" : "p-3.5"
                                } ${
                                    isBad
                                        ? "bg-red-200 text-red-800"
                                        : "bg-gray-100 text-[#816fe8] hover:bg-gray-200"
                                }`}
                                aria-label="Mark as bad"
                            >
                                <ThumbsDown
                                    size={compact ? 16 : 18}
                                    className={isBad ? "fill-red-800" : ""}
                                />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFavoriteClick();
                                }}
                                className={`flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 ${
                                    compact ? "p-3" : "p-3.5"
                                } ${
                                    favoriteActive
                                        ? "bg-purple-100"
                                        : "bg-gray-100 hover:bg-gray-200"
                                }`}
                                aria-label="Add to favorites"
                            >
                                <Heart
                                    size={compact ? 16 : 18}
                                    className={`transition-colors duration-200 ${
                                        favoriteActive
                                            ? "fill-[#816fe8] text-[#816fe8]"
                                            : "text-[#816fe8]"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

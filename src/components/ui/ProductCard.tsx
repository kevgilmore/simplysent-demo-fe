import React, { useState, useEffect } from "react";
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
    onRemove?: (id: string) => void;
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
    onRemove,
    hideActions = false,
    compact = false,
    onClick,
}) => {
    const [isBad, setIsBad] = useState(false);
    const [isFavoriteInternal, setIsFavoriteInternal] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const handleBadClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isBad) {
            setIsRemoving(true);
        } else {
            setIsBad(!isBad);
        }
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

    useEffect(() => {
        if (isRemoving && onRemove && id) {
            const timer = setTimeout(() => {
                onRemove(id);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isRemoving, onRemove, id]);

    return (
        <div
            className={`relative transition-all ${isRemoving ? "duration-1000 w-0 min-w-0 opacity-0 scale-75 -ml-[260px]" : "duration-300 w-[260px] min-w-[260px] opacity-100 scale-100 ml-0"}`}
        >
            {/* Product Image - Hanging above card */}
            <div className="w-full overflow-hidden flex-shrink-0 relative z-10 px-4 pt-0">
                <div
                    className="w-full rounded-2xl overflow-hidden"
                    style={
                        compact
                            ? { aspectRatio: "10 / 8.5" }
                            : { aspectRatio: "1 / 1" }
                    }
                >
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-contain scale-110"
                    />
                </div>
            </div>

            <div
                className={`bg-white rounded-3xl relative flex flex-col ${className} ${
                    compact
                        ? "shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                        : "shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                } ${onClick ? "cursor-pointer hover:shadow-[0_15px_50px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:-translate-y-1" : ""}`}
                onClick={onClick}
                style={{ marginTop: "-50%", minHeight: "200px" }}
            >
                {badge && (
                    <div className="absolute top-3 left-3 z-10">{badge}</div>
                )}

                {/* Product Info */}
                <div
                    className={`flex flex-col flex-grow font-['Stack_Sans'] ${compact ? "px-6 pt-[55%] pb-4" : "px-8 pt-[60%] pb-5"}`}
                >
                    <h3
                        className={`font-['Stack_Sans'] font-semibold text-gray-600 mb-2 ${
                            compact
                                ? "text-base leading-tight line-clamp-2"
                                : "text-xl mb-2"
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
                    <div className="flex items-center gap-0.5 mb-2">
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
                        <div className="flex items-center justify-between gap-2 mt-2">
                            <p
                                className={`font-light text-[#816fe8] ${
                                    compact ? "text-xl" : "text-2xl"
                                }`}
                            >
                                £{price.toFixed(2)}
                            </p>

                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={handleBadClick}
                                    className={`flex items-center justify-center rounded-xl transition-colors duration-200 hover:scale-110 focus:outline-none ${
                                        compact ? "p-3" : "p-3.5"
                                    } ${
                                        isBad
                                            ? "bg-red-200 text-red-800"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                                    className={`flex items-center justify-center rounded-xl transition-colors duration-200 hover:scale-110 focus:outline-none ${
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
        </div>
    );
};

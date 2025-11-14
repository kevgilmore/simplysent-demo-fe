import React, { useState, useEffect } from "react";
import { ThumbsDown, ThumbsUp, Star, Heart } from "lucide-react";

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
    favouritesVariant?: boolean;
    onClick?: () => void;
    isSpecial?: boolean;
    textColor?: string;
    priceColor?: string;
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
    favouritesVariant = false,
    onClick,
    isSpecial = false,
    textColor,
    priceColor,
}) => {
    const [isBad, setIsBad] = useState(false);
    const [isThumbsUp, setIsThumbsUp] = useState(false);
    const [isFavoriteInternal, setIsFavoriteInternal] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const handleBadClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isBad) {
            setIsRemoving(true);
            setIsThumbsUp(false);
        } else {
            setIsBad(!isBad);
        }
    };

    const handleThumbsUpClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsThumbsUp(!isThumbsUp);
        if (isBad) {
            setIsBad(false);
            setIsRemoving(false);
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
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isRemoving, onRemove, id]);

    const cardWidth = favouritesVariant ? "175px" : "260px";
    const cardMinHeight = favouritesVariant ? "240px" : "180px";

    return (
        <div
            className={`relative transition-all ${isRemoving ? "duration-700 w-0 min-w-0 opacity-0 scale-75" : "duration-300 opacity-100 scale-100"}`}
            style={
                isRemoving
                    ? {
                          transform: "translateY(-100px)",
                          transition: "all 700ms ease-out",
                          marginLeft: favouritesVariant ? "-175px" : "-260px",
                      }
                    : {
                          width: cardWidth,
                          minWidth: cardWidth,
                          marginLeft: favouritesVariant ? "0" : "0",
                      }
            }
        >
            {favouritesVariant ? (
                // Favourites variant: image inside card
                <div
                    className={`bg-white rounded-3xl relative flex flex-col ${className} shadow-[0_4px_20px_rgba(0,0,0,0.06)] ${onClick ? "cursor-pointer transition-all duration-300 hover:-translate-y-1" : ""}`}
                    onClick={onClick}
                    style={{ minHeight: cardMinHeight }}
                >
                    {/* Product Image - Inside card */}
                    <div className="w-full flex-shrink-0 relative pt-3 px-3">
                        <div
                            className="w-full rounded-xl overflow-hidden"
                            style={{ aspectRatio: "1 / 1" }}
                        >
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                    {badge && (
                        <div className="absolute top-3 left-3 z-10">{badge}</div>
                    )}

                    {/* Product Info */}
                    <div className="flex flex-col flex-grow font-['Stack_Sans'] px-3 pb-3 pt-2">
                        <h3
                            className="font-['Stack_Sans'] font-semibold text-gray-600 mb-1 text-sm leading-tight truncate"
                            style={{ minHeight: "32px", fontWeight: 600 }}
                            title={name}
                        >
                            {truncateName(name, 18)}
                        </h3>

                        {/* Price - Always shown for favourites */}
                        <div className="flex items-center justify-between">
                            <p className="font-light text-[#816fe8] text-base">
                                £{price.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                // Regular variant: image hanging above card
                <>
                    {/* Product Image - Hanging above card */}
                    <div className="w-full overflow-visible flex-shrink-0 relative z-10 px-4 pt-0">
                        <div
                            className="w-full rounded-2xl overflow-visible"
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
                        } ${onClick ? "cursor-pointer transition-all duration-300 hover:-translate-y-1" : ""}`}
                        onClick={onClick}
                        style={{ marginTop: "-50%", minHeight: cardMinHeight }}
                    >
                        {badge && (
                            <div className="absolute top-3 left-3 z-10">{badge}</div>
                        )}

                        {/* Product Info */}
                        <div
                            className={`flex flex-col flex-grow font-['Stack_Sans'] ${
                                compact
                                    ? "px-5 pt-[58%] pb-3"
                                    : "px-7 pt-[63%] pb-4"
                            }`}
                        >
                            <h3
                                className={`font-['Stack_Sans'] font-semibold text-gray-600 mb-0 truncate ${
                                    compact ? "text-base leading-tight" : "text-xl mb-0"
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
                            <div className="flex items-center gap-0.5 mb-1 -mt-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={compact ? 12 : 14}
                                        className="fill-amber-400 text-amber-400"
                                    />
                                ))}
                            </div>

                            {/* Bottom Row: Price, Thumbs Up, Thumbs Down */}
                            {!hideActions && (
                                <div className="flex items-end justify-between gap-2 -mt-3 mb-2">
                                    <p
                                        className={`font-light text-[#816fe8] ${
                                            compact ? "text-lg" : "text-xl"
                                        }`}
                                    >
                                        £{price.toFixed(2)}
                                    </p>

                                    <div className="flex items-center gap-4 -ml-3">
                                        <button
                                            onClick={handleThumbsUpClick}
                                            className={`flex items-center justify-center rounded-2xl transition-colors duration-200 hover:scale-110 focus:outline-none shadow-[0_4px_12px_rgba(100,100,100,0.15)] ${
                                                compact ? "p-3" : "p-3.5"
                                            } ${
                                                isThumbsUp
                                                    ? "bg-simplysent-purple text-white"
                                                    : "bg-white text-simplysent-purple hover:bg-gray-50"
                                            }`}
                                            aria-label="Thumbs up"
                                        >
                                            <ThumbsUp
                                                size={compact ? 16 : 18}
                                                className="fill-current"
                                            />
                                        </button>

                                        <button
                                            onClick={handleBadClick}
                                            className={`flex items-center justify-center rounded-2xl transition-colors duration-200 hover:scale-110 focus:outline-none shadow-[0_4px_12px_rgba(100,100,100,0.15)] ${
                                                compact ? "p-3" : "p-3.5"
                                            } ${
                                                isBad
                                                    ? "bg-simplysent-purple text-white"
                                                    : "bg-white text-simplysent-purple hover:bg-gray-50"
                                            }`}
                                            aria-label="Thumbs down"
                                        >
                                            <ThumbsDown
                                                size={compact ? 16 : 18}
                                                className="fill-current"
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

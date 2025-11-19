import React, { useState, useEffect } from "react";
import { ThumbsDown, ThumbsUp, Star, Heart } from "lucide-react";

interface ProductCardProps {
    id?: string;
    image: string;
    name: string;
    price: number;
    rating?: number;
    numRatings?: number;
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
    isAiPick?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    image,
    name,
    price,
    rating,
    numRatings,
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
    isAiPick = false,
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
                    className={`bg-white rounded-3xl relative flex flex-col ${className} shadow-[0_4px_20px_rgba(0,0,0,0.06)] ${onClick ? "cursor-pointer" : ""}`}
                    onClick={onClick}
                    style={{ minHeight: cardMinHeight }}
                >
                    {/* Product Image - Inside card */}
                    <div 
                        className="w-full flex-shrink-0 relative pt-3 px-3"
                        onClick={onClick}
                        style={{ cursor: onClick ? "pointer" : "default" }}
                    >
                        <div
                            className="w-full rounded-xl overflow-hidden"
                            style={{ aspectRatio: "1 / 1" }}
                        >
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-contain"
                                style={{ pointerEvents: "none" }}
                            />
                        </div>
                    </div>
                    {badge && (
                        <div className="absolute top-3 left-3 z-10">{badge}</div>
                    )}

                    {/* Product Info */}
                    <div className="flex flex-col flex-grow font-['Stack_Sans'] px-3 pb-3 pt-2">
                        <h3
                            className="font-['Stack_Sans'] font-semibold text-gray-600 mb-0 text-sm leading-tight truncate pl-0.5"
                            style={{ minHeight: "32px", fontWeight: 600 }}
                            title={name}
                        >
                            {truncateName(name, 18)}
                        </h3>

                        {/* Price - Always shown for favourites */}
                        <div className="flex items-center justify-between -mt-2 pl-0.5">
                            <p className="font-normal text-[#816fe8] text-base">
                                £{price.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                // Regular variant: image hanging above card
                <>
                    {/* Product Image - Hanging above card */}
                    <div 
                        className="w-full overflow-visible flex-shrink-0 relative z-10 px-4 pt-0"
                        onClick={onClick}
                        style={{ cursor: onClick ? "pointer" : "default" }}
                    >
                        <div
                            className="w-full rounded-2xl overflow-visible relative"
                            style={
                                compact
                                    ? { aspectRatio: "10 / 8.5" }
                                    : { aspectRatio: "1 / 1" }
                            }
                        >
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-contain scale-110 relative z-10"
                                style={{ pointerEvents: "none" }}
                            />
                            {isAiPick && (
                                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-10">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            maskImage: `url(${image})`,
                                            WebkitMaskImage: `url(${image})`,
                                            maskSize: "contain",
                                            WebkitMaskSize: "contain",
                                            maskRepeat: "no-repeat",
                                            WebkitMaskRepeat: "no-repeat",
                                            maskPosition: "center",
                                            WebkitMaskPosition: "center",
                                            background: "linear-gradient(105deg, transparent 0%, transparent 30%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0.7) 55%, transparent 70%, transparent 100%)",
                                            backgroundSize: "200% 200%",
                                            width: "200%",
                                            height: "200%",
                                            left: "-50%",
                                            top: "-50%",
                                            animation: "shimmer-shine 3s ease-in-out infinite",
                                            mixBlendMode: "screen",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className={`${isAiPick ? "bg-gradient-to-br from-purple-50/50 via-white to-purple-100/30" : "bg-white"} rounded-3xl relative flex flex-col overflow-hidden ${className} ${
                            compact
                                ? isAiPick ? "" : "shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                                : isAiPick ? "" : "shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                        } ${onClick ? "cursor-pointer" : ""} ${isAiPick ? (compact ? "animate-purple-glow" : "animate-purple-glow-large") : ""}`}
                        onClick={onClick}
                        style={{ marginTop: "-50%", minHeight: cardMinHeight }}
                    >
                        {isAiPick && (
                            <>
                                {/* Base radial glow */}
                                <div
                                    className="absolute inset-0 pointer-events-none rounded-3xl"
                                    style={{
                                        background: "radial-gradient(circle at center, rgba(122, 117, 186, 0.25) 0%, rgba(95, 89, 166, 0.15) 40%, rgba(122, 117, 186, 0.08) 70%, transparent 100%)",
                                        animation: "purple-inner-glow 3s ease-in-out infinite",
                                        zIndex: 1,
                                    }}
                                />
                                {/* Secondary shimmer overlay */}
                                <div
                                    className="absolute inset-0 pointer-events-none rounded-3xl"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(122, 117, 186, 0.1) 0%, transparent 50%, rgba(95, 89, 166, 0.1) 100%)",
                                        animation: "purple-shimmer-overlay 4s ease-in-out infinite",
                                        zIndex: 1,
                                    }}
                                />
                                {/* Subtle border accent */}
                                <div
                                    className="absolute inset-0 pointer-events-none rounded-3xl"
                                    style={{
                                        border: "1px solid",
                                        borderColor: "rgba(122, 117, 186, 0.2)",
                                        zIndex: 1,
                                    }}
                                />
                            </>
                        )}
                        {badge && (
                            <div className="absolute top-3 left-3 z-10">{badge}</div>
                        )}

                        {/* Product Info */}
                        <div
                            className={`flex flex-col flex-grow font-['Stack_Sans'] relative z-10 ${
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
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const starRating = rating || 0;
                                    // Show filled stars based on rating (e.g., 4.5 = 4.5 filled stars)
                                    // If rating is undefined or 0, all stars will be unfilled (gray)
                                    const isFilled = star <= starRating;
                                    return (
                                        <Star
                                            key={star}
                                            size={compact ? 12 : 14}
                                            className={isFilled ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                                        />
                                    );
                                })}
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
                                            className="flex items-center justify-center rounded-2xl transition-colors duration-200 hover:scale-110 focus:outline-none shadow-[0_4px_12px_rgba(100,100,100,0.15)] bg-white hover:bg-gray-50"
                                            style={{ padding: compact ? "12px" : "14px" }}
                                            aria-label="Thumbs up"
                                        >
                                            <ThumbsUp
                                                size={compact ? 16 : 18}
                                                className={isThumbsUp ? "fill-simplysent-purple text-simplysent-purple" : "text-simplysent-purple"}
                                                fill={isThumbsUp ? "currentColor" : "none"}
                                            />
                                        </button>

                                        <button
                                            onClick={handleBadClick}
                                            className="flex items-center justify-center rounded-2xl transition-colors duration-200 hover:scale-110 focus:outline-none shadow-[0_4px_12px_rgba(100,100,100,0.15)] bg-white hover:bg-gray-50"
                                            style={{ padding: compact ? "12px" : "14px" }}
                                            aria-label="Thumbs down"
                                        >
                                            <ThumbsDown
                                                size={compact ? 16 : 18}
                                                className={isBad ? "fill-simplysent-purple text-simplysent-purple" : "text-simplysent-purple"}
                                                fill={isBad ? "currentColor" : "none"}
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

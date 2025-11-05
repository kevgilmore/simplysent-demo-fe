import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faStar,
    faMicrochip,
    faGolfBallTee,
    faUserPlus,
    faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { ProductCard } from "./ui_kit/ProductCard";
import { Button } from "./ui_kit/Button";
import { RangeSlider } from "./ui_kit/RangeSlider";
import { Drawer } from "./ui_kit/Drawer";
import { AddPersonPage } from "./AddPersonPage";

export const ImprovedCarouselResultsPage: React.FC = () => {
    const navigate = useNavigate();
    const [pageTab, setPageTab] = useState("gifts");
    const [favourites, setFavourites] = useState<Set<string>>(
        new Set(["ai-1", "tech-2"]),
    );
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [minBudget, setMinBudget] = useState(50);
    const [maxBudget, setMaxBudget] = useState(300);
    const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const interestOptions = [
        "Tech",
        "Golf",
        "Gaming",
        "Sports",
        "Reading",
        "Cooking",
        "Travel",
        "Music",
        "Fashion",
        "Art",
    ];

    type Product = { id: string; image: string; name: string; price: number };
    const productsByTab: Record<string, Product[]> = useMemo(
        () => ({
            "ai-picks": [
                {
                    id: "ai-1",
                    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
                    name: "Top-Rated Wireless Headphones",
                    price: 189.99,
                },
                {
                    id: "ai-2",
                    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
                    name: "Smart Home Starter Kit",
                    price: 139.99,
                },
                {
                    id: "ai-3",
                    image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800&auto=format&fit=crop",
                    name: "Cosy Deluxe Candle",
                    price: 18.99,
                },
                {
                    id: "ai-4",
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
                    name: "Premium Noise-Cancelling Earbuds",
                    price: 249.99,
                },
                {
                    id: "ai-5",
                    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
                    name: "Designer Watch Collection",
                    price: 299.99,
                },
            ],
            tech: [
                {
                    id: "tech-1",
                    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
                    name: "Wireless Headphones Pro Max",
                    price: 199.99,
                },
                {
                    id: "tech-2",
                    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
                    name: "Smart Home Hub",
                    price: 129.99,
                },
                {
                    id: "tech-3",
                    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
                    name: "Portable Bluetooth Speaker",
                    price: 59.99,
                },
                {
                    id: "tech-4",
                    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=800&auto=format&fit=crop",
                    name: "4K Action Camera",
                    price: 279.99,
                },
                {
                    id: "tech-5",
                    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
                    name: "Mechanical Gaming Keyboard",
                    price: 149.99,
                },
            ],
            golf: [
                {
                    id: "golf-1",
                    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop",
                    name: "Premium Golf Balls (12 pack)",
                    price: 34.99,
                },
                {
                    id: "golf-2",
                    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=800&auto=format&fit=crop",
                    name: "Golf Swing Trainer Aid",
                    price: 44.99,
                },
                {
                    id: "golf-3",
                    image: "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=800&auto=format&fit=crop",
                    name: "Golf Glove Leather",
                    price: 19.99,
                },
                {
                    id: "golf-4",
                    image: "https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=800&auto=format&fit=crop",
                    name: "Golf Club Set - Irons",
                    price: 499.99,
                },
                {
                    id: "golf-5",
                    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop",
                    name: "Golf Range Finder",
                    price: 189.99,
                },
            ],
        }),
        [],
    );

    const allProducts: Product[] = useMemo(() => {
        return Object.values(productsByTab).flat();
    }, [productsByTab]);

    const toggleFavourite = (productId: string) => {
        setFavourites((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) next.delete(productId);
            else next.add(productId);
            return next;
        });
    };

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest],
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="min-h-[100dvh] overscroll-contain bg-gradient-to-b from-gray-50 to-white">
            {/* Fixed translucent header with notch support */}
            <header
                className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
                style={{
                    paddingTop: "env(safe-area-inset-top)",
                    paddingLeft: "env(safe-area-inset-left)",
                    paddingRight: "env(safe-area-inset-right)",
                }}
            >
                <div className="px-4 py-3 flex justify-between items-center">
                    <img
                        src="/logo.png"
                        alt="SimplySent"
                        className="h-10 w-auto"
                    />

                    {/* Menu Icons */}
                    <div className="relative" ref={dropdownRef}>
                        <div className="inline-flex items-center gap-1 bg-white rounded-full border-2 border-gray-200 px-3 py-1.5 shadow-sm">
                            <button
                                type="button"
                                onClick={() => setIsAddPersonOpen(true)}
                                className="px-3 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                                aria-label="Add person"
                            >
                                <FontAwesomeIcon
                                    icon={faUserPlus}
                                    className="w-5 h-5 text-gray-700"
                                />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="px-3 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                                aria-label="Menu"
                            >
                                <FontAwesomeIcon
                                    icon={faEllipsisVertical}
                                    className="w-5 h-5 text-gray-700"
                                />
                            </button>
                        </div>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 bg-white rounded-2xl shadow-lg border-2 border-gray-200 z-50 p-2 min-w-[150px]">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        navigate("/new");
                                    }}
                                    className="block w-full px-4 py-2 rounded-lg font-semibold transition-colors text-left text-gray-700 hover:bg-gray-100"
                                >
                                    Dad
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        navigate("/new-mum");
                                    }}
                                    className="block w-full px-4 py-2 rounded-lg font-semibold transition-colors text-left text-gray-700 hover:bg-gray-100"
                                >
                                    Mum
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main content with safe top padding for header */}
            <div
                className="px-4 pb-[calc(env(safe-area-inset-bottom)_+_96px)]"
                style={{
                    paddingTop: "calc(env(safe-area-inset-top) + 90px)",
                    paddingLeft: "max(1rem, env(safe-area-inset-left))",
                    paddingRight: "max(1rem, env(safe-area-inset-right))",
                }}
            >
                <div className="max-w-7xl mx-auto">
                    {/* Carousels Section */}
                    {pageTab === "gifts" && (
                        <div className="space-y-12">
                            {/* AI Picks Carousel */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            className="text-white text-sm"
                                        />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        AI Picks
                                    </h2>
                                </div>
                                <div className="overflow-x-auto no-scrollbar">
                                    <div className="flex gap-3 pb-4">
                                        {productsByTab["ai-picks"]?.map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex-shrink-0 w-[280px]"
                                            >
                                                <ProductCard
                                                    image={p.image}
                                                    name={p.name}
                                                    price={p.price}
                                                    compact
                                                    className="border-2 border-purple-300 ring-1 ring-purple-200/60 hover:ring-purple-300/70 transition-shadow"
                                                    isFavorite={favourites.has(
                                                        p.id,
                                                    )}
                                                    onFavoriteToggle={() =>
                                                        toggleFavourite(p.id)
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tech Carousel */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                                        <FontAwesomeIcon
                                            icon={faMicrochip}
                                            className="text-white text-sm"
                                        />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Tech
                                    </h2>
                                </div>
                                <div className="overflow-x-auto no-scrollbar">
                                    <div className="flex gap-3 pb-4">
                                        {productsByTab["tech"]?.map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex-shrink-0 w-[280px]"
                                            >
                                                <ProductCard
                                                    image={p.image}
                                                    name={p.name}
                                                    price={p.price}
                                                    compact
                                                    isFavorite={favourites.has(
                                                        p.id,
                                                    )}
                                                    onFavoriteToggle={() =>
                                                        toggleFavourite(p.id)
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Golf Carousel */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
                                        <FontAwesomeIcon
                                            icon={faGolfBallTee}
                                            className="text-white text-sm"
                                        />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Golf
                                    </h2>
                                </div>
                                <div className="overflow-x-auto no-scrollbar">
                                    <div className="flex gap-3 pb-4">
                                        {productsByTab["golf"]?.map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex-shrink-0 w-[280px]"
                                            >
                                                <ProductCard
                                                    image={p.image}
                                                    name={p.name}
                                                    price={p.price}
                                                    compact
                                                    isFavorite={favourites.has(
                                                        p.id,
                                                    )}
                                                    onFavoriteToggle={() =>
                                                        toggleFavourite(p.id)
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {pageTab === "gifts" && (
                        <div className="mt-8">
                            <Button
                                fullWidth
                                variant="primary"
                                size="large"
                                onClick={() => setIsOptionsOpen(true)}
                            >
                                Refine
                            </Button>
                        </div>
                    )}

                    {pageTab === "favourites" && (
                        <div>
                            {Array.from(favourites).length === 0 ? (
                                <p className="text-center text-gray-600">
                                    No favourites yet. Tap the heart on any
                                    product to add it here.
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                    {allProducts
                                        .filter((p) => favourites.has(p.id))
                                        .map((p) => (
                                            <ProductCard
                                                key={p.id}
                                                image={p.image}
                                                name={p.name}
                                                price={p.price}
                                                isFavorite={true}
                                                onFavoriteToggle={() =>
                                                    toggleFavourite(p.id)
                                                }
                                                hideActions={true}
                                            />
                                        ))}
                                </div>
                            )}
                        </div>
                    )}

                    {pageTab === "share" && (
                        <div className="mt-6 flex flex-col items-center">
                            <div className="w-full max-w-xl flex items-center gap-3 bg-white rounded-xl border-2 border-gray-200 p-3">
                                <input
                                    value="https://simplysent.co/1234"
                                    readOnly
                                    className="flex-1 bg-transparent outline-none text-gray-800"
                                />
                                <Button
                                    size="small"
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            "https://simplysent.co/1234",
                                        )
                                    }
                                    variant="secondary"
                                >
                                    Copy
                                </Button>
                            </div>
                            <p className="text-gray-500 text-sm mt-2">
                                Share this link with friends and family
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Refine Drawer */}
            <Drawer
                open={isOptionsOpen}
                onOpenChange={setIsOptionsOpen}
                height="85vh"
            >
                <div className="space-y-8">
                    {/* Interests Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Interests
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {interestOptions.map((interest) => (
                                <button
                                    key={interest}
                                    onClick={() => toggleInterest(interest)}
                                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                                        selectedInterests.includes(interest)
                                            ? "bg-[#5E57AC] text-white shadow-md scale-105"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Budget Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Budget
                        </h3>
                        <RangeSlider
                            min={10}
                            max={500}
                            minValue={minBudget}
                            maxValue={maxBudget}
                            onChange={(min, max) => {
                                setMinBudget(min);
                                setMaxBudget(max);
                            }}
                        />
                    </div>

                    {/* Apply Button */}
                    <div className="pt-2 pb-4">
                        <button
                            type="button"
                            className="w-full px-9 py-4 text-lg font-semibold rounded-full transition-all duration-200 bg-[#5E57AC] text-white hover:bg-[#4e47a0] focus:outline-none focus:ring-4 focus:ring-[#5E57AC]/30 shadow-md hover:shadow-lg active:bg-[#4e47a0]"
                            onClick={() => setIsOptionsOpen(false)}
                        >
                            Apply Changes
                        </button>
                    </div>
                </div>
            </Drawer>

            {/* Bottom fixed navbar with safe area support */}
            <div
                className={`fixed inset-x-0 z-40 transition-opacity duration-300 ${
                    isOptionsOpen
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100"
                }`}
                style={{
                    bottom: `calc(env(safe-area-inset-bottom) + 16px)`,
                    paddingLeft: "env(safe-area-inset-left)",
                    paddingRight: "env(safe-area-inset-right)",
                }}
            >
                <div className="w-full flex justify-center">
                    <div className="inline-flex items-center bg-white/95 backdrop-blur-lg rounded-full border-2 border-gray-200 p-1 shadow-lg will-change-transform">
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onTouchStart={(e) => e.preventDefault()}
                            onClick={() => setPageTab("gifts")}
                            className={`px-5 py-2 rounded-full font-semibold transition-colors focus:outline-none focus:ring-0 ${pageTab === "gifts" ? "bg-[#5E57AC] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            Gifts
                        </button>
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onTouchStart={(e) => e.preventDefault()}
                            onClick={() => setPageTab("favourites")}
                            className={`px-5 py-2 rounded-full font-semibold transition-colors focus:outline-none focus:ring-0 ${pageTab === "favourites" ? "bg-[#5E57AC] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            Favourites
                        </button>
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onTouchStart={(e) => e.preventDefault()}
                            onClick={() => setPageTab("share")}
                            className={`px-5 py-2 rounded-full font-semibold transition-colors focus:outline-none focus:ring-0 ${pageTab === "share" ? "bg-[#5E57AC] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            Share
                        </button>
                    </div>
                </div>
            </div>
            {/* Add Person Drawer */}
            <AddPersonPage
                open={isAddPersonOpen}
                onOpenChange={setIsAddPersonOpen}
            />
        </div>
    );
};

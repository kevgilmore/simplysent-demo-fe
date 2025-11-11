import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../components/ui/ProductCard";
import { Button } from "../components/ui/Button";
import { RefineSheet } from "../components/sheets/RefineSheet";

export const ImprovedGiftResultsPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("ai-picks");
    const [pageTab, setPageTab] = useState("gifts");
    const [favourites, setFavourites] = useState<Set<string>>(new Set());
    const [recipient, setRecipient] = useState("Dad");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isRefineOpen, setIsRefineOpen] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [minBudget, setMinBudget] = useState(50);
    const [maxBudget, setMaxBudget] = useState(300);
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

    const tabs = [
        { id: "ai-picks", label: "AI Picks" },
        { id: "tech", label: "Tech" },
        { id: "golf", label: "Golf" },
    ];

    const pageTabs = [
        { id: "gifts", label: "Gifts" },
        { id: "favourites", label: "Favourites" },
        { id: "share", label: "Share" },
    ];

    type Product = { id: string; image: string; name: string; price: number };
    const productsByTab: Record<string, Product[]> = {
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
        ],
        golf: [
            {
                id: "golf-1",
                image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800&auto=format&fit=crop",
                name: "Premium Golf Balls (12 pack)",
                price: 34.99,
            },
            {
                id: "golf-2",
                image: "https://images.unsplash.com/photo-1535139262971-d2d102b0fb12?q=80&w=800&auto=format&fit=crop",
                name: "Golf Swing Trainer Aid",
                price: 44.99,
            },
            {
                id: "golf-3",
                image: "https://images.unsplash.com/photo-1521417531060-7c277f2cc6a3?q=80&w=800&auto=format&fit=crop",
                name: "Golf Glove Leather",
                price: 19.99,
            },
        ],
    };

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
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="min-h-[100dvh] py-8 px-4 pb-[calc(env(safe-area-inset-bottom)_+_96px)] overscroll-contain">
            <div className="max-w-7xl mx-auto">
                {/* Logo and Recipient Selector */}
                <div className="flex justify-between items-center mb-6">
                    <img
                        src="/logo.png"
                        alt="SimplySent"
                        className="h-12 w-auto"
                    />

                    {/* Recipient Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => {
                                setRecipient("Dad");
                                setIsDropdownOpen(false);
                                navigate("/new");
                            }}
                            className={`block w-full px-6 py-3 rounded-full font-semibold transition-colors text-left ${
                                recipient === "Dad"
                                    ? "bg-gray-600 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {recipient}
                            <svg
                                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 bg-white rounded-3xl z-50 p-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRecipient("Dad");
                                        setIsDropdownOpen(false);
                                        navigate("/new");
                                    }}
                                    className={`block w-full px-6 py-3 rounded-full font-semibold transition-colors text-left ${
                                        recipient === "Dad"
                                            ? "bg-gray-600 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Dad
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRecipient("Mum");
                                        setIsDropdownOpen(false);
                                        navigate("/new-mum");
                                    }}
                                    className={`block w-full px-6 py-3 rounded-full font-semibold transition-colors text-left ${
                                        recipient === "Mum"
                                            ? "bg-gray-600 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Mum
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reserved header slot to prevent jump between views */}
                <div className="mb-6">
                    <div
                        className={`${pageTab === "gifts" ? "" : "invisible pointer-events-none"}`}
                    >
                        <TabMenu
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>
                </div>

                {pageTab === "gifts" && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {productsByTab[activeTab]?.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    image={p.image}
                                    name={p.name}
                                    price={p.price}
                                    isFavorite={true}
                                    onFavoriteToggle={() =>
                                        toggleFavourite(p.id)
                                    }
                                />
                            ))}
                        </div>

                        <div className="mt-8">
                            <Button
                                fullWidth
                                variant="primary"
                                size="large"
                                onClick={() => setIsRefineOpen(true)}
                            >
                                Refine
                            </Button>
                        </div>
                    </>
                )}

                {pageTab === "favourites" && (
                    <div className="mt-4">
                        {Array.from(favourites).length === 0 ? (
                            <p className="text-center text-gray-600">
                                No favourites yet. Tap the heart on any product
                                to add it here.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

            <RefineSheet
                open={isRefineOpen}
                onOpenChange={setIsRefineOpen}
                initialInterests={selectedInterests}
                initialMinBudget={minBudget}
                initialMaxBudget={maxBudget}
                onUpdate={(data) => {
                    setSelectedInterests(data.interests);
                    setMinBudget(data.minBudget);
                    setMaxBudget(data.maxBudget);
                }}
            />

            {/* Bottom fixed navbar */}
            <div
                className={`fixed inset-x-0 z-40 transition-opacity duration-300 ${
                    isRefineOpen
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100"
                }`}
                style={{ bottom: `calc(env(safe-area-inset-bottom) + 16px)` }}
            >
                <div className="w-full flex justify-center">
                    <div className="inline-flex items-center bg-white rounded-full border-2 border-gray-200 p-1 shadow-lg will-change-transform">
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
        </div>
    );
};

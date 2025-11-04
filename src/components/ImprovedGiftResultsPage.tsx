import React, {
    useMemo,
    useState,
    useRef,
    useEffect,
    useCallback,
} from "react";
import { TabMenu } from "./ui/TabMenu";
import { ProductCard } from "./ui/ProductCard";
import { Button } from "./ui/Button";
import { RangeSlider } from "./ui/RangeSlider";

export const ImprovedGiftResultsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState("ai-picks");
    const [pageTab, setPageTab] = useState("gifts");
    const [favourites, setFavourites] = useState<Set<string>>(new Set());
    const [recipient, setRecipient] = useState("Dad");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [minBudget, setMinBudget] = useState(50);
    const [maxBudget, setMaxBudget] = useState(300);
    const [dragStartY, setDragStartY] = useState(0);
    const [dragCurrentY, setDragCurrentY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const tabs = [
        { id: "ai-picks", label: "AI Picks" },
        { id: "tech", label: "Tech" },
        { id: "golf", label: "Golf" },
    ];

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
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDragStart = useCallback((clientY: number) => {
        setDragStartY(clientY);
        setDragCurrentY(clientY);
        setIsDragging(true);
    }, []);

    const handleDragMove = useCallback(
        (clientY: number) => {
            if (isDragging) {
                const delta = clientY - dragStartY;
                if (delta > 0) {
                    setDragCurrentY(clientY);
                }
            }
        },
        [isDragging, dragStartY],
    );

    const handleDragEnd = useCallback(() => {
        if (isDragging) {
            const delta = dragCurrentY - dragStartY;
            if (delta > 100) {
                setIsOptionsOpen(false);
            }
            setIsDragging(false);
            setDragStartY(0);
            setDragCurrentY(0);
        }
    }, [isDragging, dragCurrentY, dragStartY]);

    useEffect(() => {
        if (isDragging) {
            const handleMouseMove = (e: MouseEvent) =>
                handleDragMove(e.clientY);
            const handleTouchMove = (e: TouchEvent) =>
                handleDragMove(e.touches[0].clientY);
            const handleMouseUp = () => handleDragEnd();
            const handleTouchEnd = () => handleDragEnd();

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("touchmove", handleTouchMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("touchend", handleTouchEnd);

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("touchmove", handleTouchMove);
                document.removeEventListener("mouseup", handleMouseUp);
                document.removeEventListener("touchend", handleTouchEnd);
            };
        }
    }, [isDragging, handleDragMove, handleDragEnd]);

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
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="inline-flex items-center gap-2 bg-white rounded-full border-2 border-gray-200 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
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
                            <div className="absolute right-0 mt-2 bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden z-50 min-w-[120px]">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRecipient("Dad");
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full px-5 py-3 text-left font-semibold transition-colors ${
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
                                        setRecipient("Add +");
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full px-5 py-3 text-left font-semibold transition-colors ${
                                        recipient === "Add +"
                                            ? "bg-gray-600 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Add +
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reserved header slot to prevent jump between views */}
                {pageTab === "gifts" && (
                    <div className="mb-6">
                        <TabMenu
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>
                )}

                {pageTab === "gifts" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {productsByTab[activeTab]?.map((p) => (
                            <ProductCard
                                key={p.id}
                                image={p.image}
                                name={p.name}
                                price={p.price}
                                className={
                                    activeTab === "ai-picks"
                                        ? "border-2 border-purple-300 ring-1 ring-purple-200/60 hover:ring-purple-300/70 transition-shadow"
                                        : undefined
                                }
                                badge={
                                    activeTab === "ai-picks" ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-sm">
                                            <svg
                                                width="10"
                                                height="10"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d="M12 2l2.39 5.26L20 8.27l-4 3.89L17.18 18 12 15.45 6.82 18 8 12.16 4 8.27l5.61-1.01L12 2z" />
                                            </svg>
                                            AI pick
                                        </span>
                                    ) : undefined
                                }
                                isFavorite={favourites.has(p.id)}
                                onFavoriteToggle={() => toggleFavourite(p.id)}
                            />
                        ))}
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
                            Change options
                        </Button>
                    </div>
                )}

                {pageTab === "favourites" && (
                    <div>
                        {Array.from(favourites).length === 0 ? (
                            <p className="text-center text-gray-600">
                                No favourites yet. Tap the heart on any product
                                to add it here.
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

            {/* Backdrop blur */}
            {isOptionsOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsOptionsOpen(false)}
                ></div>
            )}

            {/* Slide-in Options Panel */}
            <div
                className={`fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 ${
                    isDragging
                        ? ""
                        : "transition-transform duration-300 ease-out"
                } ${isOptionsOpen ? "translate-y-0" : "translate-y-full"}`}
                style={{
                    height: "75vh",
                    transform: isDragging
                        ? `translateY(${Math.max(0, dragCurrentY - dragStartY)}px)`
                        : undefined,
                }}
            >
                <div className="h-full overflow-y-auto p-6 pb-8">
                    {/* Handle bar */}
                    <div
                        className="flex justify-center mb-6 cursor-grab active:cursor-grabbing"
                        onMouseDown={(e) => handleDragStart(e.clientY)}
                        onTouchStart={(e) =>
                            handleDragStart(e.touches[0].clientY)
                        }
                    >
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                    </div>

                    {/* Interests Section */}
                    <div className="mb-8">
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
                    <div className="mb-8">
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
                    <div className="mt-6">
                        <button
                            type="button"
                            className="w-full px-9 py-4 text-lg font-semibold rounded-full transition-all duration-200 bg-[#5E57AC] text-white hover:bg-[#4e47a0] focus:outline-none focus:ring-4 focus:ring-[#5E57AC]/30 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                            onClick={() => setIsOptionsOpen(false)}
                            onTouchEnd={(e) => {
                                e.preventDefault();
                                setIsOptionsOpen(false);
                            }}
                        >
                            Apply Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom fixed navbar */}
            <div
                className={`fixed inset-x-0 z-40 transition-opacity duration-300 ${
                    isOptionsOpen
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

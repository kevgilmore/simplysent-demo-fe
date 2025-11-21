import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faStar,
    faMicrochip,
    faGolfBallTee,
    faUserPlus,
    faGift,
    faSearch,
    faHeart,
    faShareNodes,
    faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { ProductCard } from "../components/ui/ProductCard";
import { Button } from "../components/ui/Button";
import { RangeSlider } from "../components/ui/RangeSlider";
import { RefineSheet } from "../components/sheets/RefineSheet";
import { ActionPersonSheet } from "../components/sheets/ActionPersonSheet";
import {
    buildApiUrl,
    apiFetch,
    getApiHeaders,
    getCurrentMode,
    isAnyDevModeEnabled,
} from "../utils/apiConfig";
import {
    getRecommendationHistory,
} from "../utils/recommendationHistory";
import { getOrCreateSessionId } from "../utils/tracking";
import { getProductsByDocumentIds } from "../services/firebaseService";

// Available product images
const PRODUCT_IMAGES = [
    "/img/products/fitbit.png",
    "/img/products/ninaj2.png",
    "/img/products/ninja.png",
    "/img/products/pop.png",
    "/img/products/sony.png",
];

// Helper function to get a random product image
const getRandomProductImage = () => {
    return PRODUCT_IMAGES[Math.floor(Math.random() * PRODUCT_IMAGES.length)];
};

interface ApiResponse {
    recommendation_id: string;
    products: Array<{
        asin: string;
        rank: number;
    }>;
}

export const PersonPage: React.FC = () => {
    const navigate = useNavigate();
    const [pageTab, setPageTab] = useState("gifts");
    const [favourites, setFavourites] = useState<Set<string>>(new Set());
    const [removedProducts, setRemovedProducts] = useState<Set<string>>(
        new Set(),
    );
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRefineOpen, setIsRefineOpen] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [minBudget, setMinBudget] = useState(50);
    const [maxBudget, setMaxBudget] = useState(300);
    const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [aiPicks, setAiPicks] = useState<Product[]>([]);
    const [isLoadingAiPicks, setIsLoadingAiPicks] = useState(true);
    const [aiPicksError, setAiPicksError] = useState<string | null>(null);

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

    type Product = { 
        id: string; 
        image: string; 
        name: string; 
        price: number;
        rating?: number;
        numRatings?: number;
    };
    
    // Fetch AI picks from API on component mount
    useEffect(() => {
        const fetchAiPicks = async () => {
            setIsLoadingAiPicks(true);
            setAiPicksError(null);
            
            // Check if dev mode is enabled
            const devModeEnabled = isAnyDevModeEnabled();
            
            // If not in dev mode, require form data from history
            if (!devModeEnabled) {
                const history = getRecommendationHistory();
                if (history.length === 0) {
                    setIsLoadingAiPicks(false);
                    setAiPicksError("Please fill out the onboarding form or add a person to get recommendations.");
                    setAiPicks([]);
                    return;
                }
            }
            
            try {
                let formData: any = null;
                
                // Helper function to convert age to DOB (DD/MM/YYYY format)
                const ageToDob = (age: number): string => {
                    const today = new Date();
                    const birthYear = today.getFullYear() - age;
                    // Use 15th of March as default date
                    return `15/03/${birthYear}`;
                };
                
                // Helper function to normalize size to enum format
                const normalizeSize = (size: string): string => {
                    const sizeMap: Record<string, string> = {
                        'small': 'S',
                        'medium': 'M',
                        'large': 'L',
                        'xlarge': 'XL',
                        'xxlarge': 'XXL',
                        's': 'S',
                        'm': 'M',
                        'l': 'L',
                        'xl': 'XL',
                        'xxl': 'XXL',
                    };
                    const normalized = size.toLowerCase().trim();
                    return sizeMap[normalized] || 'M'; // Default to M if not found
                };
                
                // In dev mode, use defaults. Otherwise, try to get from history
                if (devModeEnabled) {
                    // Use default values for dev mode
                    formData = {
                        personAge: "30",
                        gender: "male",
                        relationship: "friend",
                        occasion: "birthday",
                        sentiment: "happy",
                        interests: ["Tech"], // Must have at least 1 interest
                        favoritedrink: "beer",
                        clothesSize: "medium",
                        minBudget: 10,
                        maxBudget: 110,
                        name: "Kevin", // Add name for new API
                    };
                } else {
                    // Try to get form data from most recent recommendation
                    const history = getRecommendationHistory();
                    if (history.length > 0) {
                        const mostRecent = history[0];
                        if (mostRecent.formData) {
                            formData = mostRecent.formData;
                        }
                    }
                    
                    // If no history available and not dev mode, show error
                    if (!formData) {
                        throw new Error("No recommendation history found. Please fill out the onboarding form or add a person.");
                    }
                }
                
                // Ensure interests has at least 1 item (required by new API)
                const interests = formData.interests && formData.interests.length > 0 
                    ? formData.interests 
                    : ["General"];
                
                // Convert age to DOB
                const age = parseInt(formData.personAge || "30");
                const dob = ageToDob(age);
                
                const requestData = {
                    session_id: getOrCreateSessionId(),
                    context: {
                        name: formData.name || "Friend",
                        relationship: (formData.relationship || "friend").toLowerCase(),
                        occasion: (formData.occasion || "birthday").toLowerCase(),
                        gender: (formData.gender || "male").toLowerCase(),
                        dob: dob,
                        interests: interests,
                        favourite_drink: (formData.favoritedrink || "beer").toLowerCase(),
                        size: normalizeSize(formData.clothesSize || "medium"),
                        sentiment: (formData.sentiment || "happy").toLowerCase(),
                        budget_min: formData.minBudget || 10,
                        budget_max: formData.maxBudget || 110,
                    },
                };
                
                const urlParams = new URLSearchParams(window.location.search);
                const origin = urlParams.get("client_origin");
                
                const queryParams = new URLSearchParams();
                if (origin) {
                    queryParams.append("client_origin", origin);
                }
                
                const mode = getCurrentMode();
                const apiUrl = buildApiUrl("/recommend", queryParams);
                const headers = getApiHeaders(mode || undefined);
                console.log("Making API call to:", apiUrl);
                console.log("Request headers:", headers);
                console.log("Request body:", requestData);
                console.log("Mode:", mode);
                
                const response = await apiFetch(
                    apiUrl,
                    {
                        method: "POST",
                        headers,
                        body: JSON.stringify(requestData),
                    },
                    "POST /recommend",
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data: ApiResponse = await response.json();
                
                if (data.products && data.products.length > 0) {
                    // Extract ASINs from API response
                    const asins = data.products.map(p => p.asin).filter(Boolean);
                    
                    if (asins.length === 0) {
                        throw new Error("No valid ASINs in recommendations");
                    }
                    
                    // Fetch product details from Firebase
                    console.log("🔥 PersonPage: Fetching product details from Firebase for ASINs:", asins);
                    try {
                        const productDetails = await getProductsByDocumentIds(asins);
                        console.log("✅ PersonPage: Received product details from Firebase:", productDetails);
                    
                        // Transform to Product format, using Firebase data when available
                        const transformedProducts: Product[] = data.products.map((product, index) => {
                            const details = productDetails[index];
                            const asin = product.asin || `ai-${index + 1}`;
                            
                            // Extract product data - handle nested 'data' field structure
                            const productData = details?.data || details;
                            
                            // Extract name - try multiple possible fields
                            const productName = productData?.name 
                                || productData?.product_title 
                                || productData?.title 
                                || details?.name 
                                || details?.productTitle 
                                || `Product ${product.rank || index + 1}`;
                            
                            // Use Google Cloud Storage URL for AI picks images
                            // Format: https://storage.googleapis.com/simplysent-product-images/{asin}/t_{asin}_1.png
                            const productImage = `https://storage.googleapis.com/simplysent-product-images/${asin}/t_${asin}_1.png`;
                            
                            // Extract price - prioritize product_price from Firebase
                            let productPrice = 0;
                            const priceValue = productData?.product_price 
                                || productData?.price 
                                || productData?.price_amount 
                                || productData?.current_price
                                || details?.product_price
                                || details?.price;
                            
                            if (priceValue !== undefined && priceValue !== null) {
                                if (typeof priceValue === 'string') {
                                    // Remove currency symbols and parse
                                    productPrice = parseFloat(priceValue.replace(/[£$€,]/g, '')) || 0;
                                } else if (typeof priceValue === 'number') {
                                    productPrice = priceValue;
                                }
                            }
                            
                            // Extract rating and reviews
                            const rating = productData?.product_star_rating 
                                || productData?.rating
                                || details?.product_star_rating
                                || details?.rating;
                            const numRatings = productData?.product_num_ratings 
                                || productData?.num_ratings
                                || details?.product_num_ratings
                                || details?.num_ratings
                                || 0;
                            
                            console.log(`📦 Product ${asin}:`, { 
                                name: productName, 
                                image: productImage, 
                                price: productPrice,
                                rating: rating,
                                numRatings: numRatings
                            });
                            
                            return {
                                id: asin,
                                image: productImage,
                                name: productName,
                                price: productPrice,
                                rating: rating ? parseFloat(rating.toString()) : undefined,
                                numRatings: numRatings,
                            };
                        });
                        
                        console.log("✅ PersonPage: Transformed products:", transformedProducts);
                        setAiPicks(transformedProducts);
                    } catch (firebaseError) {
                        console.error("❌ PersonPage: Firebase error, using placeholder data:", firebaseError);
                        // Fallback to placeholder data if Firebase fails
                        const transformedProducts: Product[] = data.products.map((product, index) => {
                            const asin = product.asin || `ai-${index + 1}`;
                            // Use Google Cloud Storage URL for AI picks images
                            const productImage = `https://storage.googleapis.com/simplysent-product-images/${asin}/t_${asin}_1.png`;
                            return {
                                id: asin,
                                image: productImage,
                                name: `Product ${product.rank || index + 1}`,
                                price: 0,
                            };
                        });
                        setAiPicks(transformedProducts);
                    }
                } else {
                    throw new Error("No product recommendations received");
                }
            } catch (error) {
                console.error("Error fetching AI picks:", error);
                setAiPicksError(error instanceof Error ? error.message : "Failed to load recommendations");
                // Never use fallback fake products for AI picks - leave empty
                setAiPicks([]);
            } finally {
                setIsLoadingAiPicks(false);
            }
        };
        
        fetchAiPicks();
    }, []);
    
    const productsByTab: Record<string, Product[]> = useMemo(
        () => ({
            "ai-picks": aiPicks, // Use real API data, never fallback to fake products
            tech: [
                {
                    id: "tech-1",
                    image: getRandomProductImage(),
                    name: "Wireless Headphones Pro Max",
                    price: 199.99,
                },
                {
                    id: "tech-2",
                    image: getRandomProductImage(),
                    name: "Smart Home Hub",
                    price: 129.99,
                },
                {
                    id: "tech-3",
                    image: getRandomProductImage(),
                    name: "Portable Bluetooth Speaker",
                    price: 59.99,
                },
                {
                    id: "tech-4",
                    image: getRandomProductImage(),
                    name: "4K Action Camera",
                    price: 279.99,
                },
                {
                    id: "tech-5",
                    image: getRandomProductImage(),
                    name: "Mechanical Gaming Keyboard",
                    price: 149.99,
                },
            ],
            golf: [
                {
                    id: "golf-1",
                    image: getRandomProductImage(),
                    name: "Premium Golf Balls (12 pack)",
                    price: 34.99,
                },
                {
                    id: "golf-2",
                    image: getRandomProductImage(),
                    name: "Golf Swing Trainer Aid",
                    price: 44.99,
                },
                {
                    id: "golf-3",
                    image: getRandomProductImage(),
                    name: "Golf Glove Leather",
                    price: 19.99,
                },
                {
                    id: "golf-4",
                    image: getRandomProductImage(),
                    name: "Golf Club Set - Irons",
                    price: 499.99,
                },
                {
                    id: "golf-5",
                    image: getRandomProductImage(),
                    name: "Golf Range Finder",
                    price: 189.99,
                },
            ],
        }),
        [aiPicks],
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

    const handleProductRemove = (productId: string) => {
        setRemovedProducts((prev) => {
            const next = new Set(prev);
            next.add(productId);
            return next;
        });
    };

    const handleProductClick = (productId: string) => {
        navigate(`/product/${productId}`); // Navigate to product page with actual ASIN
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

    // White bottom safe area overlay when sheets are open
    useEffect(() => {
        if (isRefineOpen || isAddPersonOpen) {
            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.bottom = "0";
            overlay.style.left = "0";
            overlay.style.right = "0";
            overlay.style.height = "34px"; // iPhone safe area bottom
            overlay.style.background = "#ffffff";
            overlay.style.pointerEvents = "none";
            overlay.style.zIndex = "9999999";
            overlay.id = "sheet-bottom-safe-area";
            document.body.appendChild(overlay);
            
            return () => {
                const el = document.getElementById("sheet-bottom-safe-area");
                if (el) el.remove();
            };
        }
    }, [isRefineOpen, isAddPersonOpen]);

    // Initialize favourites with two products on load
    useEffect(() => {
        if (allProducts.length >= 2) {
            setFavourites((prev) => {
                if (prev.size === 0) {
                    return new Set([allProducts[0].id, allProducts[1].id]);
                }
                return prev;
            });
        }
    }, [allProducts]);


    return (
        <div className="overscroll-contain bg-gradient-to-b from-[#f7f6fe] to-[#f1eefe] min-h-screen">
            {/* Primary App Navbar (logo + top menu) */}
            <header
                id="topnav"
                className="bg-[#f7f6fe]"
                style={{
                    paddingTop: "env(safe-area-inset-top)",
                    paddingLeft: "env(safe-area-inset-left)",
                    paddingRight: "env(safe-area-inset-right)",
                }}
            >
                <div className="px-4 py-3 flex justify-between items-center">
                    <h1 className="font-notch font-bold text-2xl bg-gradient-to-r from-purple-600 via-simplysent-purple to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                        SimplySent
                    </h1>

                    {/* Menu Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Person Select Button */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                id="person-select-button"
                                className="inline-flex items-center gap-3 bg-white rounded-full border border-gray-200 px-5 py-2.5 hover:bg-gray-50 transition-colors shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                                aria-label="Select person"
                            >
                                <FontAwesomeIcon
                                    icon={faGift}
                                    className="w-6 h-6 text-gray-700"
                                />
                                <span className="font-semibold text-gray-800 text-base">
                                    Kevin
                                </span>
                            </button>

                            {isMenuOpen && (
                                <div className="absolute left-0 mt-2 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-200 z-50 min-w-[120px] overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate("/new");
                                        }}
                                        className="block w-full pl-5 pr-4 py-2.5 font-semibold transition-colors text-left text-gray-800 hover:bg-purple-50"
                                    >
                                        Dad
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate("/new-mum");
                                        }}
                                        className="block w-full pl-5 pr-4 py-2.5 font-semibold transition-colors text-left text-gray-800 hover:bg-purple-50"
                                    >
                                        Mum
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate("/new");
                                        }}
                                        className="block w-full pl-5 pr-4 py-2.5 font-semibold transition-colors text-left text-gray-800 hover:bg-purple-50"
                                    >
                                        Brother
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate("/new");
                                        }}
                                        className="block w-full pl-5 pr-4 py-2.5 font-semibold transition-colors text-left text-gray-800 hover:bg-purple-50"
                                    >
                                        Sister
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate("/new");
                                        }}
                                        className="block w-full pl-5 pr-4 py-2.5 font-semibold transition-colors text-left text-gray-800 hover:bg-purple-50"
                                    >
                                        Harry
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate("/new");
                                        }}
                                        className="block w-full pl-5 pr-4 py-2.5 font-semibold transition-colors text-left text-gray-800 hover:bg-purple-50"
                                    >
                                        Coral
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Add Person Button */}
                        <button
                            type="button"
                            onClick={() => setIsAddPersonOpen(true)}
                            id="add-person-button"
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-simplysent-purple hover:bg-simplysent-purple-dark transition-colors shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                            aria-label="Add person"
                        >
                            <FontAwesomeIcon
                                icon={faUserPlus}
                                className="w-6 h-6 text-white"
                            />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div
                className="px-4 pb-4"
                style={{
                    paddingLeft: "max(1rem, env(safe-area-inset-left))",
                    paddingRight: "max(1rem, env(safe-area-inset-right))",
                    paddingBottom: "calc(env(safe-area-inset-bottom) + 80px)",
                }}
            >
                <div className="max-w-7xl mx-auto">
                    {/* Carousels Section */}
                    {pageTab === "gifts" && (
                        <div>
                            {/* AI Picks Carousel */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between gap-3 mb-0">
                                    <h2 className="text-[22px] font-medium font-headline text-simplysent-grey-heading">
                                        AI Picks For Kevin
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setIsRefineOpen(true)}
                                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                                        aria-label="Open refine panel"
                                    >
                                        <FontAwesomeIcon
                                            icon={faSliders}
                                            className="w-5 h-5 text-gray-500"
                                        />
                                    </button>
                                </div>
                                {isLoadingAiPicks ? (
                                    <div className="mt-[10px] flex items-center justify-center" style={{ minHeight: "311px" }}>
                                        <div className="text-center px-4">
                                            {/* Loading spinner */}
                                            <div className="relative mx-auto mb-6 w-20 h-20">
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 animate-pulse" />
                                                <div className="absolute inset-2 rounded-full bg-white" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-simplysent-purple animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="text-simplysent-purple font-semibold text-lg mb-2">
                                                Loading AI recommendations...
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                Finding the perfect picks for you
                                            </p>
                                        </div>
                                    </div>
                                ) : aiPicksError ? (
                                    <div className="mt-[10px] flex items-center justify-center" style={{ minHeight: "311px" }}>
                                        <div className="text-center px-4 max-w-md">
                                            <div className="relative mx-auto mb-6 w-20 h-20">
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-100 to-red-50" />
                                                <div className="absolute inset-2 rounded-full bg-white" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="text-red-600 font-semibold text-lg mb-2">
                                                Failed to load recommendations
                                            </p>
                                            <p className="text-gray-500 text-sm mb-4">
                                                {aiPicksError}
                                            </p>
                                            {!isAnyDevModeEnabled() && (
                                                <div className="flex flex-col gap-2 items-center">
                                                    <Button
                                                        onClick={() => navigate("/")}
                                                        variant="primary"
                                                        size="medium"
                                                    >
                                                        Fill Out Onboarding Form
                                                    </Button>
                                                    <Button
                                                        onClick={() => setIsAddPersonOpen(true)}
                                                        variant="secondary"
                                                        size="medium"
                                                    >
                                                        Add Person
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : productsByTab["ai-picks"]?.filter(
                                    (p) => !removedProducts.has(p.id),
                                ).length === 0 ? (
                                    <div className="mt-[10px] flex items-center justify-center" style={{ minHeight: "311px" }}>
                                        <div className="text-center px-4">
                                            {/* Shimmer graphic circle */}
                                            <div className="relative mx-auto mb-6 w-20 h-20">
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 shimmer-placeholder" />
                                                <div className="absolute inset-2 rounded-full bg-white" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-simplysent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <p className="text-simplysent-purple font-semibold text-lg mb-2">
                                                Swipe down to generate new recommendations
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                We'll find more great picks for you
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pt-3 pb-12 mt-[10px]">
                                        <div className="flex gap-4 transition-all duration-700 ease-out">
                                            {productsByTab["ai-picks"]
                                                ?.filter(
                                                    (p) =>
                                                        !removedProducts.has(
                                                            p.id,
                                                        ),
                                                )
                                                .map((p) => {
                                                    return (
                                                        <div
                                                            key={p.id}
                                                            className="flex-shrink-0 w-[260px] transition-all duration-700 ease-out"
                                                        >
                                                            <ProductCard
                                                                id={p.id}
                                                                image={p.image}
                                                                name={p.name}
                                                                price={p.price}
                                                                rating={p.rating}
                                                                numRatings={p.numRatings}
                                                                compact
                                                                isAiPick={true}
                                                                isFavorite={favourites.has(
                                                                    p.id,
                                                                )}
                                                                onFavoriteToggle={() =>
                                                                    toggleFavourite(
                                                                        p.id,
                                                                    )
                                                                }
                                                                onRemove={
                                                                    handleProductRemove
                                                                }
                                                                onClick={() =>
                                                                    handleProductClick(
                                                                        p.id,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tech Carousel */}
                            <div className="mt-[10px]">
                                <div className="flex items-center gap-3 mb-0">
                                    <h2 className="text-[22px] font-medium font-headline text-simplysent-grey-heading">
                                        Tech
                                    </h2>
                                </div>
                                {productsByTab["tech"]?.filter(
                                    (p) => !removedProducts.has(p.id),
                                ).length === 0 ? (
                                    <div className="flex items-center justify-center py-12 px-4">
                                        <div className="text-center max-w-md">
                                            <p className="text-gray-400 text-lg font-medium">
                                                No more recommendations here.
                                            </p>
                                            <p className="text-gray-400 text-sm mt-2">
                                                Check back later for new picks!
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pt-3 pb-8 mt-[10px]">
                                        <div className="flex gap-4 transition-all duration-1000">
                                            {productsByTab["tech"]
                                                ?.filter(
                                                    (p) =>
                                                        !removedProducts.has(
                                                            p.id,
                                                        ),
                                                )
                                                .map((p) => (
                                                    <div
                                                        key={p.id}
                                                        className="flex-shrink-0 w-[260px]"
                                                    >
                                                        <ProductCard
                                                            id={p.id}
                                                            image={p.image}
                                                            name={p.name}
                                                            price={p.price}
                                                            rating={p.rating}
                                                            numRatings={p.numRatings}
                                                            compact
                                                            className="shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 bg-white"
                                                            isFavorite={favourites.has(
                                                                p.id,
                                                            )}
                                                            onFavoriteToggle={() =>
                                                                toggleFavourite(
                                                                    p.id,
                                                                )
                                                            }
                                                            onRemove={
                                                                handleProductRemove
                                                            }
                                                            // Only AI picks have real ASINs, so only they are clickable
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Golf Carousel */}
                            <div className="mt-[10px]">
                                <div className="flex items-center gap-3 mb-0">
                                    <h2 className="text-[22px] font-medium font-headline text-simplysent-grey-heading">
                                        Golf
                                    </h2>
                                </div>
                                {productsByTab["golf"]?.filter(
                                    (p) => !removedProducts.has(p.id),
                                ).length === 0 ? (
                                    <div className="flex items-center justify-center py-12 px-4">
                                        <div className="text-center max-w-md">
                                            <p className="text-gray-400 text-lg font-medium">
                                                No more recommendations here.
                                            </p>
                                            <p className="text-gray-400 text-sm mt-2">
                                                Check back later for new picks!
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pt-3 pb-8 mt-[10px]">
                                        <div className="flex gap-4 transition-all duration-1000">
                                            {productsByTab["golf"]
                                                ?.filter(
                                                    (p) =>
                                                        !removedProducts.has(
                                                            p.id,
                                                        ),
                                                )
                                                .map((p) => (
                                                    <div
                                                        key={p.id}
                                                        className="flex-shrink-0 w-[260px]"
                                                    >
                                                        <ProductCard
                                                            id={p.id}
                                                            image={p.image}
                                                            name={p.name}
                                                            price={p.price}
                                                            rating={p.rating}
                                                            numRatings={p.numRatings}
                                                            compact
                                                            className="shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 bg-white"
                                                            isFavorite={favourites.has(
                                                                p.id,
                                                            )}
                                                            onFavoriteToggle={() =>
                                                                toggleFavourite(
                                                                    p.id,
                                                                )
                                                            }
                                                            onRemove={
                                                                handleProductRemove
                                                            }
                                                            // Only AI picks have real ASINs, so only they are clickable
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}


                    {pageTab === "favourites" && (
                        <div>
                            <div className="mt-6">
                                <div className="flex items-center gap-3 mb-0">
                                    <h2 className="text-[22px] font-medium font-headline text-simplysent-grey-heading">
                                        Favourites
                                    </h2>
                                </div>
                            </div>
                            {Array.from(favourites).length === 0 ? (
                                <div className="mt-6">
                                    <p className="text-center text-gray-600">
                                        No favourites yet. Tap the heart on any
                                        product to add it here.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                                    {allProducts
                                        .filter((p) => favourites.has(p.id))
                                        .map((p) => {
                                            // Only AI picks have real ASINs, so only they are clickable
                                            // Check if product is in aiPicks (has real ASIN)
                                            const isAiPick = aiPicks.some(ap => ap.id === p.id);
                                            return (
                                                <div key={p.id} className="flex justify-center w-full">
                                                    <ProductCard
                                                        id={p.id}
                                                        image={p.image}
                                                        name={p.name}
                                                        price={p.price}
                                                        rating={p.rating}
                                                        numRatings={p.numRatings}
                                                        isFavorite={true}
                                                        onFavoriteToggle={() =>
                                                            toggleFavourite(p.id)
                                                        }
                                                        hideActions={true}
                                                        favouritesVariant={true}
                                                        onClick={isAiPick ? () =>
                                                            handleProductClick(p.id)
                                                        : undefined}
                                                    />
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>
                    )}

                    {pageTab === "share" && (
                        <div>
                            <div className="mt-6">
                                <div className="flex items-center gap-3 mb-0">
                                    <h2 className="text-[22px] font-medium font-headline text-simplysent-grey-heading">
                                        Share
                                    </h2>
                                </div>
                            </div>
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
                        </div>
                    )}
                </div>
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

            {/* Floating Section Navigation (Gifts / Favourites / Share) */}

            <div
                id="floating-nav"
                className={`fixed inset-x-0 z-40 transition-opacity duration-300 ${
                    isRefineOpen
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
                    <div className="relative inline-flex items-center bg-white/95 backdrop-blur-lg rounded-full border border-gray-200 p-1.5 shadow-lg overflow-hidden will-change-transform gap-1.5">
                        <div
                            className="absolute rounded-full transition-transform duration-300 ease-[cubic-bezier(.32,.72,.33,.99)] pointer-events-none"
                            style={{
                                width: "60px",
                                height: "60px",
                                left: "4px",
                                top: "50%",
                                transform: `translateY(-50%) translateX(${pageTab === "gifts" ? 0 : pageTab === "favourites" ? 62 : 124}px)`,
                            }}
                        >
                            <div className="w-full h-full bg-simplysent-purple rounded-full shadow-md" />
                        </div>
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setPageTab("gifts")}
                            className={`flex items-center justify-center w-14 h-14 rounded-full transition-colors duration-200 relative z-10 hover:scale-105 ${pageTab === "gifts" ? "text-white" : "text-simplysent-purple hover:text-simplysent-purple-dark"}`}
                        >
                            <FontAwesomeIcon icon={faSearch} size="lg" />
                        </button>
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setPageTab("favourites")}
                            className={`flex items-center justify-center w-14 h-14 rounded-full transition-colors duration-200 relative z-10 hover:scale-105 ${pageTab === "favourites" ? "text-white" : "text-simplysent-purple hover:text-simplysent-purple-dark"}`}
                        >
                            <FontAwesomeIcon icon={faHeart} size="lg" />
                        </button>
                        <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setPageTab("share")}
                            className={`flex items-center justify-center w-14 h-14 rounded-full transition-colors duration-200 relative z-10 hover:scale-105 ${pageTab === "share" ? "text-white" : "text-simplysent-purple hover:text-simplysent-purple-dark"}`}
                        >
                            <FontAwesomeIcon icon={faShareNodes} size="lg" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Person Sheet */}
            <ActionPersonSheet
                open={isAddPersonOpen}
                onOpenChange={setIsAddPersonOpen}
                title="Add Person"
            />
        </div>
    );
};

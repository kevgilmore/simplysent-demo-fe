import React, { useMemo, useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    faRotateRight,
    faArrowUp,
    faArrowDown,
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
    ApiError,
} from "../utils/apiConfig";
import {
    getRecommendationHistory,
} from "../utils/recommendationHistory";
import { getOrCreateSessionId } from "../utils/tracking";
import { getProductsByDocumentIds } from "../services/firebaseService";
import { menInterests, womenInterests, boysInterests, girlsInterests } from "../components/sheets/formConstants";

    // Helper function to get interest label from value
    const getInterestLabel = (value: string): string => {
        const allInterests = [...menInterests, ...womenInterests, ...boysInterests, ...girlsInterests];
        const interest = allInterests.find(i => i.value === value);
        return interest ? interest.label : value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
    };

    // Helper function to extract user-friendly error message from API errors
    const getUserFriendlyErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        // Check if it's an ApiError with metadata
        const apiError = error as ApiError;
        if (apiError.apiMetadata?.response_text) {
            try {
                // Try to parse JSON response
                const parsed = JSON.parse(apiError.apiMetadata.response_text);
                if (parsed.error && typeof parsed.error === 'string') {
                    return parsed.error;
                }
                if (parsed.message && typeof parsed.message === 'string') {
                    return parsed.message;
                }
            } catch {
                // If not JSON, check if response_text is a simple string message
                const responseText = apiError.apiMetadata.response_text.trim();
                if (responseText && !responseText.startsWith('<!')) {
                    return responseText;
                }
            }
        }
        // Fallback to generic message
        return "Unable to load recommendations. Please try again later.";
    }
    return "Unable to load recommendations. Please try again later.";
};

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
    const location = useLocation();
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
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [rapidApiProducts, setRapidApiProducts] = useState<Product[]>([]);
    const [rapidApiSortOrder, setRapidApiSortOrder] = useState<'highest' | 'lowest' | null>(null);
    const [techProducts, setTechProducts] = useState<Product[]>([]);
    const [isLoadingTechProducts, setIsLoadingTechProducts] = useState(true);
    const [techProductsError, setTechProductsError] = useState<string | null>(null);
    const [techSortOrder, setTechSortOrder] = useState<'highest' | 'lowest' | null>(null);
    const [savedPersons, setSavedPersons] = useState<Array<{
        id: string;
        name: string;
        relationship?: string;
        gender?: string;
        interests: string[];
        minBudget?: number;
        maxBudget?: number;
        createdAt: number;
    }>>([]);
    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
    const [interestProducts, setInterestProducts] = useState<Record<string, Product[]>>({});
    const [loadingInterests, setLoadingInterests] = useState<Record<string, boolean>>({});
    
    const CACHE_KEY = 'person_page_ai_picks_cache';
    const SCROLL_POSITION_KEY = 'person_page_carousel_scroll';
    const NAVIGATION_FLAG_KEY = 'person_page_navigated_from_product';
    const aiPicksCarouselRef = useRef<HTMLDivElement>(null);
    const hasRestoredScroll = useRef(false);
    const isUsingCache = useRef(false);

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
    
    // Fetch AI picks when a person is selected (not on page load)
    useEffect(() => {
        if (!selectedPersonId) {
            // No person selected, don't fetch
            setIsLoadingAiPicks(false);
            return;
        }

        // Check if this is a page refresh (no navigation flag) - clear scroll position
        const navigatedFromProduct = sessionStorage.getItem(NAVIGATION_FLAG_KEY) === 'true';
        if (!navigatedFromProduct) {
            // Page refresh - clear scroll position
            try {
                localStorage.removeItem(SCROLL_POSITION_KEY);
            } catch (error) {
                // Ignore errors
            }
        }
        
        // Check cache synchronously first - if cache exists, use it immediately and skip API call
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const cachedData = JSON.parse(cached);
                // Check if cache is less than 1 hour old (optional: you can adjust this)
                const cacheAge = Date.now() - (cachedData.timestamp || 0);
                const oneHour = 60 * 60 * 1000;
                if (cacheAge < oneHour && cachedData.products && cachedData.products.length > 0) {
                    console.log("📦 PersonPage: Using cached recommendations (navigating back from ProductPage)");
                    isUsingCache.current = true;
                    setAiPicks(cachedData.products);
                    setIsLoadingAiPicks(false);
                    setAiPicksError(null);
                    return; // Exit early, don't make API call
                }
            }
        } catch (error) {
            console.warn("⚠️ PersonPage: Error reading cache, fetching fresh data:", error);
        }
        
        // If we get here, it's a fresh fetch (not using cache)
        isUsingCache.current = false;
        
        // Only proceed with API call if cache doesn't exist or is expired
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
                
                // Get form data from selected person
                const selectedPerson = savedPersons.find(p => p.id === selectedPersonId);
                if (selectedPerson) {
                    // Calculate age from createdAt if needed, or use a default
                    const age = selectedPerson.createdAt ? Math.floor((Date.now() - selectedPerson.createdAt) / (1000 * 60 * 60 * 24 * 365)) : 30;
                    formData = {
                        personAge: age.toString(),
                        gender: selectedPerson.gender || "male",
                        relationship: selectedPerson.relationship || "friend",
                        interests: selectedPerson.interests || [],
                        favoritedrink: "beer", // Default if not stored
                        clothesSize: "medium", // Default if not stored
                        minBudget: selectedPerson.minBudget || 10,
                        maxBudget: selectedPerson.maxBudget || 50,
                        name: selectedPerson.name || "Friend",
                    };
                } else {
                    // No person selected - don't fetch
                    setIsLoadingAiPicks(false);
                    setAiPicksError("Please select a person to get recommendations.");
                    setAiPicks([]);
                    return;
                }
                
                // Ensure interests has at least 1 item (required by new API)
                const interests = formData.interests && formData.interests.length > 0 
                    ? formData.interests 
                    : ["General"];
                
                // Convert age to DOB
                const age = parseInt(formData.personAge || "30");
                const dob = ageToDob(age);
                
                const requestData = {
                    context: {
                        name: formData.name || "Friend",
                        relationship: formData.relationship ? formData.relationship.charAt(0).toUpperCase() + formData.relationship.slice(1).toLowerCase() : "Friend",
                        gender: (formData.gender || "male").toLowerCase(),
                        dob: dob,
                        interests: interests,
                        budget_min: formData.minBudget || 10,
                        budget_max: formData.maxBudget || 50,
                        other: {
                            clothing_size: normalizeSize(formData.clothesSize || "medium"),
                            favourite_drink: (formData.favoritedrink || "beer").toLowerCase(),
                        },
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
                            
                            // Use Google Cloud Storage URL for AI picks images, with Firebase fallback
                            // Format: https://storage.googleapis.com/simplysent-product-images/{asin}/t_{asin}_1.png
                            // Fallback to Firebase product_photos if GCP image not available
                            const firebaseProductPhotos = productData?.product_photos 
                                || productData?.data?.product_photos
                                || details?.product_photos
                                || details?.imageUrl;
                            const productImage = firebaseProductPhotos && (
                                Array.isArray(firebaseProductPhotos) && firebaseProductPhotos.length > 0
                                    ? firebaseProductPhotos[0]
                                    : typeof firebaseProductPhotos === 'string' 
                                        ? firebaseProductPhotos 
                                        : null
                            ) || `https://storage.googleapis.com/simplysent-product-images/${asin}/t_${asin}_1.png`;
                            
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
                        
                        // Save to cache
                        try {
                            localStorage.setItem(CACHE_KEY, JSON.stringify({
                                products: transformedProducts,
                                timestamp: Date.now(),
                                recommendationId: data.recommendation_id,
                            }));
                            console.log("💾 PersonPage: Saved recommendations to cache");
                        } catch (error) {
                            console.warn("⚠️ PersonPage: Error saving to cache:", error);
                        }
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
                setAiPicksError(getUserFriendlyErrorMessage(error));
                // Never use fallback fake products for AI picks - leave empty
                setAiPicks([]);
            } finally {
                setIsLoadingAiPicks(false);
                setIsRefreshing(false);
            }
        };
        
        // Only fetch if we didn't use cache
        fetchAiPicks();
    }, [selectedPersonId, savedPersons]);
    
    // Handle refresh button click
    const handleRefresh = () => {
        setIsRefreshing(true);
        // Clear cache and fetch fresh data
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch (error) {
            console.warn("⚠️ PersonPage: Error clearing cache:", error);
        }
        
        // Re-run fetch with force refresh
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
                    setIsRefreshing(false);
                    return;
                }
            }
            
            try {
                let formData: any = null;
                
                // Helper function to convert age to DOB (DD/MM/YYYY format)
                const ageToDob = (age: number): string => {
                    const today = new Date();
                    const birthYear = today.getFullYear() - age;
                    return `15/03/${birthYear}`;
                };
                
                // Helper function to normalize size to enum format
                const normalizeSize = (size: string): string => {
                    const sizeMap: Record<string, string> = {
                        'small': 'S', 'medium': 'M', 'large': 'L',
                        'xlarge': 'XL', 'xxlarge': 'XXL',
                        's': 'S', 'm': 'M', 'l': 'L', 'xl': 'XL', 'xxl': 'XXL',
                    };
                    const normalized = size.toLowerCase().trim();
                    return sizeMap[normalized] || 'M';
                };
                
                // Get form data from selected person
                const selectedPerson = savedPersons.find(p => p.id === selectedPersonId);
                if (selectedPerson) {
                    // Calculate age from createdAt if needed, or use a default
                    const age = selectedPerson.createdAt ? Math.floor((Date.now() - selectedPerson.createdAt) / (1000 * 60 * 60 * 24 * 365)) : 30;
                    formData = {
                        personAge: age.toString(),
                        gender: selectedPerson.gender || "male",
                        relationship: selectedPerson.relationship || "friend",
                        interests: selectedPerson.interests || [],
                        favoritedrink: "beer", // Default if not stored
                        clothesSize: "medium", // Default if not stored
                        minBudget: selectedPerson.minBudget || 10,
                        maxBudget: selectedPerson.maxBudget || 50,
                        name: selectedPerson.name || "Friend",
                    };
                } else {
                    // No person selected - don't fetch
                    setIsLoadingAiPicks(false);
                    setAiPicksError("Please select a person to get recommendations.");
                    setAiPicks([]);
                    setIsRefreshing(false);
                    return;
                }
                
                const interests = formData.interests && formData.interests.length > 0 
                    ? formData.interests 
                    : ["General"];
                
                const age = parseInt(formData.personAge || "30");
                const dob = ageToDob(age);
                
                const requestData = {
                    context: {
                        name: formData.name || "Friend",
                        relationship: formData.relationship ? formData.relationship.charAt(0).toUpperCase() + formData.relationship.slice(1).toLowerCase() : "Friend",
                        gender: (formData.gender || "male").toLowerCase(),
                        dob: dob,
                        interests: interests,
                        budget_min: formData.minBudget || 10,
                        budget_max: formData.maxBudget || 50,
                        other: {
                            clothing_size: normalizeSize(formData.clothesSize || "medium"),
                            favourite_drink: (formData.favoritedrink || "beer").toLowerCase(),
                        },
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
                    const asins = data.products.map(p => p.asin).filter(Boolean);
                    
                    if (asins.length === 0) {
                        throw new Error("No valid ASINs in recommendations");
                    }
                    
                    try {
                        const productDetails = await getProductsByDocumentIds(asins);
                        
                        const transformedProducts: Product[] = data.products.map((product, index) => {
                            const details = productDetails[index];
                            const asin = product.asin || `ai-${index + 1}`;
                            const productData = details?.data || details;
                            
                            const productName = productData?.name 
                                || productData?.product_title 
                                || productData?.title 
                                || details?.name 
                                || details?.productTitle 
                                || `Product ${product.rank || index + 1}`;
                            
                            const firebaseProductPhotos = productData?.product_photos 
                                || productData?.data?.product_photos
                                || details?.product_photos
                                || details?.imageUrl;
                            const productImage = firebaseProductPhotos && (
                                Array.isArray(firebaseProductPhotos) && firebaseProductPhotos.length > 0
                                    ? firebaseProductPhotos[0]
                                    : typeof firebaseProductPhotos === 'string' 
                                        ? firebaseProductPhotos 
                                        : null
                            ) || `https://storage.googleapis.com/simplysent-product-images/${asin}/t_${asin}_1.png`;
                            
                            let productPrice = 0;
                            const priceValue = productData?.product_price 
                                || productData?.price 
                                || productData?.price_amount 
                                || productData?.current_price
                                || details?.product_price
                                || details?.price;
                            
                            if (priceValue !== undefined && priceValue !== null) {
                                if (typeof priceValue === 'string') {
                                    productPrice = parseFloat(priceValue.replace(/[£$€,]/g, '')) || 0;
                                } else if (typeof priceValue === 'number') {
                                    productPrice = priceValue;
                                }
                            }
                            
                            const rating = productData?.product_star_rating 
                                || productData?.rating
                                || details?.product_star_rating
                                || details?.rating;
                            const numRatings = productData?.product_num_ratings 
                                || productData?.num_ratings
                                || details?.product_num_ratings
                                || details?.num_ratings
                                || 0;
                            
                            return {
                                id: asin,
                                image: productImage,
                                name: productName,
                                price: productPrice,
                                rating: rating ? parseFloat(rating.toString()) : undefined,
                                numRatings: numRatings,
                            };
                        });
                        
                        setAiPicks(transformedProducts);
                        
                        // Save to cache
                        try {
                            localStorage.setItem(CACHE_KEY, JSON.stringify({
                                products: transformedProducts,
                                timestamp: Date.now(),
                                recommendationId: data.recommendation_id,
                            }));
                        } catch (error) {
                            console.warn("⚠️ PersonPage: Error saving to cache:", error);
                        }
                    } catch (firebaseError) {
                        console.error("❌ PersonPage: Firebase error:", firebaseError);
                        const transformedProducts: Product[] = data.products.map((product, index) => {
                            const asin = product.asin || `ai-${index + 1}`;
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
                setAiPicksError(getUserFriendlyErrorMessage(error));
                setAiPicks([]);
            } finally {
                setIsLoadingAiPicks(false);
                setIsRefreshing(false);
            }
        };
        
        fetchAiPicks();
    };
    
    // Load saved persons from localStorage and redirect if none exist
    useEffect(() => {
        // Clear all saved persons only on very first app load (before any person is added)
        // Check if this is the first time loading PersonPage in this session
        const hasClearedPersons = sessionStorage.getItem('persons_cleared_on_app_load');
        const isFirstLoad = !hasClearedPersons;
        
        if (isFirstLoad) {
            try {
                localStorage.removeItem('saved_persons');
                sessionStorage.setItem('persons_cleared_on_app_load', 'true');
            } catch (error) {
                console.warn('Error clearing saved persons:', error);
            }
        }

        let redirectTimeout: NodeJS.Timeout | null = null;
        let personFound = false;

        const loadPersons = () => {
            try {
                const stored = localStorage.getItem('saved_persons');
                if (stored) {
                    const persons = JSON.parse(stored);
                    if (persons.length > 0) {
                        personFound = true;
                        setSavedPersons(persons);
                        // Select the most recent person by default
                        if (!selectedPersonId) {
                            setSelectedPersonId(persons[persons.length - 1].id);
                        }
                        // Cancel any pending redirect
                        if (redirectTimeout) {
                            clearTimeout(redirectTimeout);
                            redirectTimeout = null;
                        }
                        return true; // Found persons
                    }
                }
                personFound = false;
                return false; // No persons found
            } catch (error) {
                console.warn('Error loading saved persons:', error);
                personFound = false;
                return false;
            }
        };

        // Listen for new person added FIRST (before checking)
        const handlePersonAdded = () => {
            console.log('Person added event received');
            loadPersons();
        };
        window.addEventListener('person-added', handlePersonAdded);

        // Load persons immediately
        loadPersons();

        // Only redirect if we have no persons AND this is not the first load
        // Use a longer timeout to allow person-added event to fire (in case coming from onboarding)
        if (!personFound && !isFirstLoad) {
            redirectTimeout = setTimeout(() => {
                // Final check before redirecting
                const stored = localStorage.getItem('saved_persons');
                const finalPersons = stored ? JSON.parse(stored) : [];
                if (finalPersons.length === 0) {
                    console.log('No persons found, redirecting to onboarding');
                    navigate("/");
                } else {
                    console.log('Persons found after timeout, loading them');
                    loadPersons();
                }
            }, 1500); // Longer timeout to ensure person is saved
        }

        return () => {
            window.removeEventListener('person-added', handlePersonAdded);
            if (redirectTimeout) {
                clearTimeout(redirectTimeout);
            }
        };
    }, [navigate, selectedPersonId]);

    // Load RapidAPI products from localStorage
    useEffect(() => {
        const loadRapidApiProducts = () => {
            try {
                const stored = localStorage.getItem('rapidapi_products');
                if (stored) {
                    const data = JSON.parse(stored);
                    if (data.products && Array.isArray(data.products)) {
                        setRapidApiProducts(data.products);
                    }
                }
            } catch (error) {
                console.warn('Error loading RapidAPI products:', error);
            }
        };

        loadRapidApiProducts();

        // Listen for updates from DevModeIndicator
        const handleUpdate = () => {
            loadRapidApiProducts();
        };
        window.addEventListener('rapidapi-products-updated', handleUpdate);
        return () => {
            window.removeEventListener('rapidapi-products-updated', handleUpdate);
        };
    }, []);

    // Fetch products for each interest when a person is selected
    useEffect(() => {
        if (!selectedPersonId) return;
        
        const selectedPerson = savedPersons.find(p => p.id === selectedPersonId);
        if (!selectedPerson || !selectedPerson.interests || selectedPerson.interests.length === 0) return;

        const fetchInterestProducts = async (interest: string) => {
            setLoadingInterests(prev => ({ ...prev, [interest]: true }));
            
            try {
                const queryParams = new URLSearchParams();
                queryParams.append('interest', interest);
                queryParams.append('limit', '20');
                queryParams.append('offset', '0');
                queryParams.append('collection', 'amazon');

                const mode = getCurrentMode();
                const apiUrl = buildApiUrl('/products', queryParams);
                const headers = getApiHeaders(mode || undefined);

                const response = await apiFetch(
                    apiUrl,
                    {
                        method: 'GET',
                        headers,
                    },
                    `GET /products?interest=${interest}`,
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: any[] = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    const transformedProducts: Product[] = data.map((product) => {
                        let price = 0;
                        if (product.price_numeric !== undefined && product.price_numeric !== null) {
                            price = typeof product.price_numeric === 'number' ? product.price_numeric : parseFloat(product.price_numeric.toString()) || 0;
                        } else if (product.product_price) {
                            const priceStr = product.product_price.toString().replace(/[£$€,]/g, '');
                            price = parseFloat(priceStr) || 0;
                        }

                        let rating: number | undefined = undefined;
                        if (product.rating_numeric !== undefined && product.rating_numeric !== null) {
                            rating = typeof product.rating_numeric === 'number' ? product.rating_numeric : parseFloat(product.rating_numeric.toString());
                        } else if (product.product_star_rating) {
                            rating = parseFloat(product.product_star_rating.toString());
                        }

                        const numRatings = product.num_ratings_numeric !== undefined && product.num_ratings_numeric !== null
                            ? (typeof product.num_ratings_numeric === 'number' ? product.num_ratings_numeric : parseInt(product.num_ratings_numeric.toString()) || 0)
                            : (product.product_num_ratings || 0);

                        return {
                            id: product.asin || `${interest}-${Math.random().toString(36).substr(2, 9)}`,
                            image: product.product_photo || '',
                            name: product.product_title || 'Unknown Product',
                            price: price,
                            rating: rating,
                            numRatings: numRatings,
                        };
                    });

                    setInterestProducts(prev => ({ ...prev, [interest]: transformedProducts }));
                } else {
                    setInterestProducts(prev => ({ ...prev, [interest]: [] }));
                }
            } catch (error) {
                console.error(`Error fetching products for interest ${interest}:`, error);
                setInterestProducts(prev => ({ ...prev, [interest]: [] }));
            } finally {
                setLoadingInterests(prev => ({ ...prev, [interest]: false }));
            }
        };

        // Fetch products for all interests
        selectedPerson.interests.forEach(interest => {
            if (!interestProducts[interest] && !loadingInterests[interest]) {
                fetchInterestProducts(interest);
            }
        });
    }, [selectedPersonId, savedPersons]);

    // Fetch tech products from /products endpoint
    useEffect(() => {
        const fetchTechProducts = async () => {
            setIsLoadingTechProducts(true);
            setTechProductsError(null);

            try {
                const queryParams = new URLSearchParams();
                queryParams.append('interest', 'tech');
                queryParams.append('limit', '50');
                queryParams.append('offset', '0');
                queryParams.append('collection', 'amazon');

                const mode = getCurrentMode();
                const apiUrl = buildApiUrl('/products', queryParams);
                const headers = getApiHeaders(mode || undefined);

                console.log('Fetching tech products from:', apiUrl);

                const response = await apiFetch(
                    apiUrl,
                    {
                        method: 'GET',
                        headers,
                    },
                    'GET /products',
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: any[] = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    // Transform API response to Product format
                    const transformedProducts: Product[] = data.map((product) => {
                        // Extract price - prefer price_numeric, fallback to parsing product_price string
                        let price = 0;
                        if (product.price_numeric !== undefined && product.price_numeric !== null) {
                            price = typeof product.price_numeric === 'number' ? product.price_numeric : parseFloat(product.price_numeric.toString()) || 0;
                        } else if (product.product_price) {
                            const priceStr = product.product_price.toString().replace(/[£$€,]/g, '');
                            price = parseFloat(priceStr) || 0;
                        }

                        // Extract rating - prefer rating_numeric, fallback to product_star_rating
                        let rating: number | undefined = undefined;
                        if (product.rating_numeric !== undefined && product.rating_numeric !== null) {
                            rating = typeof product.rating_numeric === 'number' ? product.rating_numeric : parseFloat(product.rating_numeric.toString());
                        } else if (product.product_star_rating) {
                            rating = parseFloat(product.product_star_rating.toString());
                        }

                        // Extract num ratings - prefer num_ratings_numeric, fallback to product_num_ratings
                        const numRatings = product.num_ratings_numeric !== undefined && product.num_ratings_numeric !== null
                            ? (typeof product.num_ratings_numeric === 'number' ? product.num_ratings_numeric : parseInt(product.num_ratings_numeric.toString()) || 0)
                            : (product.product_num_ratings || 0);

                        return {
                            id: product.asin || `tech-${Math.random().toString(36).substr(2, 9)}`,
                            image: product.product_photo || '',
                            name: product.product_title || 'Unknown Product',
                            price: price,
                            rating: rating,
                            numRatings: numRatings,
                        };
                    });

                    console.log('✅ Tech products loaded:', transformedProducts.length);
                    setTechProducts(transformedProducts);
                } else {
                    throw new Error('No products received from API');
                }
            } catch (error) {
                console.error('Error fetching tech products:', error);
                setTechProductsError(getUserFriendlyErrorMessage(error));
                // Fallback to empty array on error
                setTechProducts([]);
            } finally {
                setIsLoadingTechProducts(false);
            }
        };

        fetchTechProducts();
    }, []);

    // Sort RapidAPI products based on sort order
    const sortedRapidApiProducts = useMemo(() => {
        if (!rapidApiSortOrder) {
            return rapidApiProducts;
        }
        const sorted = [...rapidApiProducts];
        if (rapidApiSortOrder === 'highest') {
            return sorted.sort((a, b) => b.price - a.price);
        } else {
            return sorted.sort((a, b) => a.price - b.price);
        }
    }, [rapidApiProducts, rapidApiSortOrder]);

    // Sort tech products based on sort order
    const sortedTechProducts = useMemo(() => {
        if (!techSortOrder) {
            return techProducts;
        }
        const sorted = [...techProducts];
        if (techSortOrder === 'highest') {
            return sorted.sort((a, b) => b.price - a.price);
        } else {
            return sorted.sort((a, b) => a.price - b.price);
        }
    }, [techProducts, techSortOrder]);

    // Get AI Picks product IDs to filter from other carousels
    const aiPicksProductIds = useMemo(() => {
        return new Set(aiPicks.map(p => p.id));
    }, [aiPicks]);

    const productsByTab: Record<string, Product[]> = useMemo(
        () => ({
            "ai-picks": aiPicks, // Use real API data, never fallback to fake products
            "rapidapi": sortedRapidApiProducts.filter(p => !aiPicksProductIds.has(p.id)), // Filter out AI Picks products
            tech: sortedTechProducts.filter(p => !aiPicksProductIds.has(p.id)), // Filter out AI Picks products
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
            ].filter(p => !aiPicksProductIds.has(p.id)), // Filter out AI Picks products
        }),
        [aiPicks, sortedRapidApiProducts, sortedTechProducts, aiPicksProductIds],
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
        // Save scroll position before navigating
        const carouselElement = aiPicksCarouselRef.current || 
            (document.querySelector('[data-carousel="ai-picks"]') as HTMLDivElement);
        
        if (carouselElement) {
            const scrollPosition = carouselElement.scrollLeft;
            console.log(`💾 PersonPage: Saving scroll position: ${scrollPosition}`, {
                element: carouselElement,
                scrollLeft: carouselElement.scrollLeft,
                scrollWidth: carouselElement.scrollWidth,
                clientWidth: carouselElement.clientWidth
            });
            try {
                localStorage.setItem(SCROLL_POSITION_KEY, scrollPosition.toString());
                // Set flag to indicate we're navigating to ProductPage (not refreshing)
                sessionStorage.setItem(NAVIGATION_FLAG_KEY, 'true');
                console.log(`✅ PersonPage: Saved carousel scroll position: ${scrollPosition}`);
            } catch (error) {
                console.warn("⚠️ PersonPage: Error saving scroll position:", error);
            }
        } else {
            console.warn("⚠️ PersonPage: Could not find carousel element to save scroll position");
        }
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
    
    // Restore scroll position synchronously before browser paints
    useLayoutEffect(() => {
        if (aiPicks.length === 0 || isLoadingAiPicks || hasRestoredScroll.current) return;
        
        const navigatedFromProduct = sessionStorage.getItem(NAVIGATION_FLAG_KEY) === 'true';
        
        if (!navigatedFromProduct) {
            // Page refresh - clear scroll position
            try {
                localStorage.removeItem(SCROLL_POSITION_KEY);
                sessionStorage.removeItem(NAVIGATION_FLAG_KEY);
            } catch (error) {
                // Ignore errors
            }
            hasRestoredScroll.current = false;
            return;
        }
        
        const carouselElement = aiPicksCarouselRef.current;
        if (!carouselElement) return;
        
        try {
            const savedScrollPosition = localStorage.getItem(SCROLL_POSITION_KEY);
            if (savedScrollPosition) {
                const scrollPosition = parseInt(savedScrollPosition, 10);
                if (!isNaN(scrollPosition) && scrollPosition > 0) {
                    // Hide visually but keep layout (allows scroll to work)
                    const originalVisibility = carouselElement.style.visibility;
                    const originalOpacity = carouselElement.style.opacity;
                    carouselElement.style.visibility = 'hidden';
                    carouselElement.style.opacity = '0';
                    
                    // Disable all transitions on carousel and children
                    const transitionElements = carouselElement.querySelectorAll('*');
                    const originalTransitions: Array<{ element: HTMLElement; transition: string }> = [];
                    transitionElements.forEach((el) => {
                        if (el instanceof HTMLElement) {
                            originalTransitions.push({
                                element: el,
                                transition: el.style.transition
                            });
                            el.style.transition = 'none';
                        }
                    });
                    
                    // Also disable transition on carousel itself
                    const carouselTransition = carouselElement.style.transition;
                    carouselElement.style.transition = 'none';
                    
                    // Set scroll position synchronously
                    carouselElement.scrollLeft = scrollPosition;
                    
                    // Force reflow to ensure scroll is applied
                    void carouselElement.offsetHeight;
                    
                    // Restore visibility and transitions in next frame
                    requestAnimationFrame(() => {
                        carouselElement.style.visibility = originalVisibility || '';
                        carouselElement.style.opacity = originalOpacity || '';
                        carouselElement.style.transition = carouselTransition || '';
                        
                        originalTransitions.forEach(({ element, transition }) => {
                            element.style.transition = transition || '';
                        });
                        
                        sessionStorage.removeItem(NAVIGATION_FLAG_KEY);
                        hasRestoredScroll.current = true;
                    });
                }
            }
        } catch (error) {
            console.warn("⚠️ PersonPage: Error restoring scroll:", error);
        }
    }, [aiPicks, isLoadingAiPicks]);
    
    // Reset scroll restoration flag when products change (new fetch)
    useEffect(() => {
        // Only reset if we're not using cache (new fetch happened)
        if (!isUsingCache.current) {
            hasRestoredScroll.current = false;
        }
    }, [aiPicks.length]);


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
                                    {selectedPersonId ? savedPersons.find(p => p.id === selectedPersonId)?.name || 'Kevin' : 'Kevin'}
                                </span>
                            </button>

                            {isMenuOpen && (
                                <div className="absolute left-0 mt-2 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-200 z-50 min-w-[120px] overflow-hidden max-h-[400px] overflow-y-auto">
                                    {savedPersons.map((person) => (
                                    <button
                                            key={person.id}
                                        type="button"
                                        onClick={() => {
                                                setSelectedPersonId(person.id);
                                            setIsMenuOpen(false);
                                        }}
                                            className={`block w-full pl-5 pr-4 py-2.5 font-semibold transition-colors text-left text-gray-800 hover:bg-purple-50 ${
                                                selectedPersonId === person.id ? 'bg-purple-50' : ''
                                            }`}
                                    >
                                            {person.name}
                                    </button>
                                    ))}
                                    {savedPersons.length === 0 && (
                                        <div className="px-5 py-2.5 text-sm text-gray-500">
                                            No persons added yet
                                        </div>
                                    )}
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
                                        AI Picks For {selectedPersonId ? savedPersons.find(p => p.id === selectedPersonId)?.name || 'Kevin' : 'Kevin'}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleRefresh}
                                            disabled={isRefreshing || isLoadingAiPicks}
                                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Refresh recommendations"
                                        >
                                            <FontAwesomeIcon
                                                icon={faRotateRight}
                                                className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`}
                                            />
                                        </button>
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
                                                Unable to load recommendations
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                {aiPicksError}
                                            </p>
                                        </div>
                                    </div>
                                ) : productsByTab["ai-picks"]?.filter(
                                    (p) => !removedProducts.has(p.id),
                                ).length === 0 ? (
                                    <div className="mt-[10px] flex items-center justify-center" style={{ minHeight: "311px" }}>
                                        <div className="text-center px-4">
                                            {/* Empty state graphic circle */}
                                            <div className="relative mx-auto mb-6 w-20 h-20">
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-100 to-purple-50" />
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
                                    <div 
                                        ref={aiPicksCarouselRef}
                                        data-carousel="ai-picks"
                                        className="overflow-x-auto no-scrollbar -mx-4 px-4 pt-3 pb-12 mt-[10px]"
                                    >
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

                            {/* Interest-based Carousels */}
                            {selectedPersonId && savedPersons.find(p => p.id === selectedPersonId)?.interests.map((interest) => {
                                const products = interestProducts[interest] || [];
                                const isLoading = loadingInterests[interest] || false;
                                
                                if (isLoading && products.length === 0) {
                                    return (
                                        <div key={interest} className="mt-[10px]">
                                <div className="flex items-center gap-3 mb-0">
                                    <h2 className="text-[22px] font-medium font-headline text-simplysent-grey-heading">
                                                    {getInterestLabel(interest)}
                                    </h2>
                                </div>
                                            <div className="mt-[10px] flex items-center justify-center" style={{ minHeight: "200px" }}>
                                                <div className="text-center px-4">
                                                    <div className="relative mx-auto mb-4 w-12 h-12">
                                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 animate-pulse" />
                                                        <div className="absolute inset-1 rounded-full bg-white" />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-simplysent-purple animate-spin" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                        </div>
                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                
                                if (products.length === 0) return null;
                                
                                return (
                                    <div key={interest} className="mt-[10px]">
                                        <div className="flex items-center gap-3 mb-0">
                                            <h2 className="text-[22px] font-medium font-headline text-simplysent-grey-heading">
                                                {getInterestLabel(interest)}
                                            </h2>
                                        </div>
                                    <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pt-3 pb-8 mt-[10px]">
                                        <div className="flex gap-4 transition-all duration-1000">
                                                {products
                                                    .filter((p) => !removedProducts.has(p.id) && !aiPicksProductIds.has(p.id))
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
                                                                isFavorite={favourites.has(p.id)}
                                                                onFavoriteToggle={() => toggleFavourite(p.id)}
                                                                onRemove={handleProductRemove}
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                            </div>
                                );
                            })}

                            {/* RapidAPI Carousel */}
                            {rapidApiProducts.length > 0 && (
                            <div className="mt-[10px]">
                                    <div className="flex items-center justify-between gap-3 mb-0">
                                    <h2 className="text-[22px] font-medium font-headline text-simplysent-grey-heading">
                                            From RapidAPI
                                    </h2>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setRapidApiSortOrder('highest')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                    rapidApiSortOrder === 'highest'
                                                        ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                                                }`}
                                                aria-label="Sort by highest price"
                                            >
                                                <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                                                <span>Highest</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRapidApiSortOrder('lowest')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                    rapidApiSortOrder === 'lowest'
                                                        ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                                                }`}
                                                aria-label="Sort by lowest price"
                                            >
                                                <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" />
                                                <span>Lowest</span>
                                            </button>
                                </div>
                                    </div>
                                    {productsByTab["rapidapi"]?.filter(
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
                                                {productsByTab["rapidapi"]
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
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            )}

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

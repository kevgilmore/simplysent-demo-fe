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
    faDollarSign,
    faTags,
} from "@fortawesome/free-solid-svg-icons";
import { ProductCard } from "../components/ui/ProductCard";
import { Button } from "../components/ui/Button";
import { RangeSlider } from "../components/ui/RangeSlider";
import { BudgetSheet } from "../components/sheets/BudgetSheet";
import { InterestsSheet } from "../components/sheets/InterestsSheet";
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
// Firebase removed - all data now comes from /recommend and /products endpoints
import { menInterests, womenInterests, boysInterests, girlsInterests, normalizeInterestsForAPI, getInterestLabelForAPI } from "../components/sheets/formConstants";

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

// Lorem ipsum description (200 words) - always the same
const PRODUCT_DESCRIPTION = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.";

interface ApiResponse {
    recommendation_id: string;
    products: Array<{
        asin: string;
        rank: number;
        product_title?: string;
        product_price?: string;
        price_numeric?: number;
        product_photo?: string;
        rating_numeric?: number;
        num_ratings_numeric?: number;
        product_num_ratings?: number;
        [key: string]: any; // Allow additional fields from API
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
    const [isBudgetSheetOpen, setIsBudgetSheetOpen] = useState(false);
    const [isInterestsSheetOpen, setIsInterestsSheetOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<'highest' | 'lowest' | null>(null);
    const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [aiPicks, setAiPicks] = useState<Product[]>([]);
    const [isLoadingAiPicks, setIsLoadingAiPicks] = useState(true);
    const [aiPicksError, setAiPicksError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [rapidApiProducts, setRapidApiProducts] = useState<Product[]>([]);
    const [rapidApiSortOrder, setRapidApiSortOrder] = useState<'highest' | 'lowest' | null>(null);
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
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger to force refetch of interest products
    
    const CACHE_KEY = 'person_page_ai_picks_cache';
    const INTEREST_PRODUCTS_CACHE_KEY = 'person_page_interest_products_cache';
    const SCROLL_POSITION_KEY = 'person_page_carousel_scroll';
    const NAVIGATION_FLAG_KEY = 'person_page_navigated_from_product';
    const aiPicksCarouselRef = useRef<HTMLDivElement>(null);
    const hasRestoredScroll = useRef(false);
    const isUsingCache = useRef(false);
    const isFetchingRef = useRef(false);
    const lastFetchedPersonIdRef = useRef<string | null>(null);
    const lastProcessedPersonRef = useRef<string | null>(null);

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
        description?: string; // Added for consistency
    };
    
    
    // Fetch AI picks when a person is selected (not on page load)
    useEffect(() => {
        if (!selectedPersonId) {
            // No person selected, don't fetch
            setIsLoadingAiPicks(false);
            lastFetchedPersonIdRef.current = null; // Reset when no person selected
            isFetchingRef.current = false; // Reset fetching flag
            return;
        }

        // Check if person exists in savedPersons - if not, wait for it to be loaded
        const selectedPerson = savedPersons.find(p => p.id === selectedPersonId);
        if (!selectedPerson) {
            console.log("⏸️ PersonPage: Person not found in savedPersons yet, waiting...");
            isFetchingRef.current = false; // Reset fetching flag since we're not fetching
            return; // Wait for person to be loaded
        }

        // Create a unique key for this person+data combination to prevent duplicate processing
        const personKey = `${selectedPersonId}-${savedPersons.length}`;
        
        // If we've already processed this exact person with this exact data, skip
        if (lastProcessedPersonRef.current === personKey) {
            console.log("⏸️ PersonPage: Already processed this person with current data, skipping");
            return;
        }

        // Prevent multiple simultaneous calls
        if (isFetchingRef.current) {
            console.log("⏸️ PersonPage: Already fetching, skipping duplicate call");
            return;
        }
        
        // Don't fetch again if we already fetched for this person (check immediately)
        if (lastFetchedPersonIdRef.current === selectedPersonId) {
            console.log("⏸️ PersonPage: Already fetched for this person, skipping duplicate call");
            lastProcessedPersonRef.current = personKey; // Mark as processed
            return;
        }
        
        // Mark as fetching and processing immediately to prevent duplicate calls
        isFetchingRef.current = true;
        lastFetchedPersonIdRef.current = selectedPersonId;
        lastProcessedPersonRef.current = personKey;

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
        
        // Check cache synchronously first - if cache exists and matches current person, use it immediately
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const cachedData = JSON.parse(cached);
                // Check if cache is for the same person and less than 1 hour old
                const cacheAge = Date.now() - (cachedData.timestamp || 0);
                const oneHour = 60 * 60 * 1000;
                const cacheMatchesPerson = cachedData.personId === selectedPersonId;
                
                if (cacheMatchesPerson && cacheAge < oneHour && cachedData.products && cachedData.products.length > 0) {
                    console.log("📦 PersonPage: Using cached AI picks (browser refresh or navigation back)");
                    isUsingCache.current = true;
                    lastFetchedPersonIdRef.current = selectedPersonId; // Mark as fetched even when using cache
                    lastProcessedPersonRef.current = `${selectedPersonId}-${savedPersons.length}`; // Mark as processed
                    isFetchingRef.current = false; // Reset fetching flag
                    setAiPicks(cachedData.products);
                    setIsLoadingAiPicks(false);
                    setAiPicksError(null);
                    return; // Exit early, don't make API call
                } else if (!cacheMatchesPerson) {
                    console.log("📦 PersonPage: Cache is for different person, will fetch fresh data");
                } else if (cacheAge >= oneHour) {
                    console.log("📦 PersonPage: Cache expired, will fetch fresh data");
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
                const rawInterests = formData.interests && formData.interests.length > 0 
                    ? formData.interests 
                    : ["General"];
                
                // Normalize interests to API format (no dashes, proper capitalization)
                const interests = normalizeInterestsForAPI(rawInterests);
                
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
                    // Transform products directly from API response (no Firebase needed)
                    const transformedProducts: Product[] = data.products.map((product) => {
                        const asin = product.asin || `ai-${product.rank || Math.random().toString(36).substr(2, 9)}`;
                        
                        // Extract name from API response
                        const productName = product.product_title || `Product ${product.rank || 'Unknown'}`;
                        
                        // Extract image from API response
                        const productImage = product.product_photo 
                            || `https://storage.googleapis.com/simplysent-product-images/${asin}/t_${asin}_1.png`;
                        
                        // Extract price - prefer price_numeric, fallback to parsing product_price string
                            let productPrice = 0;
                        if (product.price_numeric !== undefined && product.price_numeric !== null) {
                            productPrice = typeof product.price_numeric === 'number' ? product.price_numeric : parseFloat(String(product.price_numeric)) || 0;
                        } else if (product.product_price) {
                            const priceStr = String(product.product_price).replace(/[£$€,]/g, '');
                            productPrice = parseFloat(priceStr) || 0;
                        }
                        
                        // Extract rating - use rating_numeric from API
                        let parsedRating: number | undefined = undefined;
                        if (product.rating_numeric !== undefined && product.rating_numeric !== null) {
                            const ratingNum = typeof product.rating_numeric === 'number' ? product.rating_numeric : parseFloat(String(product.rating_numeric));
                            if (!isNaN(ratingNum) && ratingNum > 0 && ratingNum <= 5) {
                                parsedRating = ratingNum;
                            }
                        }
                        
                        // Extract num ratings - prefer num_ratings_numeric
                        const numRatings = product.num_ratings_numeric !== undefined && product.num_ratings_numeric !== null
                            ? (typeof product.num_ratings_numeric === 'number' ? product.num_ratings_numeric : parseInt(String(product.num_ratings_numeric)) || 0)
                            : (product.product_num_ratings || 0);
                            
                            console.log(`📦 Product ${asin}:`, { 
                                name: productName, 
                                image: productImage, 
                                price: productPrice,
                            rating: parsedRating,
                                numRatings: numRatings
                            });
                            
                            return {
                                id: asin,
                                image: productImage,
                                name: productName,
                                price: productPrice,
                            rating: parsedRating,
                                numRatings: numRatings,
                            description: PRODUCT_DESCRIPTION,
                            };
                        });
                        
                    console.log("✅ PersonPage: Transformed products from API:", transformedProducts);
                    
                    // Mark this person as fetched and processed
                    lastFetchedPersonIdRef.current = selectedPersonId;
                    lastProcessedPersonRef.current = `${selectedPersonId}-${savedPersons.length}`;
                    
                    // Save to cache with person ID
                    try {
                        localStorage.setItem(CACHE_KEY, JSON.stringify({
                            products: transformedProducts,
                            timestamp: Date.now(),
                            recommendationId: data.recommendation_id,
                            personId: selectedPersonId,
                        }));
                        console.log("💾 PersonPage: Saved AI picks to cache");
                    } catch (error) {
                        console.warn("⚠️ PersonPage: Error saving to cache:", error);
                    }
                    
                        setAiPicks(transformedProducts);
                } else {
                    throw new Error("No product recommendations received");
                }
            } catch (error) {
                console.error("Error fetching AI picks:", error);
                setAiPicksError(getUserFriendlyErrorMessage(error));
                // Never use fallback fake products for AI picks - leave empty
                setAiPicks([]);
                // Mark as processed even on error to prevent infinite retries
                lastProcessedPersonRef.current = `${selectedPersonId}-${savedPersons.length}`;
            } finally {
                setIsLoadingAiPicks(false);
                setIsRefreshing(false);
                isFetchingRef.current = false;
            }
        };
        
        // Only fetch if we didn't use cache
        fetchAiPicks();
    }, [selectedPersonId, savedPersons.length]); // Include savedPersons.length so effect runs when person data is available
    
    
    // Handle refresh button click
    const handleRefresh = () => {
        setIsRefreshing(true);
        // Clear both caches and reset fetch tracking
        try {
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(INTEREST_PRODUCTS_CACHE_KEY);
            console.log("🔄 PersonPage: Cleared all caches for refresh");
        } catch (error) {
            console.warn("⚠️ PersonPage: Error clearing cache:", error);
        }
        
        // Reset fetch tracking to allow new fetch
        isFetchingRef.current = false;
        lastFetchedPersonIdRef.current = null;
        
        // Clear interest products state to trigger refetch
        setInterestProducts({});
        fetchingInterestsRef.current.clear();
        
        // Force refetch AI picks by clearing the cache check
        isUsingCache.current = false;
        
        // Trigger interest products refetch by incrementing refresh trigger
        setRefreshTrigger(prev => prev + 1);
        
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
                
                const rawInterests = formData.interests && formData.interests.length > 0 
                    ? formData.interests 
                    : ["General"];
                
                // Normalize interests to API format (no dashes, proper capitalization)
                const interests = normalizeInterestsForAPI(rawInterests);
                
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
                    // Transform products directly from API response (no Firebase needed)
                    const transformedProducts: Product[] = data.products.map((product) => {
                        const asin = product.asin || `ai-${product.rank || Math.random().toString(36).substr(2, 9)}`;
                        
                        // Extract name from API response
                        const productName = product.product_title || `Product ${product.rank || 'Unknown'}`;
                        
                        // Extract image from API response
                        const productImage = product.product_photo 
                            || `https://storage.googleapis.com/simplysent-product-images/${asin}/t_${asin}_1.png`;
                        
                        // Extract price - prefer price_numeric, fallback to parsing product_price string
                        let productPrice = 0;
                        if (product.price_numeric !== undefined && product.price_numeric !== null) {
                            productPrice = typeof product.price_numeric === 'number' ? product.price_numeric : parseFloat(String(product.price_numeric)) || 0;
                        } else if (product.product_price) {
                            const priceStr = String(product.product_price).replace(/[£$€,]/g, '');
                            productPrice = parseFloat(priceStr) || 0;
                        }
                        
                        // Extract rating - use rating_numeric from API
                        let parsedRating: number | undefined = undefined;
                        if (product.rating_numeric !== undefined && product.rating_numeric !== null) {
                            const ratingNum = typeof product.rating_numeric === 'number' ? product.rating_numeric : parseFloat(String(product.rating_numeric));
                            if (!isNaN(ratingNum) && ratingNum > 0 && ratingNum <= 5) {
                                parsedRating = ratingNum;
                            }
                        }
                        
                        // Extract num ratings - prefer num_ratings_numeric
                        const numRatings = product.num_ratings_numeric !== undefined && product.num_ratings_numeric !== null
                            ? (typeof product.num_ratings_numeric === 'number' ? product.num_ratings_numeric : parseInt(String(product.num_ratings_numeric)) || 0)
                            : (product.product_num_ratings || 0);
                        
                            return {
                                id: asin,
                                image: productImage,
                            name: productName,
                            price: productPrice,
                            rating: parsedRating,
                            numRatings: numRatings,
                            description: PRODUCT_DESCRIPTION,
                            };
                        });
                    
                        setAiPicks(transformedProducts);
                    
                    // Save to cache with person ID
                    try {
                        localStorage.setItem(CACHE_KEY, JSON.stringify({
                            products: transformedProducts,
                            timestamp: Date.now(),
                            recommendationId: data.recommendation_id,
                            personId: selectedPersonId,
                        }));
                        console.log("💾 PersonPage: Saved AI picks to cache (refresh)");
                    } catch (error) {
                        console.warn("⚠️ PersonPage: Error saving to cache:", error);
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
        
        // Check if we're navigating from onboarding
        const navigatingFromOnboarding = sessionStorage.getItem('navigating_from_onboarding') === 'true';
        
        if (isFirstLoad) {
            try {
                localStorage.removeItem('saved_persons');
                sessionStorage.setItem('persons_cleared_on_app_load', 'true');
            } catch (error) {
                console.warn('Error clearing saved persons:', error);
            }
        }

        const redirectTimeoutRef = { current: null as NodeJS.Timeout | null };
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
                        if (redirectTimeoutRef.current) {
                            clearTimeout(redirectTimeoutRef.current);
                            redirectTimeoutRef.current = null;
                        }
                        // Clear the navigating flag since we found persons
                        if (navigatingFromOnboarding) {
                            sessionStorage.removeItem('navigating_from_onboarding');
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
            // Cancel any pending redirect immediately
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
                redirectTimeoutRef.current = null;
            }
            // Clear the navigating flag
            sessionStorage.removeItem('navigating_from_onboarding');
            // Small delay to ensure localStorage is written
            setTimeout(() => {
                loadPersons();
            }, 100);
        };
        window.addEventListener('person-added', handlePersonAdded);

        // Load persons immediately
        loadPersons();

        // If coming from onboarding, don't set up redirect - wait for person-added event
        // Clear the flag after a short delay to allow person to be loaded
        if (navigatingFromOnboarding) {
            setTimeout(() => {
                sessionStorage.removeItem('navigating_from_onboarding');
            }, 1000);
        }

        // Only redirect if we have no persons AND this is not the first load AND we're not coming from onboarding
        if (!personFound && !isFirstLoad && !navigatingFromOnboarding) {
            redirectTimeoutRef.current = setTimeout(() => {
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
                redirectTimeoutRef.current = null;
            }, 2000); // Increased timeout to ensure person is saved
        }

        return () => {
            window.removeEventListener('person-added', handlePersonAdded);
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
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
    
    // Track which interests are currently being fetched to prevent duplicates
    const fetchingInterestsRef = useRef<Set<string>>(new Set());

    // Get selected person's interests as a memoized value
    const selectedPersonInterests = useMemo(() => {
        if (!selectedPersonId) return [];
        const selectedPerson = savedPersons.find(p => p.id === selectedPersonId);
        return selectedPerson?.interests || [];
    }, [selectedPersonId, savedPersons]);

    // Fetch products for each interest when a person is selected
    useEffect(() => {
        if (!selectedPersonId || selectedPersonInterests.length === 0) return;

        const fetchInterestProducts = async (interest: string) => {
            // Prevent duplicate calls for the same interest
            if (fetchingInterestsRef.current.has(interest)) {
                console.log(`⏸️ PersonPage: Already fetching products for interest "${interest}", skipping duplicate call`);
                return;
            }
            
            // Check cache first for this interest
            try {
                const cached = localStorage.getItem(INTEREST_PRODUCTS_CACHE_KEY);
                if (cached) {
                    const cachedData = JSON.parse(cached);
                    const cacheKey = `${selectedPersonId}_${interest}`;
                    const cachedInterestData = cachedData[cacheKey];
                    
                    if (cachedInterestData) {
                        const cacheAge = Date.now() - (cachedInterestData.timestamp || 0);
                        const oneHour = 60 * 60 * 1000;
                        
                        if (cacheAge < oneHour && cachedInterestData.products && cachedInterestData.products.length > 0) {
                            // Use cached products directly (don't filter AI picks - we want 40 products regardless)
                            // If we have less than 40, don't use cache - fetch fresh
                            if (cachedInterestData.products.length < 40) {
                                console.log(`📦 PersonPage: Cached products for "${interest}" have ${cachedInterestData.products.length}, fetching fresh`);
                                // Continue to fetch fresh products
                            } else {
                                console.log(`📦 PersonPage: Using cached products for interest "${interest}"`);
                                // Store ALL cached products (not just 40) - sortedInterestProducts will display only first 40
                                setInterestProducts(prev => ({ ...prev, [interest]: cachedInterestData.products }));
                                setLoadingInterests(prev => ({ ...prev, [interest]: false }));
                                return; // Use cache, skip API call
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn(`⚠️ PersonPage: Error reading cache for interest "${interest}", fetching fresh data:`, error);
            }
            
            // Mark as fetching
            fetchingInterestsRef.current.add(interest);
            setLoadingInterests(prev => ({ ...prev, [interest]: true }));
            
            try {
                const queryParams = new URLSearchParams();
                // Normalize interest to API format (no dashes, proper capitalization like "Home Decor" not "home-decor")
                const normalizedInterest = getInterestLabelForAPI(interest);
                queryParams.append('interest', normalizedInterest);
                // Fetch more products initially to account for filtering (we want 40 visible, so fetch 60-80 to be safe)
                queryParams.append('limit', '80');
                queryParams.append('offset', '0');
                queryParams.append('collection', 'amazon');

                const mode = getCurrentMode();
                const apiUrl = buildApiUrl('/products', queryParams);
                const headers = getApiHeaders(mode || undefined);

                console.log(`📦 PersonPage: Fetching products for interest "${normalizedInterest}" (normalized from "${interest}") from:`, apiUrl);

                const response = await apiFetch(
                    apiUrl,
                    {
                        method: 'GET',
                        headers,
                    },
                                `GET /products?interest=${normalizedInterest}`,
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`❌ PersonPage: API error for interest "${interest}":`, response.status, errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseData: { products?: any[] } = await response.json();
                const data = responseData.products || [];
                
                console.log(`📦 PersonPage: Received ${Array.isArray(data) ? data.length : 0} products for interest "${interest}"`);

                if (Array.isArray(data) && data.length > 0) {
                    const transformedProducts: Product[] = data.map((product) => {
                        let price = 0;
                        if (product.price_numeric !== undefined && product.price_numeric !== null) {
                            price = typeof product.price_numeric === 'number' ? product.price_numeric : parseFloat(product.price_numeric.toString()) || 0;
                        } else if (product.product_price) {
                            const priceStr = product.product_price.toString().replace(/[£$€,]/g, '');
                            price = parseFloat(priceStr) || 0;
                        }

                        // Use rating_numeric (new API spec) - deprecated product_star_rating is no longer used
                        let rating: number | undefined = undefined;
                        if (product.rating_numeric !== undefined && product.rating_numeric !== null) {
                            const ratingNum = typeof product.rating_numeric === 'number' ? product.rating_numeric : parseFloat(product.rating_numeric.toString());
                            if (!isNaN(ratingNum) && ratingNum > 0 && ratingNum <= 5) {
                                rating = ratingNum;
                            }
                        }

                        // Use num_ratings_numeric (new API spec) - deprecated product_num_ratings is no longer used
                        const numRatings = product.num_ratings_numeric !== undefined && product.num_ratings_numeric !== null
                            ? (typeof product.num_ratings_numeric === 'number' ? product.num_ratings_numeric : parseInt(product.num_ratings_numeric.toString()) || 0)
                            : 0;

                        return {
                            id: product.asin || `${interest}-${Math.random().toString(36).substr(2, 9)}`,
                            image: product.product_photo || '',
                            name: product.product_title || 'Unknown Product',
                            price: price,
                            rating: rating,
                            numRatings: numRatings,
                            description: PRODUCT_DESCRIPTION,
                        };
                    });

                    // Store all products (don't filter AI picks - we want 40 products regardless of overlap)
                    let allProducts = transformedProducts;
                    
                    // Keep fetching until we have 40 products (or run out of products)
                    let offset = 80;
                    while (allProducts.length < 40 && offset < 500) {
                        const additionalQueryParams = new URLSearchParams();
                        // Normalize interest to API format (no dashes, proper capitalization)
                        const normalizedInterest = getInterestLabelForAPI(interest);
                        additionalQueryParams.append('interest', normalizedInterest);
                        additionalQueryParams.append('limit', '80');
                        additionalQueryParams.append('offset', String(offset));
                        additionalQueryParams.append('collection', 'amazon');
                        
                        try {
                            const additionalApiUrl = buildApiUrl('/products', additionalQueryParams);
                            const additionalResponse = await apiFetch(
                                additionalApiUrl,
                                { method: 'GET', headers },
                                `GET /products?interest=${normalizedInterest}&offset=${offset}`,
                            );
                            
                            if (!additionalResponse.ok) break;
                            
                            const additionalResponseData: { products?: any[] } = await additionalResponse.json();
                            const additionalData = additionalResponseData.products || [];
                            
                            if (additionalData.length === 0) break; // No more products
                            
                            const additionalTransformedProducts: Product[] = additionalData.map((product: any) => {
                                let price = 0;
                                if (product.price_numeric !== undefined && product.price_numeric !== null) {
                                    price = typeof product.price_numeric === 'number' ? product.price_numeric : parseFloat(String(product.price_numeric)) || 0;
                                } else if (product.product_price) {
                                    const priceStr = String(product.product_price).replace(/[£$€,]/g, '');
                                    price = parseFloat(priceStr) || 0;
                                }

                                let rating: number | undefined = undefined;
                                if (product.rating_numeric !== undefined && product.rating_numeric !== null) {
                                    const ratingNum = typeof product.rating_numeric === 'number' ? product.rating_numeric : parseFloat(String(product.rating_numeric));
                                    if (!isNaN(ratingNum) && ratingNum > 0 && ratingNum <= 5) {
                                        rating = ratingNum;
                                    }
                                }

                                const numRatings = product.num_ratings_numeric !== undefined && product.num_ratings_numeric !== null
                                    ? (typeof product.num_ratings_numeric === 'number' ? product.num_ratings_numeric : parseInt(String(product.num_ratings_numeric)) || 0)
                                    : 0;

                                return {
                                    id: product.asin || `${interest}-${Math.random().toString(36).substr(2, 9)}`,
                                    image: product.product_photo || '',
                                    name: product.product_title || 'Unknown Product',
                                    price: price,
                                    rating: rating,
                                    numRatings: numRatings,
                                    description: PRODUCT_DESCRIPTION,
                                };
                            });
                            
                            // Don't filter AI picks - we want 40 products regardless of overlap
                            allProducts = [...allProducts, ...additionalTransformedProducts];
                            
                            if (allProducts.length >= 40) break;
                            offset += 80;
                        } catch (error) {
                            console.warn(`⚠️ PersonPage: Error fetching additional products for "${interest}":`, error);
                            break;
                        }
                    }
                    
                    // Store ALL products (not just 40) so we can use extras for training
                    // We'll display 40 in the UI, but keep the rest available
                    console.log(`✅ PersonPage: Fetched ${allProducts.length} products for interest "${interest}"`);
                    setInterestProducts(prev => ({ ...prev, [interest]: allProducts }));
                    
                    // Save to cache
                    try {
                        const cached = localStorage.getItem(INTEREST_PRODUCTS_CACHE_KEY);
                        const cachedData = cached ? JSON.parse(cached) : {};
                        const cacheKey = `${selectedPersonId}_${interest}`;
                        cachedData[cacheKey] = {
                            products: allProducts,
                            timestamp: Date.now(),
                        };
                        localStorage.setItem(INTEREST_PRODUCTS_CACHE_KEY, JSON.stringify(cachedData));
                        console.log(`💾 PersonPage: Saved products for interest "${interest}" to cache`);
                    } catch (error) {
                        console.warn(`⚠️ PersonPage: Error saving to cache for interest "${interest}":`, error);
                    }
                } else {
                    console.log(`⚠️ PersonPage: No products returned for interest "${interest}"`);
                    setInterestProducts(prev => ({ ...prev, [interest]: [] }));
                }
            } catch (error) {
                console.error(`❌ PersonPage: Error fetching products for interest "${interest}":`, error);
                setInterestProducts(prev => ({ ...prev, [interest]: [] }));
            } finally {
                setLoadingInterests(prev => ({ ...prev, [interest]: false }));
                fetchingInterestsRef.current.delete(interest);
            }
        };

        // Fetch products for all interests (only if not already fetched or fetching)
        selectedPersonInterests.forEach(interest => {
            const currentProducts = interestProducts[interest] || [];
            
            // Always refetch if we have less than 40 products
            // This ensures we always have 40 products per interest row
            if ((!currentProducts.length || currentProducts.length < 40) && !loadingInterests[interest] && !fetchingInterestsRef.current.has(interest)) {
                console.log(`🔄 PersonPage: Refetching "${interest}" - current: ${currentProducts.length}, need: 40`);
                // Clear the cached products for this interest to force a fresh fetch
                setInterestProducts(prev => {
                    const updated = { ...prev };
                    delete updated[interest];
                    return updated;
                });
                fetchingInterestsRef.current.delete(interest);
                fetchInterestProducts(interest);
            }
        });
    }, [selectedPersonId, selectedPersonInterests.join(','), refreshTrigger]);


    // Sort AI Picks products based on sort order
    const sortedAiPicks = useMemo(() => {
        if (!sortOrder) {
            return aiPicks;
        }
        const sorted = [...aiPicks];
        if (sortOrder === 'highest') {
            return sorted.sort((a, b) => b.price - a.price);
        } else {
            return sorted.sort((a, b) => a.price - b.price);
        }
    }, [aiPicks, sortOrder]);

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

    // Sort interest products based on sort order (applies to all interest carousels)
    // Only show first 40 products per interest in the UI (rest are available for training)
    const sortedInterestProducts = useMemo(() => {
        const sorted: Record<string, Product[]> = {};
        Object.keys(interestProducts).forEach(interest => {
            const products = [...interestProducts[interest]];
            let sortedProducts = products;
            if (sortOrder === 'highest') {
                sortedProducts = products.sort((a, b) => b.price - a.price);
            } else if (sortOrder === 'lowest') {
                sortedProducts = products.sort((a, b) => a.price - b.price);
            }
            // Only take first 40 for display (rest are available for training)
            sorted[interest] = sortedProducts.slice(0, 40);
        });
        return sorted;
    }, [interestProducts, sortOrder]);

    // Get AI Picks product IDs to filter from other carousels
    const aiPicksProductIds = useMemo(() => {
        return new Set(aiPicks.map(p => p.id));
    }, [aiPicks]);

    const productsByTab: Record<string, Product[]> = useMemo(
        () => ({
            "ai-picks": sortedAiPicks, // Use sorted AI picks
            "rapidapi": sortedRapidApiProducts.filter(p => !aiPicksProductIds.has(p.id)), // Filter out AI Picks products
        }),
        [sortedAiPicks, sortedRapidApiProducts, aiPicksProductIds],
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
        console.log(`🖱️ PersonPage: handleProductClick called for productId: ${productId}`);
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
        if (isBudgetSheetOpen || isInterestsSheetOpen || isAddPersonOpen) {
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
    }, [isBudgetSheetOpen, isInterestsSheetOpen, isAddPersonOpen]);

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
                                {/* Sort and Edit Controls */}
                                <div className="flex items-center justify-evenly gap-0.5 mb-4 overflow-x-auto no-scrollbar -mx-4 px-2">
                                    <Button
                                        variant={sortOrder === 'highest' ? 'primary' : 'outline'}
                                        size="small"
                                        onClick={() => setSortOrder('highest')}
                                        className="flex items-center justify-center gap-1 !px-2.5 py-1.5 text-xs whitespace-nowrap flex-shrink-0 !border-gray-200"
                                        aria-label="Sort by highest price"
                                    >
                                        <FontAwesomeIcon icon={faDollarSign} className="w-2.5 h-2.5" />
                                        <FontAwesomeIcon icon={faArrowUp} className="w-2.5 h-2.5" />
                                        <span>High</span>
                                    </Button>
                                    <Button
                                        variant={sortOrder === 'lowest' ? 'primary' : 'outline'}
                                        size="small"
                                        onClick={() => setSortOrder('lowest')}
                                        className="flex items-center justify-center gap-1 !px-2.5 py-1.5 text-xs whitespace-nowrap flex-shrink-0 !border-gray-200"
                                        aria-label="Sort by lowest price"
                                    >
                                        <FontAwesomeIcon icon={faDollarSign} className="w-2.5 h-2.5" />
                                        <FontAwesomeIcon icon={faArrowDown} className="w-2.5 h-2.5" />
                                        <span>Low</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="small"
                                        onClick={() => setIsBudgetSheetOpen(true)}
                                        className="!px-2.5 py-1.5 text-xs whitespace-nowrap flex-shrink-0 !border-gray-200"
                                        aria-label="Edit budget"
                                    >
                                        <span className="flex items-center justify-center gap-1.5">
                                            <FontAwesomeIcon icon={faSliders} className="w-2.5 h-2.5" />
                                            <span>Budget</span>
                                        </span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="small"
                                        onClick={() => setIsInterestsSheetOpen(true)}
                                        className="!px-2.5 py-1.5 text-xs whitespace-nowrap flex-shrink-0 !border-gray-200"
                                        aria-label="Edit interests"
                                    >
                                        <span className="flex items-center justify-center gap-1.5">
                                            <FontAwesomeIcon icon={faTags} className="w-2.5 h-2.5" />
                                            <span>Interests</span>
                                        </span>
                                    </Button>
                                </div>
                                
                                <div className="flex items-center justify-between gap-3 mb-0">
                                    <h2 className="text-[22px] font-medium font-headline text-simplysent-grey-heading">
                                        AI Picks For {selectedPersonId ? savedPersons.find(p => p.id === selectedPersonId)?.name || 'Kevin' : 'Kevin'}
                                        {isAnyDevModeEnabled() && (
                                            <span className="ml-2 text-base font-normal text-gray-500">
                                                ({productsByTab["ai-picks"]?.filter((p) => !removedProducts.has(p.id)).length || 0})
                                            </span>
                                        )}
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
                                            {/* Regular AI Picks Products */}
                                            {productsByTab["ai-picks"]
                                                ?.filter(
                                                    (p) =>
                                                        !removedProducts.has(
                                                            p.id,
                                                        ),
                                                )
                                                .map((p, index) => {
                                                    return (
                                                        <div
                                                            key={p.id}
                                                            className="flex-shrink-0 w-[260px] transition-all duration-700 ease-out"
                                                            style={{
                                                                animation: `fadeInSlide 0.6s ease-out ${index * 0.05}s both`,
                                                            }}
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
                                const products = sortedInterestProducts[interest] || [];
                                const isLoading = loadingInterests[interest] || false;
                                
                                if (isLoading && products.length === 0) {
                                    return (
                                        <div key={interest} className="mt-[10px]">
                                <div className="flex items-center gap-3 mb-0">
                                    <h2 className="text-[22px] font-medium font-headline text-simplysent-grey-heading">
                                                    {getInterestLabel(interest)}
                                                    {isAnyDevModeEnabled() && (
                                                        <span className="ml-2 text-base font-normal text-gray-500">
                                                            (loading...)
                                                        </span>
                                                    )}
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
                                
                                // Filter only removed products (not AI picks - we want 40 products regardless of overlap)
                                const filteredProducts = products.filter((p) => !removedProducts.has(p.id));
                                if (filteredProducts.length === 0) return null;
                                
                                // Count products for this interest (excluding only removed products)
                                const productCount = products.filter((p) => !removedProducts.has(p.id)).length;
                                
                                return (
                                    <div key={interest} className="mt-[10px]">
                                        <div className="flex items-center gap-3 mb-0">
                                            <h2 className="text-[22px] font-medium font-headline text-simplysent-grey-heading">
                                                {getInterestLabel(interest)}
                                                {isAnyDevModeEnabled() && (
                                                    <span className="ml-2 text-base font-normal text-gray-500">
                                                        ({productCount})
                                                    </span>
                                                )}
                                            </h2>
                                        </div>
                                    <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pt-3 pb-8 mt-[10px]">
                                        <div className="flex gap-4 transition-all duration-1000">
                                                {products
                                                    .filter((p) => !removedProducts.has(p.id))
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
                                                            onClick={() => handleProductClick(p.id)}
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
                                            <Button
                                                variant={rapidApiSortOrder === 'highest' ? 'primary' : 'outline'}
                                                size="small"
                                                onClick={() => setRapidApiSortOrder('highest')}
                                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs whitespace-nowrap border-gray-300"
                                                aria-label="Sort by highest price"
                                            >
                                                <FontAwesomeIcon icon={faDollarSign} className="w-2.5 h-2.5" />
                                                <FontAwesomeIcon icon={faArrowUp} className="w-2.5 h-2.5" />
                                                <span>High</span>
                                            </Button>
                                            <Button
                                                variant={rapidApiSortOrder === 'lowest' ? 'primary' : 'outline'}
                                                size="small"
                                                onClick={() => setRapidApiSortOrder('lowest')}
                                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs whitespace-nowrap border-gray-300"
                                                aria-label="Sort by lowest price"
                                            >
                                                <FontAwesomeIcon icon={faDollarSign} className="w-2.5 h-2.5" />
                                                <FontAwesomeIcon icon={faArrowDown} className="w-2.5 h-2.5" />
                                                <span>Low</span>
                                            </Button>
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

            {/* Budget Sheet */}
            <BudgetSheet
                open={isBudgetSheetOpen}
                onOpenChange={setIsBudgetSheetOpen}
                initialMinBudget={selectedPersonId ? savedPersons.find(p => p.id === selectedPersonId)?.minBudget || 50 : 50}
                initialMaxBudget={selectedPersonId ? savedPersons.find(p => p.id === selectedPersonId)?.maxBudget || 300 : 300}
                onSave={(minBudget, maxBudget) => {
                    if (selectedPersonId) {
                        const updatedPersons = savedPersons.map(person => 
                            person.id === selectedPersonId 
                                ? { ...person, minBudget, maxBudget }
                                : person
                        );
                        setSavedPersons(updatedPersons);
                        localStorage.setItem('saved_persons', JSON.stringify(updatedPersons));
                        // Trigger refresh to get new recommendations with updated budget
                        handleRefresh();
                    }
                }}
            />

            {/* Interests Sheet */}
            <InterestsSheet
                open={isInterestsSheetOpen}
                onOpenChange={setIsInterestsSheetOpen}
                initialInterests={selectedPersonId ? savedPersons.find(p => p.id === selectedPersonId)?.interests || [] : []}
                gender={selectedPersonId ? savedPersons.find(p => p.id === selectedPersonId)?.gender : undefined}
                onSave={(interests) => {
                    if (selectedPersonId) {
                        const updatedPersons = savedPersons.map(person => 
                            person.id === selectedPersonId 
                                ? { ...person, interests }
                                : person
                        );
                        setSavedPersons(updatedPersons);
                        localStorage.setItem('saved_persons', JSON.stringify(updatedPersons));
                        // Clear interest products cache and trigger refetch
                        try {
                            localStorage.removeItem(INTEREST_PRODUCTS_CACHE_KEY);
                        } catch (error) {
                            console.warn("Error clearing interest products cache:", error);
                        }
                        setInterestProducts({});
                        fetchingInterestsRef.current.clear();
                        setRefreshTrigger(prev => prev + 1);
                        // Trigger refresh to get new recommendations with updated interests
                        handleRefresh();
                    }
                }}
            />

            {/* Floating Section Navigation (Gifts / Favourites / Share) */}

            <div
                id="floating-nav"
                className={`fixed inset-x-0 z-40 transition-opacity duration-300 ${
                    isBudgetSheetOpen || isInterestsSheetOpen
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

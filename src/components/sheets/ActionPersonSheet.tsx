import React, { useRef, useEffect, useState } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Step1Form } from "./Step1Form";
import { Step2AboutForm } from "./Step2AboutForm";
import { Step3Form } from "./Step3Form";
import { Step4InterestsForm } from "./Step4InterestsForm";
import { AdditionalQuestionsForm } from "./AdditionalQuestionsForm";
import { Step6BudgetForm } from "./Step6BudgetForm";
import {
    buildApiUrl,
    apiFetch,
    getApiHeaders,
    getCurrentMode,
} from "../../utils/apiConfig";
import { getOrCreateSessionId } from "../../utils/tracking";
import { normalizeInterestsForAPI } from "./formConstants";

/**
 * ActionPersonSheet
 *
 * Minimal bottom sheet using react-modal-sheet compound components (Container/Header/Content/Backdrop)
 * with correct imports (only Sheet + SheetRef). Uses fixed snap points [0, 1] and a container height of 90vh for stability.
 */
export interface ActionPersonSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    children?: React.ReactNode;
    snapPoints?: number[]; // Defaults [0, 1] (0 closed, 1 open; height enforced via container style 90vh)
    initialSnap?: number; // Defaults 1 (the 0.9 point)
    onComplete?: () => void;
}

const DEFAULT_SNAP_POINTS = [0, 1];

export const ActionPersonSheet: React.FC<ActionPersonSheetProps> = ({
    open,
    onOpenChange,
    title = "Add Person",
    children,
    snapPoints: _snapPoints = DEFAULT_SNAP_POINTS,
    initialSnap: _initialSnap = 1,
    onComplete,
}) => {
    const sheetRef = useRef<SheetRef>(null);

    // Stable pixel height derived from visualViewport (falls back to window.innerHeight)
    // Converts 90vh to a concrete px value to avoid iOS Safari floating toolbar cutoff.
    // Extends into bottom safe area
    const dynamicHeight = React.useMemo(() => {
        if (typeof window === "undefined") return "90vh";
        const vpH =
            window.visualViewport?.height && window.visualViewport.height > 0
                ? window.visualViewport.height
                : window.innerHeight;
        // 90% of current viewport plus small buffer so sheet visually extends under toolbar
        const target = Math.round(vpH * 0.9 + 12);
        return `${target}px`;
    }, [open]);

    // Fixed snap points [0,1] for stability; no dynamic normalization.
    // Using initial snap index 1 to open at 90vh (enforced via Sheet.Container height).
    // Removed dynamic snapPoints logic to avoid upward jump issues.
    // (Lines intentionally preserved count for edit stability.)
    // (Lines intentionally preserved count for edit stability.)
    // (Lines intentionally preserved count for edit stability.)
    // (Lines intentionally preserved count for edit stability.)
    // (Lines intentionally preserved count for edit stability.)
    // (Lines intentionally preserved count for edit stability.)
    // (Lines intentionally preserved count for edit stability.)
    // (Lines intentionally preserved count for edit stability.)
    // (Lines intentionally preserved count for edit stability.)
    // (Lines intentionally preserved count for edit stability.)

    // Body scroll lock and white bottom safe area
    useEffect(() => {
        if (open) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            document.body.classList.add("sheet-open");
            return () => {
                document.body.style.overflow = prev;
                document.body.classList.remove("sheet-open");
            };
        }
    }, [open]);

    // (Removed duplicate dynamicHeight declaration)
    return (
        <>
            <Sheet
                ref={sheetRef}
                isOpen={open}
                onClose={() => onOpenChange(false)}
                snapPoints={[0, 1]}
                initialSnap={1}
                disableDrag={true}
            >
                <Sheet.Container
                    style={{
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                        height: `calc(${dynamicHeight} + env(safe-area-inset-bottom))`,
                        marginBottom: `calc(-1 * env(safe-area-inset-bottom))`,
                        background: "#ffffff",
                    }}
                >
                    <Sheet.Header>
                        <div
                            className="flex items-center justify-center px-6"
                            style={{
                                minHeight: "64px",
                                paddingTop:
                                    "calc(env(safe-area-inset-top) + 16px)",
                                position: "relative",
                            }}
                        >
                            {/* Drag indicator */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: 8,
                                    left: 0,
                                    right: 0,
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Sheet.DragIndicator
                                    style={{ display: "none" }}
                                />
                            </div>
                            <h2 className="m-0 text-xl font-bold text-gray-800 select-none">
                                {title}
                            </h2>
                            <button
                                type="button"
                                onClick={() => onOpenChange(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors absolute right-6"
                                aria-label="Close"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                        </div>
                    </Sheet.Header>
                    <Sheet.Content
                        style={{
                            padding: "0 24px 24px 24px",
                            paddingBottom:
                                "calc(36px + env(safe-area-inset-bottom))",
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                            minHeight: 0,
                            overflow: "hidden",
                        }}
                    >
                        {children ?? (
                            <AddPersonForm
                                onClose={() => onOpenChange(false)}
                                onComplete={onComplete}
                            />
                        )}
                    </Sheet.Content>
                </Sheet.Container>
                {/* Red bottom safe area overlay - TEST */}
                {open && (
                    <div
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "env(safe-area-inset-bottom)",
                            background: "#ff0000",
                            pointerEvents: "none",
                            zIndex: 999999,
                        }}
                    />
                )}
                <Sheet.Backdrop onTap={() => onOpenChange(false)} />
            </Sheet>
        </>
    );
};

interface ApiResponse {
    recommendation_id: string;
    products: Array<{
        asin: string;
        rank: number;
    }>;
}

// Default form component for Add Person
const AddPersonForm: React.FC<{
    onClose: () => void;
    onComplete?: () => void;
}> = ({ onClose, onComplete }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    
    // Calculate age from DOB if provided
    const calculateAgeFromDob = (dob: string): number => {
        try {
            const [day, month, year] = dob.split('/').map(Number);
            const birthDate = new Date(year, month - 1, day);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        } catch {
            return 30; // Default age
        }
    };

    const [formData, setFormData] = useState<{
        relationship?: string;
        name?: string;
        gender?: string;
        dob?: string;
        age?: number;
        ageMonth?: string;
        ageDay?: string;
        interests?: string[];
        clothingSize?: string;
        favouriteDrink?: string;
        notes?: string;
        minBudget?: number;
        maxBudget?: number;
    }>({});

    const handleStep1Next = (data: { relationship: string }) => {
        const newData = { ...formData, relationship: data.relationship };
        // Pre-fill name for Mother/Father (only if not already set from auto-fill)
        if (!newData.name) {
            if (data.relationship === "mother") {
                newData.name = "Mum";
            } else if (data.relationship === "father") {
                newData.name = "Dad";
            }
        }
        setFormData(newData);
        // Skip step 2 for Mother and Father
        if (data.relationship === "mother" || data.relationship === "father") {
            setStep(3);
        } else {
            setStep(2);
        }
    };
    

    const handleStep2Back = () => setStep(1);
    const handleStep2Next = (data: { name?: string; gender?: string }) => {
        setFormData({ ...formData, ...data });
        setStep(3);
    };

    const handleStep3Back = () => {
        // If relationship is mother or father, go back to step 1, otherwise step 2
        if (formData.relationship === "mother" || formData.relationship === "father") {
            setStep(1);
        } else {
            setStep(2);
        }
    };
    const handleStep3Next = (data: { dob?: string; age?: number; ageMonth?: string; ageDay?: string }) => {
        setFormData({ ...formData, ...data });
        setStep(4);
    };

    const handleStep4Back = () => setStep(3);
    const handleStep4Next = (data: { interests: string[] }) => {
        setFormData({ ...formData, interests: data.interests });
        setStep(5);
    };

    const handleStep5Back = () => setStep(4);
    const handleStep5Next = (data: {
        clothingSize: string;
        favouriteDrink: string;
    }) => {
        setFormData({ ...formData, ...data });
        setStep(6);
    };

    const handleStep6Back = () => setStep(5);
    const handleStep6Next = async (data: {
        minBudget: number;
        maxBudget: number;
    }) => {
        const finalData = { ...formData, ...data };
        console.log("All data collected:", finalData);
        
        setIsSubmitting(true);
        
        try {
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
                    'xs': 'XS',
                    'small': 'S',
                    's': 'S',
                    'medium': 'M',
                    'm': 'M',
                    'large': 'L',
                    'l': 'L',
                    'xlarge': 'XL',
                    'xl': 'XL',
                    'xxlarge': 'XXL',
                    'xxl': 'XXL',
                    'not-sure': 'M',
                };
                const normalized = size.toLowerCase().trim();
                return sizeMap[normalized] || 'M'; // Default to M if not found
            };
            
            // Determine DOB
            let dob: string;
            if (finalData.dob) {
                dob = finalData.dob;
            } else if (finalData.age !== undefined) {
                dob = ageToDob(finalData.age);
            } else {
                // Default to age 30 if neither provided
                dob = ageToDob(30);
            }
            
            // Ensure interests has at least 1 item (required by API)
            const rawInterests = finalData.interests && finalData.interests.length > 0 
                ? finalData.interests 
                : ["General"];
            
            // Normalize interests to API format (no dashes, proper capitalization)
            const interests = normalizeInterestsForAPI(rawInterests);
            
            const requestData = {
                context: {
                    name: finalData.name || "Friend",
                    relationship: finalData.relationship ? finalData.relationship.charAt(0).toUpperCase() + finalData.relationship.slice(1).toLowerCase() : "Friend",
                    gender: (finalData.gender || "male").toLowerCase(),
                    dob: dob,
                    interests: interests,
                    budget_min: finalData.minBudget || 10,
                    budget_max: finalData.maxBudget || 110,
                    other: {
                        clothing_size: normalizeSize(finalData.clothingSize || "medium"),
                        favourite_drink: (finalData.favouriteDrink || "beer").toLowerCase(),
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
            
            const apiResponse: ApiResponse = await response.json();
            console.log("API Response:", apiResponse);
            
            // Store person in localStorage
            const personId = apiResponse.recommendation_id || `person-${Date.now()}`;
            try {
                const personData = {
                    id: personId,
                    name: finalData.name || "Friend",
                    relationship: finalData.relationship,
                    gender: finalData.gender,
                    interests: finalData.interests || [],
                    minBudget: finalData.minBudget,
                    maxBudget: finalData.maxBudget,
                    createdAt: Date.now(),
                };
                
                const storedPersons = localStorage.getItem('saved_persons');
                const persons = storedPersons ? JSON.parse(storedPersons) : [];
                persons.push(personData);
                localStorage.setItem('saved_persons', JSON.stringify(persons));
                
                // Transform and cache the products so PersonPage can use them immediately
                if (apiResponse.products && apiResponse.products.length > 0) {
                    const PRODUCT_DESCRIPTION = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.";
                    
                    const transformedProducts = apiResponse.products.map((product) => {
                        const asin = product.asin || `ai-${product.rank || Math.random().toString(36).substr(2, 9)}`;
                        const productName = product.product_title || `Product ${product.rank || 'Unknown'}`;
                        const productImage = product.product_photo 
                            || `https://storage.googleapis.com/simplysent-product-images/${asin}/t_${asin}_1.png`;
                        
                        let productPrice = 0;
                        if (product.price_numeric !== undefined && product.price_numeric !== null) {
                            productPrice = typeof product.price_numeric === 'number' ? product.price_numeric : parseFloat(String(product.price_numeric)) || 0;
                        } else if (product.product_price) {
                            const priceStr = String(product.product_price).replace(/[£$€,]/g, '');
                            productPrice = parseFloat(priceStr) || 0;
                        }
                        
                        let parsedRating: number | undefined = undefined;
                        if (product.rating_numeric !== undefined && product.rating_numeric !== null) {
                            const ratingNum = typeof product.rating_numeric === 'number' ? product.rating_numeric : parseFloat(String(product.rating_numeric));
                            if (!isNaN(ratingNum) && ratingNum > 0 && ratingNum <= 5) {
                                parsedRating = ratingNum;
                            }
                        }
                        
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
                    
                    // Save to cache using the same key PersonPage uses
                    const CACHE_KEY = 'person_page_ai_picks_cache';
                    try {
                        localStorage.setItem(CACHE_KEY, JSON.stringify({
                            products: transformedProducts,
                            timestamp: Date.now(),
                            recommendationId: apiResponse.recommendation_id,
                            personId: personId,
                        }));
                        console.log("💾 ActionPersonSheet: Saved AI picks to cache for PersonPage");
                    } catch (error) {
                        console.warn("⚠️ ActionPersonSheet: Error saving to cache:", error);
                    }
                }
                
                // Dispatch event to notify PersonPage
                window.dispatchEvent(new CustomEvent('person-added', { detail: personData }));
            } catch (error) {
                console.warn('Failed to save person:', error);
            }
            
            // Close the sheet
            onClose();
            
            // Navigate to person page or call onComplete
            if (onComplete) {
                onComplete();
            } else {
                // Navigate to home page (PersonPage) - it will fetch recommendations on load
                navigate("/");
            }
        } catch (error) {
            console.error("Error calling /recommend:", error);
            alert("Failed to get recommendations. Please try again.");
            setIsSubmitting(false);
        }
    };

    // Get initial name for Step 2 (pre-filled from relationship)
    const getInitialName = () => {
        if (formData.relationship === "mother") return "Mum";
        if (formData.relationship === "father") return "Dad";
        return formData.name || "";
    };

    if (step === 1) {
        return (
            <Step1Form 
                onNext={handleStep1Next} 
            />
        );
    }

    if (step === 2) {
        return (
            <Step2AboutForm
                onBack={handleStep2Back}
                onNext={handleStep2Next}
                relationship={formData.relationship}
            />
        );
    }

    if (step === 3) {
        return (
            <Step3Form 
                onBack={handleStep3Back} 
                onNext={handleStep3Next}
            />
        );
    }

    // Calculate age from DOB if age is not directly provided
    const getAgeForInterests = (): number | undefined => {
        if (formData.age !== undefined) {
            return formData.age;
        }
        if (formData.dob) {
            // Parse DD/MM/YYYY format
            const parts = formData.dob.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1; // Month is 0-indexed
                const year = parseInt(parts[2]);
                try {
                    const birthDate = new Date(year, month, day);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    return age >= 0 && age <= 120 ? age : undefined;
                } catch (e) {
                    return undefined;
                }
            }
        }
        return undefined;
    };

    if (step === 4) {
        return (
            <Step4InterestsForm
                onBack={handleStep4Back}
                onNext={handleStep4Next}
                relationship={formData.relationship}
                age={getAgeForInterests()}
                gender={formData.gender}
            />
        );
    }

    if (step === 5) {
        return (
            <AdditionalQuestionsForm 
                onBack={handleStep5Back} 
                onNext={handleStep5Next}
            />
        );
    }

    if (step === 6) {
        return (
            <Step6BudgetForm
                onBack={handleStep6Back}
                onNext={handleStep6Next}
                isSubmitting={isSubmitting}
            />
        );
    }

    return null;
};

export default ActionPersonSheet;

import React, { useRef, useEffect, useState } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Step1Form } from "./Step1Form";
import { Step2AboutForm } from "./Step2AboutForm";
import { Step3Form } from "./Step3Form";
import { Step4InterestsForm } from "./Step4InterestsForm";
import { Step3StyleForm } from "./Step3StyleForm";
import { Step6BudgetForm } from "./Step6BudgetForm";
import {
    buildApiUrl,
    apiFetch,
    getApiHeaders,
    getCurrentMode,
} from "../../utils/apiConfig";
import { getOrCreateSessionId } from "../../utils/tracking";

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
    
    // Check for auto-fill data
    const getAutoFillData = () => {
        try {
            const stored = localStorage.getItem('onboarding_autofill');
            if (stored) {
                const data = JSON.parse(stored);
                // Clear after reading
                localStorage.removeItem('onboarding_autofill');
                return data;
            }
        } catch (error) {
            console.warn('Error reading auto-fill data:', error);
        }
        return null;
    };

    const autoFillData = getAutoFillData();
    
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
    }>(() => {
        // Auto-fill from localStorage if available
        if (autoFillData) {
            const age = autoFillData.dob ? calculateAgeFromDob(autoFillData.dob) : undefined;
            return {
                relationship: autoFillData.relationship?.toLowerCase() || undefined,
                name: autoFillData.name || undefined,
                gender: autoFillData.gender || undefined,
                dob: autoFillData.dob || undefined,
                age: age,
                interests: autoFillData.interests || [],
                clothingSize: autoFillData.other?.clothing_size || undefined,
                favouriteDrink: autoFillData.other?.favourite_drink || undefined,
                minBudget: autoFillData.budget_min || undefined,
                maxBudget: autoFillData.budget_max || undefined,
            };
        }
        return {};
    });

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
    
    // Auto-advance if auto-fill data is present
    useEffect(() => {
        if (autoFillData && step === 1 && formData.relationship) {
            // Skip to step 3 if relationship is mother/father, otherwise step 2
            if (formData.relationship === "mother" || formData.relationship === "father") {
                setStep(3);
            } else if (formData.name && formData.gender) {
                setStep(3);
            } else if (formData.name) {
                setStep(2);
            }
        }
    }, [autoFillData, step, formData.relationship, formData.name, formData.gender]);

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
            const interests = finalData.interests && finalData.interests.length > 0 
                ? finalData.interests 
                : ["General"];
            
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
            try {
                const personData = {
                    id: apiResponse.recommendation_id || `person-${Date.now()}`,
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
        return <Step1Form onNext={handleStep1Next} />;
    }

    if (step === 2) {
        return (
            <Step2AboutForm
                onBack={handleStep2Back}
                onNext={handleStep2Next}
                relationship={formData.relationship}
                initialName={getInitialName()}
            />
        );
    }

    if (step === 3) {
        return (
            <Step3Form onBack={handleStep3Back} onNext={handleStep3Next} />
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
            <Step3StyleForm onBack={handleStep5Back} onNext={handleStep5Next} />
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

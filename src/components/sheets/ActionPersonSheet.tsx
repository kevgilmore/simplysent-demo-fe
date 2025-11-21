import React, { useRef, useEffect, useState } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { X } from "lucide-react";
import { Step1Form } from "./Step1Form";
import { Step2AboutForm } from "./Step2AboutForm";
import { Step3StyleForm } from "./Step3StyleForm";
import { Step4InterestsForm } from "./Step4InterestsForm";
import { Step5VibeForm } from "./Step5VibeForm";
import { Step6BudgetForm } from "./Step6BudgetForm";

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

// Default form component for Add Person
const AddPersonForm: React.FC<{
    onClose: () => void;
    onComplete?: () => void;
}> = ({ onClose, onComplete }) => {
    const [step, setStep] = useState(1);

    const handleStep1Next = (data: { relationship: string; name: string; occasion: string }) => {
        console.log("Step 1:", data);
        setStep(2);
    };

    const handleStep2Back = () => setStep(1);
    const handleStep2Next = (data: { age: string; gender: string }) => {
        console.log("Step 2:", data);
        setStep(3);
    };

    const handleStep3Back = () => setStep(2);
    const handleStep3Next = (data: {
        clothingSize: string;
        favouriteDrink: string;
    }) => {
        console.log("Step 3:", data);
        setStep(4);
    };

    const handleStep4Back = () => setStep(3);
    const handleStep4Next = (data: { interests: string[] }) => {
        console.log("Step 4:", data);
        setStep(5);
    };

    const handleStep5Back = () => setStep(4);
    const handleStep5Next = (data: { sentiment: string }) => {
        console.log("Step 5:", data);
        setStep(6);
    };

    const handleStep6Back = () => setStep(5);
    const handleStep6Next = (data: {
        minBudget: number;
        maxBudget: number;
    }) => {
        console.log("Step 6:", data);
        console.log("All data collected!");
        if (onComplete) {
            onComplete();
        } else {
            onClose();
        }
    };

    if (step === 1) {
        return <Step1Form onNext={handleStep1Next} />;
    }

    if (step === 2) {
        return (
            <Step2AboutForm onBack={handleStep2Back} onNext={handleStep2Next} />
        );
    }

    if (step === 3) {
        return (
            <Step3StyleForm onBack={handleStep3Back} onNext={handleStep3Next} />
        );
    }

    if (step === 4) {
        return (
            <Step4InterestsForm
                onBack={handleStep4Back}
                onNext={handleStep4Next}
            />
        );
    }

    if (step === 5) {
        return (
            <Step5VibeForm onBack={handleStep5Back} onNext={handleStep5Next} />
        );
    }

    if (step === 6) {
        return (
            <Step6BudgetForm
                onBack={handleStep6Back}
                onNext={handleStep6Next}
            />
        );
    }

    return null;
};

export default ActionPersonSheet;

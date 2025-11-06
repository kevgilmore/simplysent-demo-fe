import React, { useRef, useEffect, useState, useMemo } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { X } from "lucide-react";
import { TextInput } from "../ui_kit/TextInput";
import { Dropdown } from "../ui_kit/Dropdown";
import { Button } from "../ui_kit/Button";
import { Step2AboutForm } from "./Step2AboutForm";
import { Step3StyleForm } from "./Step3StyleForm";
import { Step4InterestsForm } from "./Step4InterestsForm";
import { Step5VibeForm } from "./Step5VibeForm";
import { Step6BudgetForm } from "./Step6BudgetForm";
import { relationshipOptions, occasionOptions } from "./formConstants";

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
}

const DEFAULT_SNAP_POINTS = [0, 1];

export const ActionPersonSheet: React.FC<ActionPersonSheetProps> = ({
    open,
    onOpenChange,
    title = "Add Person",
    children,
    snapPoints = DEFAULT_SNAP_POINTS,
    initialSnap = 1,
}) => {
    const sheetRef = useRef<SheetRef>(null);
    const scrollLockRef = useRef<number>(0);

    // Stable pixel height derived from visualViewport (falls back to window.innerHeight)
    // Converts 90vh to a concrete px value to avoid iOS Safari floating toolbar cutoff.
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

    // Body scroll lock (simple; library backdrop prevents interactions but this stops background bounce).
    useEffect(() => {
        if (open) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = prev;
            };
        }
    }, [open]);

    // (Removed duplicate dynamicHeight declaration)
    return (
        <>
            {open && (
                <div
                    style={{
                        position: "fixed",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "max(env(safe-area-inset-bottom), 60px)",
                        background: "rgba(255, 255, 255, 1)",
                        pointerEvents: "none",
                        zIndex: 9998,
                    }}
                />
            )}

            {/* (Removed duplicate overlay block) */}
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
                        height: dynamicHeight,
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
                                "calc(24px + env(safe-area-inset-bottom))",
                        }}
                    >
                        {children ?? (
                            <AddPersonForm
                                onClose={() => onOpenChange(false)}
                            />
                        )}
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => onOpenChange(false)} />
            </Sheet>
        </>
    );
};

// Default form component for Add Person
const AddPersonForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [relationship, setRelationship] = useState("friend");
    const [name, setName] = useState("John");
    const [occasion, setOccasion] = useState("birthday");

    const handleStep1Next = () => {
        if (relationship && name && occasion) {
            setStep(2);
        }
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
        onClose();
    };

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

    return (
        <div className="flex flex-col gap-6 py-4">
            <div className="text-left mb-2">
                <p className="text-gray-700 text-base font-semibold">
                    Who are we shopping for?
                </p>
            </div>

            <Dropdown
                label="Relationship"
                placeholder="Select relationship"
                value={relationship}
                options={relationshipOptions}
                onChange={setRelationship}
            />

            <TextInput
                label="Name"
                placeholder="Enter their name"
                value={name}
                onChange={setName}
            />

            <Dropdown
                label="Occasion"
                placeholder="Select occasion"
                value={occasion}
                options={occasionOptions}
                onChange={setOccasion}
            />

            <Button
                fullWidth
                size="large"
                onClick={handleStep1Next}
                disabled={!relationship || !name || !occasion}
            >
                Next
            </Button>
        </div>
    );
};

export default ActionPersonSheet;

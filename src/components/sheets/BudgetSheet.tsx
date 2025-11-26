import React, { useRef, useEffect, useState } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { X } from "lucide-react";
import { RangeSlider } from "../ui/RangeSlider";
import { Button } from "../ui/Button";

export interface BudgetSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialMinBudget?: number;
    initialMaxBudget?: number;
    onSave?: (minBudget: number, maxBudget: number) => void;
}

export const BudgetSheet: React.FC<BudgetSheetProps> = ({
    open,
    onOpenChange,
    initialMinBudget = 50,
    initialMaxBudget = 300,
    onSave,
}) => {
    const sheetRef = useRef<SheetRef>(null);
    const [minBudget, setMinBudget] = useState(initialMinBudget);
    const [maxBudget, setMaxBudget] = useState(initialMaxBudget);

    // Update local state when props change
    useEffect(() => {
        setMinBudget(initialMinBudget);
        setMaxBudget(initialMaxBudget);
    }, [initialMinBudget, initialMaxBudget]);

    const dynamicHeight = React.useMemo(() => {
        if (typeof window === "undefined") return "50vh";
        const vpH =
            window.visualViewport?.height && window.visualViewport.height > 0
                ? window.visualViewport.height
                : window.innerHeight;
        const target = Math.round(vpH * 0.5);
        return `${target}px`;
    }, [open]);

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

    const handleBudgetChange = (min: number, max: number) => {
        setMinBudget(min);
        setMaxBudget(max);
    };

    const handleSave = () => {
        if (onSave) {
            onSave(minBudget, maxBudget);
        }
        onOpenChange(false);
    };

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
                            <h2 className="m-0 text-xl font-headline font-medium text-gray-800 select-none">
                                Edit Budget
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
                            padding: "24px",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            overflow: "hidden",
                        }}
                    >
                        <div className="flex-1 flex items-center justify-center px-4">
                            <RangeSlider
                                min={10}
                                max={500}
                                minValue={minBudget}
                                maxValue={maxBudget}
                                onChange={handleBudgetChange}
                                label="Select your budget range (£5 steps)"
                            />
                        </div>
                        <div className="pt-6 pb-4">
                            <Button
                                onClick={handleSave}
                                variant="primary"
                                size="large"
                                fullWidth
                                className="!font-normal"
                            >
                                Save Budget
                            </Button>
                        </div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => onOpenChange(false)} />
            </Sheet>
        </>
    );
};

export default BudgetSheet;


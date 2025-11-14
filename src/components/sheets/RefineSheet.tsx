import React, { useRef, useEffect, useState } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { X } from "lucide-react";
import { MultiSelectList } from "../ui/MultiSelectList";
import { RangeSlider } from "../ui/RangeSlider";
import { interestOptions } from "./formConstants";

export interface RefineSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialInterests?: string[];
    initialMinBudget?: number;
    initialMaxBudget?: number;
    onUpdate?: (data: {
        interests: string[];
        minBudget: number;
        maxBudget: number;
    }) => void;
}

export const RefineSheet: React.FC<RefineSheetProps> = ({
    open,
    onOpenChange,
    initialInterests = [],
    initialMinBudget = 50,
    initialMaxBudget = 300,
    onUpdate,
}) => {
    const sheetRef = useRef<SheetRef>(null);

    const [interests, setInterests] = useState<string[]>(initialInterests);
    const [minBudget, setMinBudget] = useState(initialMinBudget);
    const [maxBudget, setMaxBudget] = useState(initialMaxBudget);

    // Update local state when props change
    useEffect(() => {
        setInterests(initialInterests);
        setMinBudget(initialMinBudget);
        setMaxBudget(initialMaxBudget);
    }, [initialInterests, initialMinBudget, initialMaxBudget]);

    // Notify parent of changes
    useEffect(() => {
        if (open && onUpdate) {
            onUpdate({ interests, minBudget, maxBudget });
        }
    }, [interests, minBudget, maxBudget, open, onUpdate]);

    // Stable pixel height - smaller than add person sheet (75vh)
    const dynamicHeight = React.useMemo(() => {
        if (typeof window === "undefined") return "75vh";
        const vpH =
            window.visualViewport?.height && window.visualViewport.height > 0
                ? window.visualViewport.height
                : window.innerHeight;
        const target = Math.round(vpH * 0.75 + 12);
        return `${target}px`;
    }, [open]);

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

    const handleBudgetChange = (min: number, max: number) => {
        setMinBudget(min);
        setMaxBudget(max);
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
                            <h2 className="m-0 text-xl font-bold text-gray-800 select-none">
                                Refine
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
                            padding: "0",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            overflow: "hidden",
                        }}
                    >
                        {/* Budget - 50% fixed at top */}
                        <div
                            style={{
                                flex: "0 0 50%",
                                padding: "24px",
                                display: "flex",
                                alignItems: "center",
                                borderBottom: "1px solid #e5e7eb",
                            }}
                        >
                            <RangeSlider
                                min={10}
                                max={500}
                                minValue={minBudget}
                                maxValue={maxBudget}
                                onChange={handleBudgetChange}
                            />
                        </div>

                        {/* Interests - 50% scrollable at bottom */}
                        <div
                            style={{
                                flex: "1 1 auto",
                                minHeight: 0,
                                padding: "16px 24px",
                                paddingBottom:
                                    "calc(40px + env(safe-area-inset-bottom))",
                                overflowY: "auto",
                                WebkitOverflowScrolling: "touch",
                                touchAction: "pan-y",
                            }}
                        >
                            <MultiSelectList
                                options={interestOptions}
                                selectedValues={interests}
                                onChange={setInterests}
                            />
                        </div>
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

export default RefineSheet;

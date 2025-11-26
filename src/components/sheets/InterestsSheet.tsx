import React, { useRef, useEffect, useState } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { X } from "lucide-react";
import { MultiSelectList } from "../ui/MultiSelectList";
import { Button } from "../ui/Button";
import { menInterests, womenInterests, boysInterests, girlsInterests } from "./formConstants";

export interface InterestsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialInterests?: string[];
    gender?: string;
    onSave?: (interests: string[]) => void;
}

export const InterestsSheet: React.FC<InterestsSheetProps> = ({
    open,
    onOpenChange,
    initialInterests = [],
    gender,
    onSave,
}) => {
    const sheetRef = useRef<SheetRef>(null);
    const [interests, setInterests] = useState<string[]>(initialInterests);

    // Update local state when props change
    useEffect(() => {
        setInterests(initialInterests);
    }, [initialInterests]);

    // Get relevant interests based on gender
    const getInterestOptions = () => {
        const allInterests = [
            ...menInterests,
            ...womenInterests,
            ...boysInterests,
            ...girlsInterests,
        ];
        // Remove duplicates by value
        const uniqueInterests = Array.from(
            new Map(allInterests.map(item => [item.value, item])).values()
        );
        return uniqueInterests;
    };

    const dynamicHeight = React.useMemo(() => {
        if (typeof window === "undefined") return "75vh";
        const vpH =
            window.visualViewport?.height && window.visualViewport.height > 0
                ? window.visualViewport.height
                : window.innerHeight;
        const target = Math.round(vpH * 0.75);
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

    const handleSave = () => {
        if (onSave) {
            onSave(interests);
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
                                Edit Interests
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
                            padding: "16px 24px",
                            paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            className="flex-1 overflow-y-auto"
                            style={{
                                WebkitOverflowScrolling: "touch",
                                touchAction: "pan-y",
                            }}
                        >
                            <MultiSelectList
                                options={getInterestOptions()}
                                selectedValues={interests}
                                onChange={setInterests}
                            />
                        </div>
                        <div className="pt-4 pb-4">
                            <Button
                                onClick={handleSave}
                                variant="primary"
                                size="large"
                                fullWidth
                                className="!font-normal"
                            >
                                Save Interests
                            </Button>
                        </div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => onOpenChange(false)} />
            </Sheet>
        </>
    );
};

export default InterestsSheet;


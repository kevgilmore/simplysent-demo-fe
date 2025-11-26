import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/Dropdown";
import { Button } from "../ui/Button";
import { clothingSizeOptions, favouriteDrinkOptions } from "./formConstants";

interface AdditionalQuestionsFormProps {
    onBack: () => void;
    onNext: (data: { clothingSize: string; favouriteDrink: string }) => void;
}

export const AdditionalQuestionsForm: React.FC<AdditionalQuestionsFormProps> = ({
    onBack,
    onNext,
}) => {
    const [clothingSize, setClothingSize] = useState("");
    const [favouriteDrink, setFavouriteDrink] = useState("");

    // Check if autofill is enabled and auto-fill if so
    useEffect(() => {
        const autofillEnabled = localStorage.getItem('ss_autofill_enabled') === 'true';
        if (autofillEnabled && !clothingSize && !favouriteDrink) {
            // Auto-fill with "m" (lowercase to match option value) and "beer"
            setClothingSize("m");
            setFavouriteDrink("beer");
        }
    }, []); // Only run once on mount

    const handleNext = () => {
        if (clothingSize && favouriteDrink) {
            onNext({ clothingSize, favouriteDrink });
        }
    };

    const canProceed = clothingSize && favouriteDrink;

    return (
        <div className="flex flex-col h-full py-4">
            <div className="text-left mb-3 flex-shrink-0">
                <p className="text-gray-700 text-base font-semibold">
                    Step 5
                </p>
            </div>

            <div className="flex-1 overflow-y-auto sheet-scrollable" style={{ overflowX: 'visible', minHeight: 0 }}>

                <div className="flex flex-col gap-6" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <Dropdown
                            label="Clothing Size"
                            placeholder="Select size"
                            value={clothingSize}
                            options={clothingSizeOptions}
                            onChange={setClothingSize}
                        />
                    </div>

                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <Dropdown
                            label="Favourite Drink"
                            placeholder="Select drink"
                            value={favouriteDrink}
                            options={favouriteDrinkOptions}
                            onChange={setFavouriteDrink}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 flex-shrink-0 mt-4 pb-3" style={{ overflow: "visible", padding: "0 4px" }}>
                <Button
                    fullWidth
                    size="large"
                    variant="secondary"
                    onClick={onBack}
                    className="!font-normal"
                >
                    Back
                </Button>
                <Button fullWidth size="large" onClick={handleNext} disabled={!canProceed} className="!font-normal">
                    Next
                </Button>
            </div>
        </div>
    );
};

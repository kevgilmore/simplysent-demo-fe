import React, { useState } from "react";
import { Dropdown } from "../ui/Dropdown";
import { Button } from "../ui/Button";
import { clothingSizeOptions, favouriteDrinkOptions } from "./formConstants";

interface Step3StyleFormProps {
    onBack: () => void;
    onNext: (data: { clothingSize: string; favouriteDrink: string }) => void;
}

export const Step3StyleForm: React.FC<Step3StyleFormProps> = ({
    onBack,
    onNext,
}) => {
    const [clothingSize, setClothingSize] = useState("");
    const [favouriteDrink, setFavouriteDrink] = useState("");

    const handleNext = () => {
        onNext({ clothingSize, favouriteDrink });
    };

    return (
        <div className="flex flex-col py-4" style={{ height: "580px" }}>
            <div className="flex-1 overflow-y-auto sheet-scrollable" style={{ overflowX: 'visible' }}>
                <div className="text-left mb-8">
                    <p className="text-gray-700 text-base font-semibold">
                        We'll tailor some gift picks to their vibe and taste.
                    </p>
                </div>

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

            <div className="flex flex-col gap-3 flex-shrink-0 mt-6 pb-3" style={{ overflow: "visible", padding: "0 4px" }}>
                <Button
                    fullWidth
                    size="large"
                    variant="secondary"
                    onClick={onBack}
                >
                    Back
                </Button>
                <Button fullWidth size="large" onClick={handleNext}>
                    Next
                </Button>
            </div>
        </div>
    );
};

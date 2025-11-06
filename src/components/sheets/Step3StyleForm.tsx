import React, { useState } from "react";
import { Dropdown } from "../ui_kit/Dropdown";
import { Button } from "../ui_kit/Button";
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
        <div className="flex flex-col gap-6 py-4">
            <div className="text-left mb-2">
                <p className="text-gray-700 text-base font-semibold">
                    Style & Favourites
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    We'll tailor some gift picks to their vibe and taste.
                </p>
            </div>

            <Dropdown
                label="Clothing Size"
                placeholder="Select size"
                value={clothingSize}
                options={clothingSizeOptions}
                onChange={setClothingSize}
            />

            <Dropdown
                label="Favourite Drink"
                placeholder="Select drink"
                value={favouriteDrink}
                options={favouriteDrinkOptions}
                onChange={setFavouriteDrink}
            />

            <div className="flex flex-col gap-3">
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

import React, { useState } from "react";
import { Button } from "../ui_kit/Button";
import { RangeSlider } from "../ui_kit/RangeSlider";
import { Loader2 } from "lucide-react";

interface Step6BudgetFormProps {
    onBack: () => void;
    onNext: (data: { minBudget: number; maxBudget: number }) => void;
}

export const Step6BudgetForm: React.FC<Step6BudgetFormProps> = ({
    onBack,
    onNext,
}) => {
    const [minBudget, setMinBudget] = useState(20);
    const [maxBudget, setMaxBudget] = useState(100);
    const [isLoading, setIsLoading] = useState(false);

    const handleBudgetChange = (min: number, max: number) => {
        setMinBudget(min);
        setMaxBudget(max);
    };

    const handleNext = () => {
        setIsLoading(true);
        // Simulate API call with delay
        setTimeout(() => {
            onNext({ minBudget, maxBudget });
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-6 py-4">
            <div className="text-left mb-2">
                <p className="text-gray-700 text-base font-semibold">Budget</p>
                <p className="text-sm text-gray-500 mt-1">
                    Finally, what's your spending range?
                </p>
            </div>

            <RangeSlider
                label="Budget Range"
                min={10}
                max={500}
                minValue={minBudget}
                maxValue={maxBudget}
                onChange={handleBudgetChange}
            />

            <div className="flex flex-col gap-3">
                <Button
                    fullWidth
                    size="large"
                    variant="secondary"
                    onClick={onBack}
                    disabled={isLoading}
                >
                    Back
                </Button>
                <Button
                    fullWidth
                    size="large"
                    variant="cta"
                    onClick={handleNext}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={20} />
                            Finding perfect gifts...
                        </span>
                    ) : (
                        "✨ Show Gift Ideas ✨"
                    )}
                </Button>
            </div>
        </div>
    );
};

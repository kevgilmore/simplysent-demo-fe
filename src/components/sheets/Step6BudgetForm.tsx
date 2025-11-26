import React, { useState } from "react";
import { Button } from "../ui/Button";
import { RangeSlider } from "../ui/RangeSlider";
import { Loader2 } from "lucide-react";

interface Step6BudgetFormProps {
    onBack: () => void;
    onNext: (data: { minBudget: number; maxBudget: number }) => void;
    isSubmitting?: boolean;
}

export const Step6BudgetForm: React.FC<Step6BudgetFormProps> = ({
    onBack,
    onNext,
    isSubmitting = false,
}) => {
    const [minBudget, setMinBudget] = useState(50);
    const [maxBudget, setMaxBudget] = useState(300);

    const handleBudgetChange = (min: number, max: number) => {
        setMinBudget(min);
        setMaxBudget(max);
    };

    const handleNext = () => {
        onNext({ minBudget, maxBudget });
    };

    return (
        <div className="flex flex-col h-full py-4">
            <div className="text-left mb-3 flex-shrink-0">
                <p className="text-gray-700 text-base font-semibold">
                    Step 6
                </p>
            </div>

            <div className="flex-1 overflow-y-auto sheet-scrollable" style={{ minHeight: 0 }}>
                <RangeSlider
                    label="Budget Range"
                    min={10}
                    max={500}
                    minValue={minBudget}
                    maxValue={maxBudget}
                    onChange={handleBudgetChange}
                />
            </div>

            <div className="flex flex-col gap-3 flex-shrink-0 mt-4 pb-3" style={{ overflow: "visible", padding: "0 4px" }}>
                <Button
                    fullWidth
                    size="large"
                    variant="secondary"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="!font-normal"
                >
                    Back
                </Button>
                <Button
                    fullWidth
                    size="large"
                    variant="cta"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="!font-normal"
                >
                    {isSubmitting ? (
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

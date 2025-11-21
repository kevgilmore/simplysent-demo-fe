import React, { useState } from "react";
import { Button } from "../ui/Button";
import { RangeSlider } from "../ui/RangeSlider";
import { Loader2, Sparkles } from "lucide-react";

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
    const [isSuccess, setIsSuccess] = useState(false);

    const handleBudgetChange = (min: number, max: number) => {
        setMinBudget(min);
        setMaxBudget(max);
    };

    const handleNext = () => {
        setIsLoading(true);
        // Simulate API call with delay, then show success animation
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            // Close sheet after success animation
            setTimeout(() => {
                onNext({ minBudget, maxBudget });
            }, 1000);
        }, 2000);
    };

    return (
        <div className="flex flex-col py-4" style={{ height: "580px" }}>
            <div className="flex-1 overflow-y-auto sheet-scrollable">
                <div className="text-left mb-8">
                    <p className="text-gray-700 text-base font-semibold">
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
            </div>

            <div className="flex flex-col gap-3 flex-shrink-0 mt-6 pb-3" style={{ overflow: "visible", padding: "0 4px" }}>
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
                    disabled={isLoading || isSuccess}
                    className={
                        isSuccess
                            ? "!bg-gradient-to-r !from-emerald-500 !via-green-500 !to-teal-500 !animate-none"
                            : ""
                    }
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={20} />
                            Finding perfect gifts...
                        </span>
                    ) : isSuccess ? (
                        <span className="flex items-center justify-center gap-2 animate-[scale-up_0.6s_ease-out]">
                            <Sparkles size={22} className="animate-pulse" />
                            Perfect! Opening...
                        </span>
                    ) : (
                        "✨ Show Gift Ideas ✨"
                    )}
                </Button>
            </div>
        </div>
    );
};

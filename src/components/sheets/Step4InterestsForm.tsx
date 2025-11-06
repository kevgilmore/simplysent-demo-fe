import React, { useState } from "react";
import { Button } from "../ui_kit/Button";
import { MultiSelectList } from "../ui_kit/MultiSelectList";
import { interestOptions } from "./formConstants";

interface Step4InterestsFormProps {
    onBack: () => void;
    onNext: (data: { interests: string[] }) => void;
}

export const Step4InterestsForm: React.FC<Step4InterestsFormProps> = ({
    onBack,
    onNext,
}) => {
    const [interests, setInterests] = useState<string[]>([]);

    const handleNext = () => {
        onNext({ interests });
    };

    return (
        <div className="flex flex-col gap-6 py-4">
            <div className="text-left mb-2">
                <p className="text-gray-700 text-base font-semibold">
                    Interests
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    What do they enjoy in their spare time?
                </p>
            </div>

            <MultiSelectList
                label="Select their interests"
                options={interestOptions}
                selectedValues={interests}
                onChange={setInterests}
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

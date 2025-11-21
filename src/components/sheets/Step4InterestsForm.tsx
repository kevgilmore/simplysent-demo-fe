import React, { useState } from "react";
import { Button } from "../ui/Button";
import { MultiSelectList } from "../ui/MultiSelectList";
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
        <div className="flex flex-col h-full py-4">
            <div className="text-left mb-3 flex-shrink-0">
                <p className="text-gray-700 text-base font-semibold">
                    What do they enjoy in their spare time?
                </p>
            </div>

            <div className="flex-1 overflow-y-auto sheet-scrollable" style={{ overflowX: 'visible', minHeight: 0 }}>
                <MultiSelectList
                    label="Select their interests"
                    options={interestOptions}
                    selectedValues={interests}
                    onChange={setInterests}
                />
            </div>

            <div className="flex flex-col gap-3 flex-shrink-0 mt-4 pb-3" style={{ overflow: "visible", padding: "0 4px" }}>
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

import React, { useState } from "react";
import { Dropdown } from "../ui_kit/Dropdown";
import { Button } from "../ui_kit/Button";
import { sentimentOptions } from "./formConstants";

interface Step5VibeFormProps {
    onBack: () => void;
    onNext: (data: { sentiment: string }) => void;
}

export const Step5VibeForm: React.FC<Step5VibeFormProps> = ({
    onBack,
    onNext,
}) => {
    const [sentiment, setSentiment] = useState("");

    const handleNext = () => {
        onNext({ sentiment });
    };

    return (
        <div className="flex flex-col gap-6 py-4">
            <div className="text-left mb-2">
                <p className="text-gray-700 text-base font-semibold">
                    Gift Vibe
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    What kind of reaction do you want to get?
                </p>
            </div>

            <Dropdown
                label="Sentiment"
                placeholder="Select vibe"
                value={sentiment}
                options={sentimentOptions}
                onChange={setSentiment}
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

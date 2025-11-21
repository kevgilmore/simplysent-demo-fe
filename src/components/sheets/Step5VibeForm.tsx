import React, { useState } from "react";
import { Dropdown } from "../ui/Dropdown";
import { Button } from "../ui/Button";
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
        <div className="flex flex-col py-4" style={{ height: "580px" }}>
            <div className="flex-1 overflow-y-auto sheet-scrollable" style={{ overflowX: 'visible' }}>
                <div className="text-left mb-8">
                    <p className="text-gray-700 text-base font-semibold">
                        What kind of reaction do you want to get?
                    </p>
                </div>

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <Dropdown
                        label="Sentiment"
                        placeholder="Select vibe"
                        value={sentiment}
                        options={sentimentOptions}
                        onChange={setSentiment}
                    />
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

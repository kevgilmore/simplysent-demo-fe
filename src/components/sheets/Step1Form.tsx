import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { SingleSelectList } from "../ui/SingleSelectList";
import { relationshipOptions } from "./formConstants";

interface Step1FormProps {
    onNext: (data: { relationship: string }) => void;
}

export const Step1Form: React.FC<Step1FormProps> = ({ onNext }) => {
    const [relationship, setRelationship] = useState("");

    // Check if autofill is enabled and auto-fill if so
    useEffect(() => {
        const autofillEnabled = localStorage.getItem('ss_autofill_enabled') === 'true';
        if (autofillEnabled) {
            // Auto-select "father" relationship (but don't auto-submit)
            setRelationship("father");
        }
    }, []); // Only run once on mount

    const handleNext = () => {
        if (relationship) {
            onNext({ relationship });
        }
    };

    return (
        <div className="flex flex-col h-full py-4">
            <div className="text-left mb-3 flex-shrink-0">
                <p className="text-gray-700 text-base font-semibold">
                    Step 1
                </p>
            </div>

            <div className="flex-1 overflow-y-auto sheet-scrollable" style={{ overflowX: 'visible', minHeight: 0 }}>
                <SingleSelectList
                    options={relationshipOptions}
                    selectedValue={relationship}
                    onChange={setRelationship}
                />
            </div>

            <div className="flex-shrink-0 mt-4 pb-3" style={{ overflow: "visible", padding: "0 4px" }}>
                <Button fullWidth size="large" onClick={handleNext} disabled={!relationship} className="!font-normal">
                    Next
                </Button>
            </div>
        </div>
    );
};


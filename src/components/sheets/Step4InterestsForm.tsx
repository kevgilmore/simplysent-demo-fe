import React, { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "../ui/Button";
import { MultiSelectList } from "../ui/MultiSelectList";
import { getInterestsForPerson } from "./formConstants";

interface Step4InterestsFormProps {
    onBack: () => void;
    onNext: (data: { interests: string[] }) => void;
    relationship?: string;
    age?: number;
    gender?: string;
}

export const Step4InterestsForm: React.FC<Step4InterestsFormProps> = ({
    onBack,
    onNext,
    relationship,
    age,
    gender,
}) => {
    const [interests, setInterests] = useState<string[]>([]);

    // Get the appropriate interests based on relationship, age, and gender
    const { primary, other } = useMemo(() => {
        return getInterestsForPerson(relationship, age, gender);
    }, [relationship, age, gender]);

    // Check if autofill is enabled and auto-fill interests when options are available
    useEffect(() => {
        const autofillEnabled = localStorage.getItem('ss_autofill_enabled') === 'true';
        if (!autofillEnabled) return;
        if (interests.length > 0) return; // Already has interests
        
        const allOptions = [...primary, ...(other || [])];
        if (allOptions.length === 0) return; // Wait for options to load
        
        // Check if "tech" and "golf" are in the available options
        const availableValues = allOptions.map(opt => opt.value);
        const autofillInterests = ["tech", "golf"].filter(val => availableValues.includes(val));
        
        if (autofillInterests.length > 0) {
            // Set interests directly - React will re-render MultiSelectList with updated selectedValues
            setInterests(autofillInterests);
        }
    }, [primary, other, interests.length]); // Run when options change or interests is empty

    const handleNext = () => {
        onNext({ interests });
    };

    return (
        <div className="flex flex-col h-full py-4">
            <div className="text-left mb-3 flex-shrink-0">
                <p className="text-gray-700 text-base font-semibold">
                    Step 4
                </p>
            </div>

            <div className="flex-1 overflow-y-auto sheet-scrollable" style={{ overflowX: 'visible', minHeight: 0 }}>
                <div className="flex flex-col gap-6">
                    <MultiSelectList
                        key={`primary-${interests.join(',')}`}
                        options={primary}
                        selectedValues={interests}
                        onChange={setInterests}
                    />
                    
                    {other && other.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-600 mb-3 font-medium">Other</p>
                            <MultiSelectList
                                key={`other-${interests.join(',')}`}
                                options={other}
                                selectedValues={interests}
                                onChange={setInterests}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3 flex-shrink-0 mt-4 pb-3" style={{ overflow: "visible", padding: "0 4px" }}>
                <Button
                    fullWidth
                    size="large"
                    variant="secondary"
                    onClick={onBack}
                    className="!font-normal"
                >
                    Back
                </Button>
                <Button fullWidth size="large" onClick={handleNext} className="!font-normal">
                    Next
                </Button>
            </div>
        </div>
    );
};

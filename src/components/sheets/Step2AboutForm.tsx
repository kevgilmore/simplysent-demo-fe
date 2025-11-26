import React, { useState } from "react";
import { Dropdown } from "../ui/Dropdown";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { genderOptions } from "./formConstants";

interface Step2AboutFormProps {
    onBack: () => void;
    onNext: (data: { name?: string; gender?: string }) => void;
    relationship?: string;
}

// Relationships where gender can be inferred
const GENDER_INFERRED_RELATIONSHIPS = ["mother", "father", "brother", "sister", "son", "daughter"];

// Relationships where name might not be needed (can use relationship as name)
const NAME_NOT_NEEDED_RELATIONSHIPS = ["mother", "father"];

export const Step2AboutForm: React.FC<Step2AboutFormProps> = ({
    onBack,
    onNext,
    relationship = "",
}) => {
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");

    // Determine if we need to show name and gender fields
    const showName = !NAME_NOT_NEEDED_RELATIONSHIPS.includes(relationship);
    const showGender = !GENDER_INFERRED_RELATIONSHIPS.includes(relationship);

    const handleNext = () => {
        const data: { name?: string; gender?: string } = {};
        if (showName && name) {
            data.name = name;
        }
        if (showGender && gender) {
            data.gender = gender;
        }
        onNext(data);
    };

    return (
        <div className="flex flex-col h-full py-4">
            <div className="text-left mb-6 flex-shrink-0">
                <p className="text-gray-700 text-base font-semibold">
                    Step 2
                </p>
            </div>

            <div className="flex-1 overflow-y-auto sheet-scrollable" style={{ overflowX: 'visible', minHeight: 0 }}>
                <div className="flex flex-col gap-6" style={{ position: 'relative', zIndex: 1 }}>
                    {showName && (
                        <div className="space-y-2">
                            <TextInput
                                label="Name"
                                placeholder="Enter their name"
                                value={name}
                                onChange={setName}
                            />
                        </div>
                    )}

                    {showGender && (
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <Dropdown
                                label="Gender (optional)"
                                placeholder="Select gender"
                                value={gender}
                                options={genderOptions}
                                onChange={setGender}
                            />
                        </div>
                    )}

                    {!showName && !showGender && (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-gray-500 text-sm text-center">
                                All information can be inferred from the relationship.
                            </p>
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

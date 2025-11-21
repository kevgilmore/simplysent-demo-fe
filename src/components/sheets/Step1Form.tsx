import React, { useState } from "react";
import { Dropdown } from "../ui/Dropdown";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { relationshipOptions, occasionOptions } from "./formConstants";

interface Step1FormProps {
    onNext: (data: { relationship: string; name: string; occasion: string }) => void;
}

export const Step1Form: React.FC<Step1FormProps> = ({ onNext }) => {
    const [relationship, setRelationship] = useState("");
    const [name, setName] = useState("");
    const [occasion, setOccasion] = useState("");

    const handleNext = () => {
        onNext({ relationship, name, occasion });
    };

    return (
        <div className="flex flex-col py-4" style={{ height: "580px" }}>
            <div className="flex-1 overflow-y-auto sheet-scrollable" style={{ overflowX: 'visible' }}>
                <div className="text-left mb-8">
                    <p className="text-gray-700 text-base font-semibold">
                        Who are we shopping for?
                    </p>
                </div>

                <div className="flex flex-col gap-6" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <Dropdown
                            label="Relationship"
                            placeholder="Select relationship"
                            value={relationship}
                            options={relationshipOptions}
                            onChange={setRelationship}
                        />
                    </div>

                    <TextInput
                        label="Name"
                        placeholder="Enter their name"
                        value={name}
                        onChange={setName}
                    />

                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <Dropdown
                            label="Occasion"
                            placeholder="Select occasion"
                            value={occasion}
                            options={occasionOptions}
                            onChange={setOccasion}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0 mt-6 pb-3" style={{ overflow: "visible", padding: "0 4px" }}>
                <Button fullWidth size="large" onClick={handleNext}>
                    Next
                </Button>
            </div>
        </div>
    );
};


import React, { useState } from "react";
import { Dropdown } from "../ui/Dropdown";
import { Button } from "../ui/Button";
import { ageOptions, genderOptions } from "./formConstants";

interface Step2AboutThemProps {
    onBack: () => void;
    onNext: (data: { age: string; gender: string }) => void;
}

export const Step2AboutForm: React.FC<Step2AboutThemProps> = ({
    onBack,
    onNext,
}) => {
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");

    const handleNext = () => {
        onNext({ age, gender });
    };

    return (
        <div className="flex flex-col py-4" style={{ height: "580px" }}>
            <div className="flex-1 overflow-y-auto" style={{ overflowX: 'visible' }}>
                <div className="text-left mb-8">
                    <p className="text-gray-700 text-base font-semibold">
                        About Them
                    </p>
                </div>

                <div className="flex flex-col gap-6" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <Dropdown
                            label="Age"
                            placeholder="Select age"
                            value={age}
                            options={ageOptions}
                            onChange={setAge}
                        />
                    </div>

                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <Dropdown
                            label="Gender"
                            placeholder="Select gender"
                            value={gender}
                            options={genderOptions}
                            onChange={setGender}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 flex-shrink-0 mt-6 pb-3" style={{ overflow: "visible" }}>
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

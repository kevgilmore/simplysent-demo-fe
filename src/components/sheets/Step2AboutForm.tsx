import React, { useState } from "react";
import { Dropdown } from "../ui_kit/Dropdown";
import { Button } from "../ui_kit/Button";
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
            <div className="flex-1 overflow-y-auto">
                <div className="text-left mb-8">
                    <p className="text-gray-700 text-base font-semibold">
                        About Them
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    <Dropdown
                        label="Age"
                        placeholder="Select age"
                        value={age}
                        options={ageOptions}
                        onChange={setAge}
                    />

                    <Dropdown
                        label="Gender"
                        placeholder="Select gender"
                        value={gender}
                        options={genderOptions}
                        onChange={setGender}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 flex-shrink-0 mt-6">
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

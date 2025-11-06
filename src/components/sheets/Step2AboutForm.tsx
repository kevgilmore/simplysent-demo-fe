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
    const [age, setAge] = useState("25");
    const [gender, setGender] = useState("male");

    const handleNext = () => {
        onNext({ age, gender });
    };

    return (
        <div className="flex flex-col gap-6 py-4">
            <div className="text-left mb-2">
                <p className="text-gray-700 text-base font-semibold">
                    About Them
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    A few quick details to help personalize ideas.
                </p>
            </div>

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

            <div className="flex flex-col gap-3">
                <Button
                    fullWidth
                    size="large"
                    variant="secondary"
                    onClick={onBack}
                >
                    Back
                </Button>
                <Button
                    fullWidth
                    size="large"
                    onClick={handleNext}
                    disabled={!age || !gender}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

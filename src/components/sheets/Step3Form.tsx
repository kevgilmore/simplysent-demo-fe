import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { TextInput } from "../ui/TextInput";
import { Dropdown } from "../ui/Dropdown";

interface Step3FormProps {
    onBack: () => void;
    onNext: (data: { dob?: string; age?: number; ageMonth?: string; ageDay?: string }) => void;
}

const DAYS = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
}));

const MONTHS = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => ({
    value: String(CURRENT_YEAR - i),
    label: String(CURRENT_YEAR - i),
}));

export const Step3Form: React.FC<Step3FormProps> = ({
    onBack,
    onNext,
}) => {
    const [useAge, setUseAge] = useState(false);
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [age, setAge] = useState("");
    const [ageMonth, setAgeMonth] = useState("");
    const [ageDay, setAgeDay] = useState("");
    const [calculatedYear, setCalculatedYear] = useState<number | null>(null);
    const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

    // Calculate year of birth when age is entered
    useEffect(() => {
        if (useAge && age && age.trim() !== "") {
            const ageNum = parseInt(age.trim());
            if (!isNaN(ageNum) && ageNum > 0 && ageNum <= 120) {
                const today = new Date();
                const birthYear = today.getFullYear() - ageNum;
                setCalculatedYear(birthYear);
            } else {
                setCalculatedYear(null);
            }
        } else {
            setCalculatedYear(null);
        }
    }, [age, useAge]);

    // Calculate age from date of birth
    useEffect(() => {
        if (!useAge && day && month && year) {
            try {
                const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                const today = new Date();
                let calculatedAgeValue = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    calculatedAgeValue--;
                }
                if (calculatedAgeValue >= 0 && calculatedAgeValue <= 120) {
                    setCalculatedAge(calculatedAgeValue);
                } else {
                    setCalculatedAge(null);
                }
            } catch (e) {
                setCalculatedAge(null);
            }
        } else {
            setCalculatedAge(null);
        }
    }, [day, month, year, useAge]);

    const handleNext = () => {
        if (useAge && age && age.trim() !== "") {
            const ageNum = parseInt(age.trim());
            if (!isNaN(ageNum) && ageNum > 0 && ageNum <= 120) {
                const data: { age: number; ageMonth?: string; ageDay?: string } = { age: ageNum };
                if (ageMonth) data.ageMonth = ageMonth;
                if (ageDay) data.ageDay = ageDay;
                onNext(data);
            }
        } else if (day && month && year) {
            // Format as DD/MM/YYYY
            const dob = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
            onNext({ dob });
        }
    };

    const canProceed = useAge 
        ? (age && age.trim() !== "" && calculatedYear !== null)
        : (day && month && year);

    return (
        <div className="flex flex-col h-full py-4">
            <div className="text-left mb-3 flex-shrink-0">
                <p className="text-gray-700 text-base font-semibold">
                    Step 3
                </p>
            </div>

            <div className="flex-1 overflow-y-auto sheet-scrollable" style={{ overflowX: 'visible', minHeight: 0 }}>

                <div className="flex flex-col gap-6" style={{ position: 'relative', zIndex: 1 }}>
                    {/* Toggle between DOB and Age */}
                    <div className="flex gap-2 mb-2">
                        <button
                            type="button"
                            onClick={() => {
                                setUseAge(false);
                                setAge(""); // Reset age when switching to DOB
                                setAgeMonth("");
                                setAgeDay("");
                            }}
                            className={`flex-1 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                                !useAge
                                    ? "bg-[#5E57AC] text-white"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            Date of Birth
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setUseAge(true);
                                setDay(""); // Reset DOB fields when switching to age
                                setMonth("");
                                setYear("");
                            }}
                            className={`flex-1 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                                useAge
                                    ? "bg-[#5E57AC] text-white"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            Current Age
                        </button>
                    </div>

                    {!useAge ? (
                        // Date of Birth pickers
                        <div className="flex flex-col gap-4">
                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <Dropdown
                                    label="Day"
                                    placeholder="Day"
                                    value={day}
                                    options={DAYS}
                                    onChange={setDay}
                                />
                            </div>
                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <Dropdown
                                    label="Month"
                                    placeholder="Month"
                                    value={month}
                                    options={MONTHS}
                                    onChange={setMonth}
                                />
                            </div>
                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <Dropdown
                                    label="Year"
                                    placeholder="Year"
                                    value={year}
                                    options={YEARS}
                                    onChange={setYear}
                                />
                            </div>
                            {calculatedAge !== null && (
                                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border-2 border-purple-200/50 shadow-sm">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">Age</span>
                                        <span className="text-2xl font-bold text-[#5E57AC]">{calculatedAge}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Age input with optional month and day
                        <div className="flex flex-col gap-4">
                            <TextInput
                                label="Current Age"
                                placeholder="Enter age"
                                value={age}
                                onChange={(value) => {
                                    // Allow only numbers
                                    const numericValue = value.replace(/[^0-9]/g, '');
                                    setAge(numericValue);
                                }}
                                type="text"
                                inputMode="numeric"
                            />
                            {age && age.trim() !== "" && calculatedYear === null && (
                                <p className="text-sm text-red-600 px-2">
                                    Please enter a valid age (1-120)
                                </p>
                            )}
                            
                            {/* Optional month and day */}
                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <Dropdown
                                    label="Month (optional)"
                                    placeholder="Select month"
                                    value={ageMonth}
                                    options={MONTHS}
                                    onChange={setAgeMonth}
                                />
                            </div>
                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <Dropdown
                                    label="Day (optional)"
                                    placeholder="Select day"
                                    value={ageDay}
                                    options={DAYS}
                                    onChange={setAgeDay}
                                />
                            </div>
                            
                            {calculatedYear !== null && (
                                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border-2 border-purple-200/50 shadow-sm">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">Year of birth</span>
                                        <span className="text-2xl font-bold text-[#5E57AC]">{calculatedYear}</span>
                                    </div>
                                </div>
                            )}
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
                <Button 
                    fullWidth 
                    size="large" 
                    onClick={handleNext}
                    disabled={!canProceed}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};


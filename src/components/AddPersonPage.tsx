import React, { useState } from "react";
import { Drawer } from "./ui_kit/Drawer";
import { Dropdown } from "./ui_kit/Dropdown";
import { TextInput } from "./ui_kit/TextInput";
import { Button } from "./ui_kit/Button";

interface AddPersonPageProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddPersonPage: React.FC<AddPersonPageProps> = ({
    open,
    onOpenChange,
}) => {
    const [name, setName] = useState("");
    const [relationship, setRelationship] = useState("");
    const [birthday, setBirthday] = useState("");

    const relationshipOptions = [
        { value: "family", label: "Family" },
        { value: "friend", label: "Friend" },
        { value: "colleague", label: "Colleague" },
        { value: "partner", label: "Partner" },
        { value: "other", label: "Other" },
    ];

    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            height="90vh"
            title="Add Person"
        >
            <div className="w-full">
                <p className="text-gray-600 mb-6">
                    Add a new person to your gift list
                </p>

                {/* Form fields */}
                <div className="space-y-6 w-full">
                    <div className="w-full">
                        <TextInput
                            label="Name"
                            placeholder="Enter name"
                            value={name}
                            onChange={setName}
                        />
                    </div>

                    <div className="w-full">
                        <Dropdown
                            label="Relationship"
                            placeholder="Select relationship"
                            value={relationship}
                            options={relationshipOptions}
                            onChange={setRelationship}
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Birthday (Optional)
                        </label>
                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-4 focus:ring-[#5E57AC]/20 focus:border-[#5E57AC] transition-all duration-200"
                        />
                    </div>

                    <div className="pt-4 w-full">
                        <Button
                            fullWidth
                            variant="primary"
                            size="large"
                            onClick={() => {
                                // Handle add person logic here
                                console.log({
                                    name,
                                    relationship,
                                    birthday,
                                });
                                onOpenChange(false);
                            }}
                        >
                            Add Person
                        </Button>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

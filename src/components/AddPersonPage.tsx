import React from "react";
import { Drawer } from "./ui/Drawer";

interface AddPersonPageProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddPersonPage: React.FC<AddPersonPageProps> = ({
    open,
    onOpenChange,
}) => {
    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            height="90vh"
            title="Add Person"
        >
            <div className="flex flex-col h-full">
                <p className="text-gray-600 mb-4">
                    Content for adding a new person goes here...
                </p>

                {/* Example form fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Relationship
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>Select relationship</option>
                            <option>Family</option>
                            <option>Friend</option>
                            <option>Colleague</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

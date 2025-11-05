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
            height="85vh"
            title="Add Person"
        >
            <div className="flex flex-col h-full overflow-y-auto">
                <p className="text-gray-600 mb-6">
                    Add a new person to your gift list
                </p>

                {/* Example form fields */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E57AC]"
                            placeholder="Enter name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Relationship
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E57AC]">
                            <option>Select relationship</option>
                            <option>Family</option>
                            <option>Friend</option>
                            <option>Colleague</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Birthday (Optional)
                        </label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E57AC]"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="button"
                            className="w-full px-6 py-4 text-lg font-semibold rounded-full transition-all duration-200 bg-[#5E57AC] text-white hover:bg-[#4e47a0] focus:outline-none focus:ring-4 focus:ring-[#5E57AC]/30 shadow-md hover:shadow-lg"
                        >
                            Add Person
                        </button>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

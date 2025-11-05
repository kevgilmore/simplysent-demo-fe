import React from "react";
import { X } from "lucide-react";
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
        <Drawer open={open} onOpenChange={onOpenChange} height="90vh">
            <div className="flex flex-col h-full">
                {/* Close button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Add Person
                    </h2>
                    <p className="text-gray-600">
                        Content for adding a new person goes here...
                    </p>
                </div>
            </div>
        </Drawer>
    );
};

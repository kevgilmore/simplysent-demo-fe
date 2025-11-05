import React from "react";
import { Sheet } from "react-modal-sheet";

interface AddPersonPageProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddPersonPage: React.FC<AddPersonPageProps> = ({
    open,
    onOpenChange,
}) => {
    return (
        <Sheet isOpen={open} onClose={() => onOpenChange(false)}>
            <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content>
                    <div className="w-full h-[60dvh] flex items-center justify-center">
                        <img src="/logo.png" alt="Graphic" className="h-24 w-24 opacity-90" />
                    </div>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop />
        </Sheet>
    );
};

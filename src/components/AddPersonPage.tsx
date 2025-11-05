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
        <>
            {open && (
                <div
                    style={{
                        position: "fixed",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "max(140px, calc(env(safe-area-inset-bottom) + 120px))",
                        // subtle, neutral overlay to mask underlapping content behind Safari toolbar
                        background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.06), rgba(0,0,0,0.10))",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        pointerEvents: "none",
                        zIndex: 9980,
                    }}
                />
            )}
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
        </>
    );
};

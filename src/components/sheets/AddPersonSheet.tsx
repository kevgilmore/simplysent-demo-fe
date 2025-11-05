import React from "react";
import { Sheet } from "react-modal-sheet";
import { SheetCloseButton } from "./SheetCloseButton";

interface AddPersonSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddPersonSheet: React.FC<AddPersonSheetProps> = ({
    open,
    onOpenChange,
}) => {
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);
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
                    <Sheet.Header>
                        <div
                            className="flex items-center justify-between px-7 py-4"
                            style={{ minHeight: "76px" }}
                        >
                            <h2 className="flex-1 text-center text-2xl font-bold text-gray-800">
                                Add Person
                            </h2>
                            <SheetCloseButton
                                onClick={() => onOpenChange(false)}
                                size={40}
                            />
                        </div>
                    </Sheet.Header>
                    <Sheet.Content>
                        <div className="w-full h-[60dvh] flex items-center justify-center">
                            <img
                                src="/undraw_mindfulness_d853.svg"
                                alt="Add Person Illustration"
                                className="h-64 w-64 opacity-90"
                            />
                        </div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
        </>
    );
};

import React from "react";
import { Sheet } from "react-modal-sheet";
import { X } from "lucide-react";

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
                        <div className="px-5 py-4 text-center relative">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Add Person
                            </h2>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-6 h-6 text-gray-700" />
                            </button>
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

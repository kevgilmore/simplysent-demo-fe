import React from "react";
import { Sheet } from "react-modal-sheet";
import { X } from "lucide-react";

interface DrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    title?: string;
    height?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
    open,
    onOpenChange,
    children,
    title,
    height = "85vh",
}) => {
    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Sheet
            isOpen={open}
            onClose={handleClose}
            disableDrag={true}
            detent="default"
        >
            <Sheet.Container
                style={{
                    borderTopLeftRadius: "24px",
                    borderTopRightRadius: "24px",
                    boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.15)",
                    height: height,
                    maxHeight: height,
                }}
            >
                <Sheet.Header>
                    <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            {title && (
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {title}
                                </h2>
                            )}
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-auto"
                                aria-label="Close"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </Sheet.Header>

                <Sheet.Content
                    style={{
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        paddingTop: "16px",
                        paddingBottom:
                            "calc(env(safe-area-inset-bottom) + 16px)",
                        overflowY: "auto",
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    {children}
                </Sheet.Content>
            </Sheet.Container>

            <Sheet.Backdrop
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "saturate(180%) blur(4px)",
                    WebkitBackdropFilter: "saturate(180%) blur(4px)",
                }}
                onTap={handleClose}
            />
        </Sheet>
    );
};

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

    // Convert vh to number for Sheet's snapPoints
    const heightValue = parseFloat(height) / 100;

    return (
        <Sheet
            isOpen={open}
            onClose={handleClose}
            snapPoints={[0, heightValue]}
            initialSnap={1}
            disableDrag={false}
        >
            {/* Custom backdrop with blur */}
            <Sheet.Backdrop
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "saturate(180%) blur(4px)",
                    WebkitBackdropFilter: "saturate(180%) blur(4px)",
                }}
                onTap={handleClose}
            />

            <Sheet.Container
                style={{
                    borderTopLeftRadius: "24px",
                    borderTopRightRadius: "24px",
                    boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.15)",
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
                        paddingLeft: "max(20px, env(safe-area-inset-left))",
                        paddingRight: "max(20px, env(safe-area-inset-right))",
                        paddingTop: "16px",
                        paddingBottom: "24px",
                    }}
                >
                    <div className="max-w-full box-border">{children}</div>
                </Sheet.Content>
            </Sheet.Container>
        </Sheet>
    );
};

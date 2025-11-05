import React, { useEffect, useState } from "react";
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
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            setIsClosing(false);
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onOpenChange(false);
            setIsClosing(false);
        }, 200);
    };

    if (!open && !isClosing) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${
                    open && !isClosing ? "opacity-100" : "opacity-0"
                }`}
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                }}
                onClick={handleClose}
            />

            {/* Drawer */}
            <div
                className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
                style={{
                    height,
                    minHeight: height,
                    maxHeight: "100dvh",
                    transform: isClosing ? "translateY(100%)" : "translateY(0)",
                    transition: isClosing
                        ? "transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)"
                        : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    paddingBottom: "env(safe-area-inset-bottom)",
                }}
            >
                {/* Header with close button */}
                <div className="flex-shrink-0 px-6 pt-6 pb-4">
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

                {/* Content Area */}
                <div
                    className="flex-1 overflow-hidden px-6 pb-6"
                    style={{
                        paddingBottom:
                            "calc(env(safe-area-inset-bottom) + 24px)",
                    }}
                >
                    {children}
                </div>
            </div>
        </>
    );
};

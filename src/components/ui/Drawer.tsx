import React, { useEffect, useState, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface DrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    title?: string;
    height?: string;
    showHandle?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
    open,
    onOpenChange,
    children,
    title,
    height = "85vh",
    showHandle = true,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [startY, setStartY] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            setIsClosing(false);
            setDragOffset(0);
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const handleDragStart = useCallback((clientY: number) => {
        setIsDragging(true);
        setStartY(clientY);
        setDragOffset(0);
    }, []);

    const handleDragMove = useCallback(
        (clientY: number) => {
            if (!isDragging) return;
            const delta = clientY - startY;
            if (delta > 0) {
                setDragOffset(delta);
            }
        },
        [isDragging, startY],
    );

    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);

        if (dragOffset > 100) {
            setIsClosing(true);
            setTimeout(() => {
                onOpenChange(false);
                setDragOffset(0);
                setIsClosing(false);
            }, 200);
        } else {
            setDragOffset(0);
        }
    }, [isDragging, dragOffset, onOpenChange]);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            handleDragMove(e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                handleDragMove(e.touches[0].clientY);
            }
        };

        const handleMouseUp = () => handleDragEnd();
        const handleTouchEnd = () => handleDragEnd();

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    if (!open && !isClosing) return null;

    const transform = isClosing
        ? "translateY(100%)"
        : isDragging
          ? `translateY(${dragOffset}px)`
          : "translateY(0)";

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${
                    open && !isClosing ? "opacity-100" : "opacity-0"
                }`}
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                }}
                onClick={() => {
                    setIsClosing(true);
                    setTimeout(() => {
                        onOpenChange(false);
                        setIsClosing(false);
                    }, 200);
                }}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col"
                style={{
                    height,
                    maxHeight: "96vh",
                    transform,
                    transition: isDragging ? "none" : "transform 0.3s ease-out",
                    touchAction: "none",
                    paddingBottom: "env(safe-area-inset-bottom)",
                }}
            >
                {/* Drag Handle Area */}
                <div
                    ref={dragHandleRef}
                    className="flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
                    style={{
                        touchAction: "none",
                        WebkitUserSelect: "none",
                        userSelect: "none",
                    }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleDragStart(e.clientY);
                    }}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        handleDragStart(e.touches[0].clientY);
                    }}
                >
                    {showHandle && (
                        <div className="flex justify-center pt-4 pb-2">
                            <div className="w-12 h-1.5 rounded-full bg-gray-300" />
                        </div>
                    )}
                </div>

                {/* Header with Close Button */}
                <div className="flex-shrink-0 flex items-start justify-between px-6 pb-4">
                    {title && (
                        <h2 className="text-2xl font-bold text-gray-800 pt-2">
                            {title}
                        </h2>
                    )}
                    <button
                        onClick={() => {
                            setIsClosing(true);
                            setTimeout(() => {
                                onOpenChange(false);
                                setIsClosing(false);
                            }, 200);
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                        aria-label="Close"
                        style={{
                            marginLeft: title ? "auto" : "0",
                        }}
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Content Area - Non-scrollable */}
                <div
                    className="flex-1 px-6 pb-6 overflow-hidden"
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

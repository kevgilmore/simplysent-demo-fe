import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export const AddPersonPage: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [dragStartY, setDragStartY] = useState(0);
    const [dragCurrentY, setDragCurrentY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        // Open the modal on mount
        setIsOpen(true);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
            navigate("/new");
        }, 300); // Wait for animation to complete
    };

    const handleDragStart = useCallback((clientY: number) => {
        setDragStartY(clientY);
        setDragCurrentY(clientY);
        setIsDragging(true);
    }, []);

    const handleDragMove = useCallback(
        (clientY: number) => {
            if (isDragging) {
                const delta = clientY - dragStartY;
                if (delta > 0) {
                    setDragCurrentY(clientY);
                }
            }
        },
        [isDragging, dragStartY],
    );

    const handleDragEnd = useCallback(() => {
        if (isDragging) {
            const delta = dragCurrentY - dragStartY;
            if (delta > 100) {
                handleClose();
            }
            setIsDragging(false);
            setDragStartY(0);
            setDragCurrentY(0);
        }
    }, [isDragging, dragCurrentY, dragStartY]);

    useEffect(() => {
        if (isDragging) {
            const handleMouseMove = (e: MouseEvent) => {
                e.preventDefault();
                handleDragMove(e.clientY);
            };
            const handleTouchMove = (e: TouchEvent) => {
                e.preventDefault();
                handleDragMove(e.touches[0].clientY);
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
        }
    }, [isDragging, handleDragMove, handleDragEnd]);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={handleClose}
                ></div>
            )}

            {/* Slide-in Panel */}
            <div
                className={`fixed inset-x-0 bg-white rounded-t-3xl shadow-2xl z-50 ${
                    isDragging
                        ? ""
                        : "transition-transform duration-300 ease-out"
                } ${isOpen ? "translate-y-0" : "translate-y-full"}`}
                style={{
                    height: "90vh",
                    bottom: "0",
                    paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
                    transform: isDragging
                        ? `translateY(${Math.max(0, dragCurrentY - dragStartY)}px)`
                        : undefined,
                }}
            >
                <div className="h-full flex flex-col p-6 overflow-hidden">
                    {/* Handle bar for dragging */}
                    <div
                        className="flex justify-center mb-4 cursor-grab active:cursor-grabbing py-2"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDragStart(e.clientY);
                        }}
                        onTouchStart={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDragStart(e.touches[0].clientY);
                        }}
                    >
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                    </div>

                    {/* Close button */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Add Person
                        </h2>
                        <p className="text-gray-600">
                            Content for adding a new person goes here...
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

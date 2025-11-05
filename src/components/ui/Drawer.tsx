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
    const [velocity, setVelocity] = useState(0);
    const drawerRef = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);
    const lastMoveTime = useRef<number>(Date.now());
    const lastMoveY = useRef<number>(0);
    const animationFrame = useRef<number | null>(null);

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
        if (animationFrame.current) {
            cancelAnimationFrame(animationFrame.current);
        }
        setIsDragging(true);
        setStartY(clientY);
        setDragOffset(0);
        setVelocity(0);
        lastMoveTime.current = Date.now();
        lastMoveY.current = clientY;
    }, []);

    const handleDragMove = useCallback(
        (clientY: number) => {
            if (!isDragging) return;
            const now = Date.now();
            const timeDelta = now - lastMoveTime.current;
            const delta = clientY - startY;

            if (delta >= 0) {
                // Move 1:1 with finger when dragging down (like iOS)
                setDragOffset(delta);

                // Calculate velocity for momentum
                if (timeDelta > 0) {
                    const velocityValue =
                        (clientY - lastMoveY.current) / timeDelta;
                    setVelocity(velocityValue);
                }

                lastMoveTime.current = now;
                lastMoveY.current = clientY;
            }
        },
        [isDragging, startY],
    );

    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);

        // Check velocity and position for momentum-based close
        const shouldClose =
            dragOffset > 100 || (velocity > 0.5 && dragOffset > 50);

        if (shouldClose) {
            setIsClosing(true);
            setTimeout(() => {
                onOpenChange(false);
                setDragOffset(0);
                setIsClosing(false);
            }, 250);
        } else {
            // Spring back animation
            const springBack = () => {
                setDragOffset((prev) => {
                    const newOffset = prev * 0.7; // Exponential decay
                    if (Math.abs(newOffset) < 0.5) {
                        return 0;
                    }
                    animationFrame.current = requestAnimationFrame(springBack);
                    return newOffset;
                });
            };
            animationFrame.current = requestAnimationFrame(springBack);
        }
    }, [isDragging, dragOffset, velocity, onOpenChange]);

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
        : `translateY(${dragOffset}px)`;

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
                    transition: isDragging
                        ? "none"
                        : isClosing
                          ? "transform 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)"
                          : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    touchAction: "none",
                    paddingBottom: "env(safe-area-inset-bottom)",
                    willChange: "transform",
                }}
            >
                {/* Drag Handle Area - Large touch target (entire top section) */}
                <div
                    ref={dragHandleRef}
                    className="flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
                    style={{
                        touchAction: "none",
                        WebkitUserSelect: "none",
                        userSelect: "none",
                        paddingTop: "16px",
                        paddingBottom: "16px",
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
                    {/* Grey line centered */}
                    {showHandle && (
                        <div className="flex justify-center py-3">
                            <div className="w-12 h-1.5 rounded-full bg-gray-300" />
                        </div>
                    )}

                    {/* Title and Close button row */}
                    <div className="flex items-center justify-between px-6 py-2">
                        {title && (
                            <h2 className="text-2xl font-bold text-gray-800">
                                {title}
                            </h2>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsClosing(true);
                                setTimeout(() => {
                                    onOpenChange(false);
                                    setIsClosing(false);
                                }, 200);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 z-10"
                            aria-label="Close"
                            style={{
                                marginLeft: title ? "auto" : "0",
                            }}
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Content Area - Non-scrollable */}
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

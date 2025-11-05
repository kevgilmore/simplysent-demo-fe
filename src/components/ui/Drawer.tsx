import React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

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
    return (
        <DrawerPrimitive.Root
            open={open}
            onOpenChange={onOpenChange}
            dismissible={true}
            shouldScaleBackground={false}
            preventScrollRestoration={true}
            modal={true}
        >
            <DrawerPrimitive.Portal>
                <DrawerPrimitive.Overlay
                    className="fixed inset-0 z-40"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                    }}
                />
                <DrawerPrimitive.Content
                    className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-white rounded-t-3xl shadow-2xl outline-none"
                    style={{
                        height,
                        maxHeight: "95vh",
                    }}
                >
                    <div
                        className="flex flex-col h-full"
                        vaul-drawer-wrapper=""
                    >
                        {showHandle && (
                            <div
                                className="flex justify-center py-4 flex-shrink-0 touch-none"
                                data-vaul-drag-handle=""
                            >
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing" />
                            </div>
                        )}
                        {title && (
                            <div className="px-6 pb-4 flex-shrink-0">
                                <DrawerPrimitive.Title className="text-2xl font-bold text-gray-800">
                                    {title}
                                </DrawerPrimitive.Title>
                            </div>
                        )}
                        <div
                            className="flex-1 overflow-y-auto px-6 pb-6"
                            style={{
                                paddingBottom:
                                    "calc(env(safe-area-inset-bottom) + 24px)",
                                overscrollBehavior: "contain",
                            }}
                            data-vaul-no-drag
                        >
                            {children}
                        </div>
                    </div>
                </DrawerPrimitive.Content>
            </DrawerPrimitive.Portal>
        </DrawerPrimitive.Root>
    );
};

interface DrawerTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

export const DrawerTrigger: React.FC<DrawerTriggerProps> = ({
    children,
    asChild,
}) => {
    return (
        <DrawerPrimitive.Trigger asChild={asChild}>
            {children}
        </DrawerPrimitive.Trigger>
    );
};

export const DrawerClose = DrawerPrimitive.Close;

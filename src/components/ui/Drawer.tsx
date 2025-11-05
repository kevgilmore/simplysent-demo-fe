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
            modal={true}
            shouldScaleBackground={false}
        >
            <DrawerPrimitive.Portal>
                <DrawerPrimitive.Overlay
                    className="fixed inset-0 bg-black/40 z-40"
                    style={{
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                    }}
                />
                <DrawerPrimitive.Content
                    className="bg-white flex flex-col rounded-t-3xl h-full max-h-[96vh] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none"
                    style={{
                        height: height,
                    }}
                >
                    {showHandle && (
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8 mt-4" />
                    )}
                    {title && (
                        <div className="px-6 pb-4">
                            <DrawerPrimitive.Title className="text-2xl font-bold text-gray-800">
                                {title}
                            </DrawerPrimitive.Title>
                        </div>
                    )}
                    <div
                        className="overflow-y-auto px-6 pb-6 flex-1"
                        style={{
                            overscrollBehavior: "contain",
                            WebkitOverflowScrolling: "touch",
                        }}
                    >
                        {children}
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

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { X } from "lucide-react";
import { TextInput } from "../ui_kit/TextInput";
import { Dropdown } from "../ui_kit/Dropdown";
import { Button } from "../ui_kit/Button";

/**
 * ActionPersonSheet
 *
 * Multi-step bottom sheet for adding a person with iOS Safari safe-area support
 */
export interface ActionPersonSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    children?: React.ReactNode;
    snapPoints?: number[];
    initialSnap?: number;
}

const DEFAULT_SNAP_POINTS = [0, 1];

export const ActionPersonSheet: React.FC<ActionPersonSheetProps> = ({
    open,
    onOpenChange,
    title = "Add Person",
    children,
    snapPoints = DEFAULT_SNAP_POINTS,
    initialSnap = 1,
}) => {
    const sheetRef = useRef<SheetRef>(null);
    const scrollLockRef = useRef<number>(0);

    // Stable pixel height derived from visualViewport
    const dynamicHeight = React.useMemo(() => {
        if (typeof window === "undefined") return "90vh";
        const vpH =
            window.visualViewport?.height && window.visualViewport.height > 0
                ? window.visualViewport.height
                : window.innerHeight;
        const target = Math.round(vpH * 0.9 + 12);
        return `${target}px`;
    }, [open]);

    // Robust iOS Safari scroll lock using position fixed method
    useEffect(() => {
        if (open) {
            scrollLockRef.current = window.scrollY;

            const prevOverflow = document.body.style.overflow;
            const prevPosition = document.body.style.position;
            const prevTop = document.body.style.top;
            const prevLeft = document.body.style.left;
            const prevRight = document.body.style.right;
            const prevWidth = document.body.style.width;

            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollLockRef.current}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.width = "100%";

            return () => {
                document.body.style.overflow = prevOverflow;
                document.body.style.position = prevPosition;
                document.body.style.top = prevTop;
                document.body.style.left = prevLeft;
                document.body.style.right = prevRight;
                document.body.style.width = prevWidth;
                window.scrollTo(0, scrollLockRef.current);
            };
        }
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
                        height: "max(env(safe-area-inset-bottom), 60px)",
                        background: "rgba(255, 0, 0, 0.7)",
                        pointerEvents: "none",
                        zIndex: 9998,
                    }}
                />
            )}

            <Sheet
                ref={sheetRef}
                isOpen={open}
                onClose={() => onOpenChange(false)}
                snapPoints={[0, 1]}
                initialSnap={1}
                disableDrag={true}
            >
                <Sheet.Container
                    style={{
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                        height: dynamicHeight,
                    }}
                >
                    <Sheet.Header>
                        <div
                            className="flex items-center justify-center px-6"
                            style={{
                                minHeight: "64px",
                                paddingTop: "calc(env(safe-area-inset-top) + 16px)",
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 8,
                                    left: 0,
                                    right: 0,
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Sheet.DragIndicator style={{ display: "none" }} />
                            </div>
                            <h2 className="m-0 text-xl font-bold text-gray-800 select-none">
                                {title}
                            </h2>
                            <button
                                type="button"
                                onClick={() => onOpenChange(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors absolute right-6"
                                aria-label="Close"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                        </div>
                    </Sheet.Header>
                    <Sheet.Content
                        style={{
                            padding: "0 24px 24px 24px",
                            paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
                        }}
                    >
                        {children ?? <AddPersonForm onClose={() => onOpenChange(false)} />}
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => onOpenChange(false)} />
            </Sheet>
        </>
    );
};

// Default form component for Add Person
const AddPersonForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [relationship, setRelationship] = useState("");
    const [name, setName] = useState("");
    const [occasion, setOccasion] = useState("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [age, setAge] = useState("");
    const [yearOfBirth, setYearOfBirth] = useState("");

    const relationshipOptions = [
        { value: "father", label: "Father" },
        { value: "mother", label: "Mother" },
        { value: "friend", label: "Friend" },
        { value: "partner", label: "Partner" },
        { value: "sibling", label: "Sibling" },
        { value: "colleague", label: "Colleague" },
        { value: "other", label: "Other" },
    ];

    const occasionOptions = [
        { value: "birthday", label: "Birthday" },
        { value: "christmas", label: "Christmas" },
        { value: "anniversary", label: "Anniversary" },
        { value: "graduation", label: "Graduation" },
        { value: "wedding", label: "Wedding" },
        { value: "thank-you", label: "Thank You" },
        { value: "just-because", label: "Just Because" },
        { value: "other", label: "Other" },
    ];

    const dayOptions = Array.from({ length: 31 }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1),
    }));

    const monthOptions = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10

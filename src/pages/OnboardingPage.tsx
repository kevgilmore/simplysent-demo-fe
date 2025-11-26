import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { ActionPersonSheet } from "../components/sheets/ActionPersonSheet";
import { Button } from "../components/ui/Button";

export function OnboardingPage() {
    const navigate = useNavigate();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleFormComplete = () => {
        setIsSheetOpen(false);
        // Delay to ensure person is saved and event is dispatched before navigating
        setTimeout(() => {
            navigate("/person");
        }, 200);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center px-6">
            <div
                className="w-full max-w-2xl flex flex-col"
                style={{ height: "min(80vh, 700px)" }}
            >
                {/* Small Logo at Top */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 mt-4"
                >
                    <img
                        src="/logo.png"
                        alt="SimplySent"
                        className="h-10 w-auto mx-auto"
                    />
                </motion.div>

                {/* Main Content - Centered and Spaced */}
                <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                    {/* Illustration with Glow Effect */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            y: [0, -10, 0],
                        }}
                        transition={{
                            scale: {
                                delay: 0.2,
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                            },
                            opacity: { delay: 0.2 },
                            y: {
                                delay: 0.5,
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                            },
                        }}
                        className="relative"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-purple-400/30 blur-3xl rounded-full scale-150"></div>
                        {/* Main Illustration */}
                        <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                            <PlusIcon className="w-24 h-24 text-purple-600 mx-auto" />
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl md:text-5xl font-bold text-center text-gray-900"
                    >
                        Find the Perfect Gift
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl text-gray-600 text-center max-w-md"
                    >
                        Tell us about the person you're shopping for and we'll
                        find the perfect gifts for them.
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="pt-4"
                    >
                        <Button
                            onClick={() => setIsSheetOpen(true)}
                            variant="primary"
                            size="large"
                        >
                            Get Started
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* ActionPersonSheet - opens at state 1 (first step) */}
            <ActionPersonSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                title="Add Person"
                onComplete={handleFormComplete}
            />
        </div>
    );
}


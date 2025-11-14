import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { ActionPersonSheet } from "../components/sheets/ActionPersonSheet";
import { Button } from "../components/ui/Button";

export function IntroPage() {
    const navigate = useNavigate();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleFormComplete = () => {
        setIsSheetOpen(false);
        navigate("/recommendations");
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
                                stiffness: 100,
                            },
                            opacity: { delay: 0.2, duration: 0.6 },
                            y: {
                                delay: 0.8,
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                            },
                        }}
                        className="relative w-full"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 bg-gradient-to-br from-purple-300/40 to-pink-300/40 rounded-full blur-3xl" />
                        </div>

                        {/* Illustration */}
                        <img
                            src="/undraw_gifts.svg"
                            alt="Gift giving illustration"
                            className="w-full mx-auto relative z-10 drop-shadow-2xl"
                            style={{ maxWidth: "220px" }}
                        />
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-center space-y-2"
                    >
                        <h1 className="text-2xl md:text-4xl text-gray-800 font-bold">
                            Let's find the perfect gift
                        </h1>
                        <p className="text-sm md:text-lg text-gray-600">
                            Answer a few quick questions to get started
                        </p>
                    </motion.div>
                </div>

                {/* CTA Button - Bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.6,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200,
                    }}
                    className="pb-6"
                    style={{
                        paddingBottom:
                            "calc(36px + env(safe-area-inset-bottom))",
                    }}
                >
                    <Button
                        onClick={() => setIsSheetOpen(true)}
                        variant="cta"
                        size="large"
                        fullWidth
                    >
                        <span className="flex items-center justify-center gap-3">
                            <PlusIcon className="w-6 h-6" />
                            Get Started
                        </span>
                    </Button>
                </motion.div>
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

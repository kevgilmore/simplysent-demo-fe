import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ActionPersonSheet } from "../components/sheets/ActionPersonSheet";
import { Button } from "../components/ui/Button";
import { buildApiUrl, apiFetch, getApiHeaders, getCurrentMode, isDevModeEnabled, setWelcomeTraining, setWelcomeTrainingCompleted } from "../utils/apiConfig";
import { getProductsByDocumentIds } from "../services/firebaseService";

export function OnboardingPage() {
    const navigate = useNavigate();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isAutoFilling, setIsAutoFilling] = useState(false);

    const handleFormComplete = () => {
        setIsSheetOpen(false);
        // Enable welcome training for normal onboarding flow
        setWelcomeTrainingCompleted(false);
        setWelcomeTraining(true);
        // Delay to ensure person is saved and event is dispatched before navigating
        setTimeout(() => {
            navigate("/person");
        }, 200);
    };

    const handleSkipToPersonPage = async () => {
        // Prevent multiple calls
        if (isAutoFilling) {
            return;
        }
        
        setIsAutoFilling(true);
        
        try {
            // Create person object directly
            const personData = {
                id: `person-${Date.now()}`,
                name: "Dad",
                relationship: "father",
                gender: "male",
                interests: ["tech", "golf"],
                minBudget: 10,
                maxBudget: 200,
                createdAt: Date.now(),
            };
            
            // Save to localStorage
            const storedPersons = localStorage.getItem('saved_persons');
            const persons = storedPersons ? JSON.parse(storedPersons) : [];
            persons.push(personData);
            localStorage.setItem('saved_persons', JSON.stringify(persons));
            
            // Enable welcome training
            setWelcomeTrainingCompleted(false);
            setWelcomeTraining(true);
            
            // Dispatch event to notify PersonPage
            window.dispatchEvent(new CustomEvent('person-added', { detail: personData }));
            
            // Navigate directly to PersonPage (bypass ActionPersonSheet)
            navigate("/person");
        } catch (error) {
            console.error("Error in autofill:", error);
            setIsAutoFilling(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden">
            {/* Professional gradient background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Main gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#faf9ff] via-[#f5f3ff] to-[#fef7ff]"></div>
                
                {/* Subtle accent gradients */}
                <div className="absolute top-0 left-0 w-full h-2/5 bg-gradient-to-b from-purple-50/60 via-purple-50/30 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-2/5 bg-gradient-to-t from-pink-50/40 via-pink-50/20 to-transparent"></div>
                
                {/* Elegant geometric pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
                        `,
                    }}
                />
            </div>

            <div className="w-full max-w-7xl flex flex-col items-center relative z-10">
                {/* Logo at Top */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-12 md:mb-16"
                >
                    <h1 className="font-notch font-bold text-3xl md:text-4xl bg-gradient-to-r from-purple-600 via-simplysent-purple to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                        SimplySent
                    </h1>
                </motion.div>

                {/* Main Content - Centered Layout */}
                <div className="w-full flex flex-col items-center gap-8 md:gap-12">
                    {/* SVG Illustration - Reduced size */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-xl md:max-w-2xl pt-8 md:pt-12"
                    >
                        {/* Subtle gradient overlay effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-100/20 via-transparent to-pink-100/20 rounded-3xl -z-10 transform scale-105"></div>
                        <img
                            src="/undraw_gifts.svg"
                            alt="Gift illustration"
                            className="w-full h-auto relative z-10"
                            style={{ 
                                filter: 'drop-shadow(0 20px 40px rgba(139, 92, 246, 0.15))',
                            }}
                        />
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="flex flex-col items-center space-y-6 max-w-2xl text-center pt-4 md:pt-6"
                    >
                        {/* Single line text */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-medium leading-tight">
                            <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent">
                                Find the perfect gift in 3 minutes
                            </span>
                        </h2>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="pt-4 flex flex-col gap-4 items-center"
                        >
                            <motion.div
                                className="relative min-w-[240px]"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Animated gradient background glow */}
                                <motion.div
                                    animate={{
                                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 via-purple-600 to-pink-500 bg-[length:200%_100%] opacity-90 blur-sm -z-10"
                                />
                                <div className="relative overflow-hidden rounded-full">
                                    <motion.div
                                        animate={{
                                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%]"
                                    />
                                    <Button
                                        onClick={() => setIsSheetOpen(true)}
                                        variant="primary"
                                        size="large"
                                        className="relative w-full min-w-[240px] shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 bg-transparent border-0 overflow-hidden group"
                                    >
                                        <motion.span
                                            animate={{
                                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="relative z-10 block bg-gradient-to-r from-white via-white/90 to-white bg-[length:200%_100%] bg-clip-text text-transparent"
                                            style={{
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            Get Started
                                        </motion.span>
                                        {/* Shimmer effect */}
                                        <motion.div
                                            animate={{
                                                x: ['-100%', '100%'],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        />
                                    </Button>
                                </div>
                            </motion.div>
                            {isDevModeEnabled() && (
                                <Button
                                    onClick={handleSkipToPersonPage}
                                    variant="ghost"
                                    size="medium"
                                    disabled={isAutoFilling}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    {isAutoFilling ? "Loading..." : "Autofill (dev only)"}
                                </Button>
                            )}
                        </motion.div>
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


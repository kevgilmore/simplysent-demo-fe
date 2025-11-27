import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ActionPersonSheet } from "../components/sheets/ActionPersonSheet";

export function OnboardingPage() {
    const navigate = useNavigate();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleFormComplete = () => {
        // Set flag to indicate we're navigating from onboarding
        sessionStorage.setItem('navigating_from_onboarding', 'true');
        // Navigate immediately - PersonPage will load behind the closing sheet
        navigate("/person");
        // Close sheet after navigation starts
        setTimeout(() => {
            setIsSheetOpen(false);
        }, 100);
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center px-6 pt-12 pb-8 relative overflow-hidden">
            {/* Background with animated gradients and pattern overlay */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {/* Animated gradient background */}
                <motion.div
                    animate={{
                        background: [
                            'linear-gradient(135deg, #f7f6fe 0%, #f1eefe 50%, #faf9ff 100%)',
                            'linear-gradient(225deg, #faf9ff 0%, #f1eefe 50%, #f7f6fe 100%)',
                            'linear-gradient(135deg, #f7f6fe 0%, #f1eefe 50%, #faf9ff 100%)',
                        ],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-0"
                />
                
                {/* Animated color orbs */}
                <motion.div
                    animate={{
                        x: ['0%', '20%', '0%'],
                        y: ['0%', '30%', '0%'],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(133, 64, 222, 0.4) 0%, transparent 70%)',
                    }}
                />
                <motion.div
                    animate={{
                        x: ['100%', '80%', '100%'],
                        y: ['100%', '70%', '100%'],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(197, 85, 151, 0.4) 0%, transparent 70%)',
                    }}
                />
                
                {/* Soft pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage: `
                            repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(94, 87, 172, 0.04) 40px, rgba(94, 87, 172, 0.04) 80px),
                            repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(122, 88, 158, 0.04) 40px, rgba(122, 88, 158, 0.04) 80px),
                            radial-gradient(circle at 20% 30%, rgba(133, 64, 222, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(197, 85, 151, 0.1) 0%, transparent 50%)
                        `,
                    }}
                />
                
                {/* Subtle accent gradients */}
                <motion.div
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-0 left-0 w-full h-1/3"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(133, 64, 222, 0.15) 0%, rgba(122, 88, 158, 0.1) 50%, transparent 100%)',
                    }}
                />
                <motion.div
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-0 right-0 w-full h-1/3"
                    style={{
                        background: 'linear-gradient(to top, rgba(197, 85, 151, 0.15) 0%, rgba(171, 86, 154, 0.1) 50%, transparent 100%)',
                    }}
                />
            </div>

            <div className="w-full max-w-7xl flex flex-col items-center relative z-10">
                {/* Main Content - Centered Layout */}
                <div className="w-full flex flex-col items-center gap-6 md:gap-8 pt-8 md:pt-12">
                    {/* Logo at Top */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="mb-4 md:mb-6"
                    >
                        <h1 className="font-notch font-bold text-3xl md:text-4xl bg-gradient-to-r from-purple-600 via-simplysent-purple to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                            SimplySent
                        </h1>
                    </motion.div>

                    {/* Gift GIF */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            y: 0,
                        }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="relative flex items-center justify-center"
                    >
                        <img
                            src="/img/gifs/gift.gif"
                            alt="Gift animation"
                            className="w-56 md:w-72 h-auto"
                        />
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="flex flex-col items-center space-y-8 max-w-2xl text-center pt-2 md:pt-4"
                    >
                        {/* Heading text */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-medium leading-tight relative">
                            <span 
                                className="relative z-10"
                                style={{
                                    color: '#5E57AC',
                                    textShadow: '0 2px 8px rgba(94, 87, 172, 0.15), 0 4px 16px rgba(122, 88, 158, 0.1)',
                                }}
                            >
                                Find the perfect gift in 3 minutes
                            </span>
                        </h2>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="pt-2"
                        >
                            <motion.button
                                onClick={() => setIsSheetOpen(true)}
                                whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: "0 25px 50px rgba(133, 64, 222, 0.4)"
                                }}
                                whileTap={{ 
                                    scale: 0.95,
                                    boxShadow: "0 10px 25px rgba(133, 64, 222, 0.3)"
                                }}
                                className="relative px-12 py-4 md:px-16 md:py-5 rounded-full font-medium text-lg md:text-xl text-white overflow-hidden group transition-all duration-300"
                                style={{
                                    boxShadow: '0 15px 40px rgba(133, 64, 222, 0.3)',
                                }}
                            >
                                {/* Animated gradient background */}
                                <motion.div
                                    animate={{
                                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, #8540de 0%, #7a589e 33%, #ab569a 66%, #c55597 100%)',
                                        backgroundSize: '200% 200%',
                                    }}
                                />
                                
                                {/* Secondary animated layer */}
                                <motion.div
                                    animate={{
                                        backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="absolute inset-0 rounded-full opacity-80"
                                    style={{
                                        background: 'linear-gradient(225deg, #c55597 0%, #ab569a 33%, #7a589e 66%, #8540de 100%)',
                                        backgroundSize: '200% 200%',
                                    }}
                                />
                                
                                {/* Shimmer sweep */}
                                <motion.div
                                    animate={{
                                        x: ['-100%', '200%'],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                                />
                                
                                {/* Button text */}
                                <span className="relative z-10 font-normal">
                                    Lets impress
                                </span>
                                
                                {/* Press state overlay */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileTap={{ opacity: 1 }}
                                    className="absolute inset-0 rounded-full bg-black/20"
                                />
                            </motion.button>
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


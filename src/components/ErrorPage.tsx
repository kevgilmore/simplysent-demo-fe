import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, WrenchIcon } from 'lucide-react';
interface ErrorPageProps {
  formData?: {
    interests: string[];
    favoritedrink: string;
    clothesSize: string;
    personAge: string;
    minBudget: number | null;
    maxBudget: number | null;
  };
  reqId?: string;
}
export function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ErrorPageProps;
  useEffect(() => {
    const reportError = async () => {
      try {
        const errorPayload = {
          message: "TypeError: Cannot read property 'products' of undefined",
          stack: "TypeError: Cannot read property 'products' of undefined\n    at RecommendationCard.render (RecommendationCard.js:42:17)",
          componentStack: '    in RecommendationCard (at RecommendationList.js:23)\n    in RecommendationList',
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          reqId: state?.reqId || 'unknown',
          llmEnabled: true,
          recommendation: state?.formData ? {
            interests: state.formData.interests,
            budget_min: state.formData.minBudget,
            budget_max: state.formData.maxBudget,
            age: parseInt(state.formData.personAge),
            drink: state.formData.favoritedrink.toLowerCase(),
            size: state.formData.clothesSize
          } : undefined
        };
        await fetch('https://gift-api-973409790816.europe-west1.run.app/error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(errorPayload)
        });
      } catch (error) {
        console.error('Failed to report error:', error);
      }
    };
    reportError();
  }, [state]);
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} className="text-center space-y-6">
      <div className="relative w-64 h-64 mx-auto mb-8">
        <motion.div initial={{
        rotate: 0
      }} animate={{
        rotate: 360
      }} transition={{
        duration: 60,
        repeat: Infinity,
        ease: 'linear'
      }} className="absolute inset-0 flex items-center justify-center">
          <WrenchIcon className="w-24 h-24 text-purple-300" />
        </motion.div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">
        Oops! We're Having a Moment
      </h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Our gift-finding elves are doing some maintenance. Please try again in a
        few minutes!
      </p>
      <motion.button whileHover={{
      scale: 1.02
    }} whileTap={{
      scale: 0.98
    }} onClick={() => navigate('/')} className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition-colors">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Try Again
      </motion.button>
    </motion.div>;
}
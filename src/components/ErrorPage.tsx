import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, AlertTriangleIcon } from 'lucide-react';
import { getErrorApiUrl, apiFetch } from '../utils/apiConfig';
import { getOrCreateAnonId } from '../utils/tracking';
interface ErrorPageProps {
  formData?: {
    interests: string[];
    favoritedrink: string;
    clothesSize: string;
    personAge: string;
    minBudget: number | null;
    maxBudget: number | null;
    gender?: string;
    relationship?: string;
    occasion?: string;
    sentiment?: string;
    clientOrigin?: string;
    llmEnabled?: boolean;
  };
  clientRequestId?: string;
  errorMessage?: string;
  errorStack?: string;
  componentStack?: string;
}
export function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ErrorPageProps;
  useEffect(() => {
    const reportError = async () => {
      try {
        const errorPayload = {
          message: state?.errorMessage || 'Unknown error',
          stack: state?.errorStack || new Error().stack || 'No stack trace available',
          componentStack: state?.componentStack,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          recommendation: state?.formData ? {
            age: parseInt(state.formData.personAge),
            gender: state.formData.gender,
            relationship: state.formData.relationship,
            occasion: state.formData.occasion,
            sentiment: state.formData.sentiment,
            interests: state.formData.interests,
            favourite_drink: state.formData.favoritedrink?.toLowerCase(),
            size: state.formData.clothesSize,
            budget_min: state.formData.minBudget,
            budget_max: state.formData.maxBudget,
            client_origin: state.formData.clientOrigin,
            llm_enabled: state.formData.llmEnabled
          } : undefined
        };
        await apiFetch(`${getErrorApiUrl()}/error`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-anon-id': getOrCreateAnonId(),
            'x-request-id': 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              const r = Math.random() * 16 | 0;
              const v = c === 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            })
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
      <div className="relative w-40 h-40 mx-auto mb-2">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-200/60 to-pink-200/60 blur-2xl"></div>
        <div className="relative w-full h-full flex items-center justify-center">
          <AlertTriangleIcon className="w-20 h-20 text-purple-500" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">
        Something went wrong. This is embarrassing.
      </h2>
      <p className="text-gray-600 max-w-md mx-auto">
        We’re working on it. Please try again in a few minutes.
      </p>
      <motion.button whileHover={{
      scale: 1.02
    }} whileTap={{
      scale: 0.98
    }} onClick={() => navigate('/')} className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition-colors">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Home
      </motion.button>
    </motion.div>;
}
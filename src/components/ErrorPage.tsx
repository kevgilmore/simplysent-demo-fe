import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, AlertTriangleIcon } from 'lucide-react';
import { logApiError, logReactError, logNotFoundError } from '../utils/errorLogger';
import { ApiError } from '../utils/apiConfig';

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
  apiError?: ApiError;
}
export function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ErrorPageProps;
  useEffect(() => {
    const reportError = async () => {
      try {
        // Determine the actual page where the error occurred
        const actualPage = state?.formData ? 
          `${window.location.origin}/products` : // If we have form data, error came from products page
          document.referrer || window.location.href; // Otherwise use referrer or current page
        
        // If we have API error metadata, log as API error
        if (state?.apiError?.apiMetadata) {
          await logApiError(state.apiError, state.apiError.apiMetadata, actualPage);
        } else if (state?.errorMessage === 'No recommendations available') {
          // Log as NotFound error for business logic cases
          await logNotFoundError(state.errorMessage, actualPage);
        } else {
          // Otherwise, log as React error
          const error = new Error(state?.errorMessage || 'Unknown error');
          error.stack = state?.errorStack || error.stack;
          await logReactError(error, state?.componentStack, actualPage);
        }
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
import React, { useEffect, useState, Children } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, TagIcon, ShoppingCartIcon, ThumbsUpIcon, ThumbsDownIcon, XIcon, StarIcon, CheckCircle2Icon, SparklesIcon, Undo2Icon, Redo2Icon } from 'lucide-react';
import { getApiBaseUrl, apiFetch } from '../utils/apiConfig';
import { ModeIndicator } from './ModeIndicator';
import { useTracking } from '../hooks/useTracking';
import { StarRating } from './StarRating';
import { getOrCreateAnonId } from '../utils/tracking';

// Typeform global declaration
declare global {
  interface Window {
    TypeformEmbed: {
      init: () => void;
    };
  }
}
interface Product {
  sku: string;
  productTitle?: string;
  imageUrl?: string;
  price: string;
  description: string;
  rank: string;
  // Fields from API response
  ASIN?: string;
  name?: string;
  image_url?: string;
}
interface FormData {
  personAge: string;
  interests: string[];
  favoritedrink: string;
  clothesSize: string;
  minBudget: number | null;
  maxBudget: number | null;
  relationship: string;
  occasion: string;
  sentiment: string;
  gender: string;
  clientOrigin?: string;
  llmEnabled?: boolean;
}
export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize tracking with periodic pings
  useTracking();

  // State declarations
  const [showVoucherIncentive, setShowVoucherIncentive] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [hasSubmittedForm, setHasSubmittedForm] = useState(false);
  const [showFeedbackBanner, setShowFeedbackBanner] = useState(false);
  const [bannerReady, setBannerReady] = useState(false);

  // Function to check if user is in 25% feedback cohort
  const isInFeedbackCohort = (anonId: string): boolean => {
    let hash = 0;
    for (let i = 0; i < anonId.length; i++) {
      hash = ((hash << 5) - hash) + anonId.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 4 === 0;
  };

  // Function to submit form response to API
  const submitFormResponse = async (formResponseId: string) => {
    if (!recommendationId) {
      console.error('No recommendation ID available for form submission');
      return;
    }

    try {
      console.log('Submitting form response to API...', {
        recommendation_id: recommendationId,
        form_response_id: formResponseId
      });

      const response = await apiFetch(`${getApiBaseUrl()}/feedback/form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          form_response_id: formResponseId
        })
      }, 'POST /feedback/form');

      if (response.ok) {
        console.log('✅ Form response submitted successfully');
        const responseData = await response.text();
        console.log('API response:', responseData);
        
        // Mark form as submitted and close modal
        localStorage.setItem('typeform_submitted', 'true');
        setHasSubmittedForm(true);
        setShowVoucherIncentive(false);
      } else {
        console.error('❌ Failed to submit form response:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Error submitting form response:', error);
    }
  };

  // Listen for Typeform submission events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from Typeform
      if (event.origin !== 'https://form.typeform.com') {
        return;
      }

      // Log all Typeform events for debugging
      console.log('Typeform event received:', event.data);

      // Handle different Typeform events
      if (event.data && typeof event.data === 'object') {
        // Check for various possible event types
        const eventType = event.data.type || event.data.eventType || event.data.event;
        
        if (eventType === 'form-submit' || eventType === 'form-complete' || eventType === 'submit') {
          console.log('Form submitted/completed! Event type:', eventType);
          console.log('Full event data:', event.data);
          
          // Look for response ID in various possible locations
          const responseId = event.data.responseId || 
                           event.data.response_id || 
                           event.data.responseToken || 
                           event.data.token ||
                           event.data.id;
          
          if (responseId) {
            console.log('🎉 Response ID captured:', responseId);
            
            // Submit to /feedback/form endpoint
            submitFormResponse(responseId);
          } else {
            console.log('⚠️ No response ID found in event data');
          }
        }
        
        // Also check for any response ID regardless of event type
        const responseId = event.data.responseId || 
                         event.data.response_id || 
                         event.data.responseToken || 
                         event.data.token ||
                         event.data.id;
        
        if (responseId) {
          console.log('Response ID found in event:', responseId);
        }
      }
    };

    // Add event listener
    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Check localStorage and cohort on component mount
  useEffect(() => {
    // Check if user has already submitted
    const hasSubmitted = localStorage.getItem('typeform_submitted') === 'true';
    setHasSubmittedForm(hasSubmitted);

    // Check if user is in feedback cohort or has manual override
    const urlParams = new URLSearchParams(window.location.search);
    const manualOverride = urlParams.get('show_feedback') === 'true';
    
    let shouldShowBanner = false;
    if (manualOverride) {
      shouldShowBanner = true;
    } else {
      const anonId = getOrCreateAnonId();
      const inCohort = isInFeedbackCohort(anonId);
      shouldShowBanner = inCohort;
    }
    
    // Set banner visibility immediately, but delay showing it by 4 seconds
    setShowFeedbackBanner(shouldShowBanner);
    
    if (shouldShowBanner && !hasSubmitted) {
      const timer = setTimeout(() => {
        setBannerReady(true);
      }, 4000); // 4 second delay
      
      return () => clearTimeout(timer);
    } else {
      setBannerReady(true); // Show immediately if not in cohort or already submitted
    }
  }, []);

  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Safely extract state data with fallbacks
  const formData = location.state?.formData || null;
  const recommendations = location.state?.recommendations || [];
  const recommendationId = location.state?.recommendationId || null;
  const routeError = location.state?.error || false;
  const [error, setError] = useState(routeError);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalFeedback, setModalFeedback] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modalError, setModalError] = useState('');
  const [submissionCount, setSubmissionCount] = useState(0);
  const [recommendationRating, setRecommendationRating] = useState(0);
  const [showRatingThankYou, setShowRatingThankYou] = useState(false);
  const [showRatingInput, setShowRatingInput] = useState(true);
  // Process and normalize the recommendations data
  useEffect(() => {
    console.log('Raw recommendations data:', recommendations);
    if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
      // Map and normalize the data structure
      const normalizedProducts = recommendations.map(product => {
        // Log each product to understand its structure
        return {
          sku: product.sku || product.ASIN || '',
          productTitle: product.productTitle || product.name || '',
          imageUrl: product.imageUrl || product.image_url || '',
          price: product.price || '0.00',
          description: product.description || '',
          rank: product.rank || '999',
          // Keep original fields too
          ASIN: product.ASIN,
          name: product.name,
          image_url: product.image_url
        };
      });
      // Sort products by rank (as number)
      const sortedProducts = [...normalizedProducts].sort((a, b) => {
        const rankA = parseInt(a.rank) || 999;
        const rankB = parseInt(b.rank) || 999;
        return rankA - rankB;
      });
      console.log('Sorted and normalized products:', sortedProducts);
      setProducts(sortedProducts);
    }
  }, [recommendations]);
  // Redirect to home if accessed directly without state
  useEffect(() => {
    if (!location.state) {
      console.log('No location state found, redirecting to home');
      navigate('/');
    }
  }, [location.state, navigate]);
  // Get top recommendation and other recommendations
  const topRecommendation = products && products.length > 0 ? products[0] : null;
  const otherRecommendations = products && products.length > 1 ? products.slice(1) : [];
  // Generate Amazon URL from SKU with affiliate tag
  const generateAmazonUrl = (sku: string) => {
    if (!sku) {
      console.error('No SKU provided for Amazon URL generation');
      return 'https://www.amazon.co.uk?tag=simplysent09-21';
    }
    return `https://www.amazon.co.uk/dp/${sku}?tag=simplysent09-21`;
  };
  // Interest emoji helpers
  const interestEmojiMap: Record<string, string> = {
    sports: '🏀', football: '⚽', gaming: '🎮', music: '🎵', cooking: '👩‍🍳', baking: '🧁',
    fashion: '👗', tech: '💻', technology: '💻', books: '📚', reading: '📖', coffee: '☕',
    wine: '🍷', skincare: '🧴', beauty: '💄', fitness: '🏋️', gym: '🏋️', outdoors: '🏕️',
    hiking: '🥾', camping: '🏕️', art: '🎨', pets: '🐾', gardening: '🌿', travel: '✈️',
    photography: '📷', jewelry: '💍', toys: '🧸', home: '🏠', diy: '🧰', food: '🍽️',
    tea: '🍵', beer: '🍺'
  };
  const getEmojiForInterest = (interest: string): string => {
    const key = (interest || '').toLowerCase().trim();
    return interestEmojiMap[key] || '🎁';
  };
  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  // Feedback state for each product
  const [productFeedback, setProductFeedback] = useState<Record<number, 'up' | 'down' | null>>({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
  });
  // Handle feedback submission
  const handleFeedback = async (sku: string, isGood: boolean) => {
    if (!recommendationId) return;
    try {
      console.log('Sending feedback for item:', sku, isGood ? 'good' : 'bad');
      const response = await apiFetch(`${getApiBaseUrl()}/feedback/label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          item_feedback: {
            sku: sku,
            feedback_label: isGood ? 1 : 0
          }
        })
      }, 'POST /feedback/label');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Feedback sent successfully');
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };
  // Handle link click tracking
  const handleLinkClick = async (sku: string) => {
    if (!recommendationId) return;
    try {
      console.log('Sending click feedback for item:', sku);
      await apiFetch(`${getApiBaseUrl()}/feedback/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          item_feedback: {
            sku: sku,
            clicked: true
          }
        })
      }, 'POST /feedback/click');
      console.log('Click feedback sent successfully');
    } catch (error) {
      console.error('Error sending link click feedback:', error);
    }
  };
  // Handle modal close and reset
  const handleModalClose = () => {
    setShowModal(false);
    setModalFeedback('');
    setModalEmail('');
    setModalError('');
  };

  // Handle rating change
  const handleRatingChange = async (rating: number) => {
    setRecommendationRating(rating);
    setShowRatingThankYou(true);
    setShowRatingInput(false); // Hide the star input after selection
    
    // Submit rating to /v2/feedback endpoint
    if (recommendationId) {
      try {
        const response = await apiFetch(`${getApiBaseUrl()}/feedback/rating`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recommendation_id: recommendationId,
            rating: rating
          })
        });
        
        if (response.ok) {
          console.log('Rating submitted successfully');
        } else {
          console.error('Failed to submit rating');
        }
      } catch (error) {
        console.error('Error submitting rating:', error);
      }
    }
    
    // Hide thank you message after 3 seconds
    setTimeout(() => {
      setShowRatingThankYou(false);
    }, 3000);
  };

  // Handle change rating button
  const handleChangeRating = () => {
    setShowRatingInput(true);
  };

  // Handle modal feedback submission
  const handleModalSubmit = async () => {
    if (!recommendationId) return;
    if (modalFeedback.length < 10) {
      setModalError('Please provide at least 10 characters of feedback');
      return;
    }
    if (!modalEmail || !modalEmail.includes('@')) {
      setModalError('Please provide a valid email address');
      return;
    }
    // If we've already made 2 requests, don't proceed
    if (submissionCount >= 2) {
      return;
    }
    setIsLoading(true);
    try {
      const feedbackWithEmail = `${modalFeedback}\n\nEmail: ${modalEmail}`;
      console.log('Submitting feedback comment with email:', feedbackWithEmail);
      const response = await apiFetch(`${getApiBaseUrl()}/feedback/comment?usellm=false&return_new_recommendation=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          feedback_comment: feedbackWithEmail
        })
      }, 'POST /feedback/comment');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSubmissionCount(prev => prev + 1);
      const text = await response.text();
      setModalFeedback('');
      setModalEmail('');
      console.log('Feedback response:', text);
      
      // Since return_new_recommendation=false, just show thank you message
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        handleModalClose();
      }, 2000);
      
      // Keep the old code for when return_new_recommendation=true (commented out)
      /*
      if (text) {
        try {
          const data = JSON.parse(text);
          if (data && data.products) {
            console.log('New products received:', data.products);
            setProducts(data.products);
            window.scrollTo(0, 0);
            setShowModal(false);
          }
        } catch (e) {
          console.error('Error parsing feedback response:', e);
          setIsSubmitted(true);
          setTimeout(() => {
            setIsSubmitted(false);
            setShowModal(false);
          }, 1000);
        }
      } else {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setShowModal(false);
        }, 1000);
      }
      */
    } catch (error) {
      console.error('Error sending feedback:', error);
      setModalError('Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Redirect to error page if no data is available
  if (!formData || !products || products.length === 0 || !topRecommendation) {
    navigate('/error', { state: { errorMessage: 'No recommendations available', formData, clientRequestId: 'unknown' } });
    return null;
  }
  return (
    <>
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: -20
    }} transition={{
      duration: 0.4
    }} className="space-y-8 pb-5">
        {/* Back Button */}
        <div className="flex items-center mb-6 justify-between">
          <motion.button initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.2
      }} onClick={() => navigate('/')} className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Start Over
        </motion.button>
          <ModeIndicator />
        </div>

        {/* Top Recommendation Section */}
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="bg-gradient-to-br from-[#7265f1] via-[#a87ec0] to-[#de9696] rounded-2xl shadow-xl p-8 border-2 border-white">
          <div className="text-center mb-6 px-4 sm:px-0 text-white">
            <h2 className="text-3xl font-bold mb-2">Top Recommendation</h2>
            <p className="text-white/90 mb-2">Based on their interests:</p>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {Array.isArray(formData.interests) && formData.interests.length > 0 ? (
                formData.interests.map((interest: string, idx: number) => (
                  <span key={idx} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur">
                    <span className="mr-1">{getEmojiForInterest(interest)}</span>{interest}
                  </span>
                ))
              ) : (
                <span className="text-white/80">No interests provided</span>
              )}
            </div>
            <p className="text-white/90">
              And your budget of £{formData.minBudget} - £{formData.maxBudget}
            </p>
          </div>

          {/* Top Product Card */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.4
        }} className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-xl shadow-lg overflow-hidden border border-gray-200 max-w-2xl mx-auto">
            <div className="relative">
              <img src={topRecommendation.imageUrl || topRecommendation.image_url} alt={getProductTitle(topRecommendation)} className="w-full h-64 object-contain bg-white p-4" onError={e => {
              console.error('Image load error:', e);
              e.currentTarget.src = 'https://cerescann.com/wp-content/uploads/2016/07/Product-PlaceHolder.jpg';
            }} />
              <div className="absolute bottom-4 right-4 md:bottom-auto md:top-4 bg-white/90 backdrop-blur px-5 py-2.5 rounded-full shadow-lg ring-2 ring-yellow-300/60">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                  £{topRecommendation.price}
                </span>
              </div>
              <div className="absolute top-4 left-4">
                <div className="bg-white text-[#343e47] px-4 py-1 rounded-full shadow-lg border-2 border-[#343e47]">
                  <div className="flex items-center">
                    <span className="font-black text-base tracking-tight mr-0.5" style={{fontWeight: '900', textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)'}}>Check</span>
                    <img src="/prime_day_logo2.png" alt="Prime Day" className="h-10 w-auto" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                {truncateText(getProductTitle(topRecommendation), 60)}
              </h3>
              {/* Ratings removed */}
              <div className="flex items-start space-x-3 mb-3">
                <TagIcon className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  {truncateText(capitalizeFirstWord(topRecommendation.description), 120)}
                </p>
              </div>
              {/* Buttons */}
              <div className="space-y-3">
                <a href={generateAmazonUrl(topRecommendation.sku)} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(topRecommendation.sku)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center no-underline">
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Open on Amazon
                </a>
                
                
                {/* Sales CTA for top recommendation */}
                <div className="text-center py-2 px-4">
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    🎯 <span className="text-orange-600 font-semibold">Perfect match!</span> Add to your Amazon wishlist or cart
                  </p>
                </div>
                
                {/* Row 2: Good and Bad buttons */}
                <div className="flex gap-2">
                  <motion.button whileHover={{
                  scale: productFeedback[0] !== 'down' ? 1.05 : 1
                }} whileTap={{
                  scale: productFeedback[0] !== 'down' ? 0.95 : 1
                }} onClick={() => {
                  if (productFeedback[0] !== 'down') {
                    setProductFeedback(prev => ({
                      ...prev,
                      0: 'up'
                    }));
                    handleFeedback(topRecommendation.sku, true);
                  }
                }} className={`flex-1 ${productFeedback[0] === 'up' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg border-2 border-green-400' : productFeedback[0] === 'down' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 border border-green-200 hover:border-green-300'} px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold`} disabled={productFeedback[0] === 'down'}>
                    <ThumbsUpIcon className="w-5 h-5" />
                    <span>Love it!</span>
                  </motion.button>
                  <motion.button whileHover={{
                  scale: productFeedback[0] !== 'up' ? 1.05 : 1
                }} whileTap={{
                  scale: productFeedback[0] !== 'up' ? 0.95 : 1
                }} onClick={() => {
                  if (productFeedback[0] !== 'up') {
                    setProductFeedback(prev => ({
                      ...prev,
                      0: 'down'
                    }));
                    handleFeedback(topRecommendation.sku, false);
                  }
                }} className={`flex-1 ${productFeedback[0] === 'down' ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg border-2 border-red-400' : productFeedback[0] === 'up' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200 text-red-700 border border-red-200 hover:border-red-300'} px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold`} disabled={productFeedback[0] === 'up'}>
                    <ThumbsDownIcon className="w-5 h-5" />
                    <span>Not for me</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Rating Section */}
        <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }} className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              How would you rate these recommendations?
            </h3>
            {showRatingInput ? (
              <div className="flex items-center justify-center gap-4 mb-4">
                <StarRating
                  value={recommendationRating}
                  onChange={handleRatingChange}
                  size="lg"
                />
                {recommendationRating > 0 && (
                  <span className="text-lg font-semibold text-gray-700">
                    {recommendationRating} star{recommendationRating !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-6 h-6 ${
                          star <= recommendationRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-700">
                    {recommendationRating} star{recommendationRating !== 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  onClick={handleChangeRating}
                  className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
                >
                  Change rating
                </button>
              </div>
            )}
            
            {/* Thank you message */}
            <AnimatePresence>
              {showRatingThankYou && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center gap-2 text-green-600 font-semibold"
                >
                  <CheckCircle2Icon className="w-5 h-5" />
                  <span>Thank you for your feedback!</span>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-sm text-gray-500">
              Your feedback helps us improve our recommendations
            </p>
          </div>
        </motion.div>

        {/* Floating Voucher Incentive */}
        {!hasSubmittedForm && !bannerDismissed && showFeedbackBanner && bannerReady && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVoucherIncentive(true)}
              className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl p-4 max-w-sm cursor-pointer relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-6 -translate-x-6"></div>

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBannerDismissed(true);
                }}
                className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors z-30 p-1 bg-black/20 rounded-full hover:bg-black/30"
                title="Close"
              >
                <XIcon className="w-6 h-6" />
              </button>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <TagIcon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-white font-bold text-lg drop-shadow-sm">
                    5 Questions for £5
                  </h4>
                </div>
                
                <p className="text-white/90 text-sm mb-3 drop-shadow-sm">
                  Quick feedback form for Amazon voucher
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-white/80 text-xs">
                    <span className="font-semibold">Quick</span> • 2 min
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <SparklesIcon className="w-4 h-4" />
                    <span className="text-sm font-semibold">Start</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Typeform Modal */}
        <AnimatePresence>
          {showVoucherIncentive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowVoucherIncentive(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">5 Questions for £5 Amazon Voucher</h3>
                  <button
                    onClick={() => setShowVoucherIncentive(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  {hasSubmittedForm ? (
                    <div className="text-center py-12">
                      <CheckCircle2Icon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Thank You!
                      </h3>
                      <p className="text-gray-600">
                        You've already submitted your feedback.
                      </p>
                    </div>
                  ) : (
                    <iframe
                      key={showVoucherIncentive ? 'typeform-open' : 'typeform-closed'}
                      src="https://form.typeform.com/to/t9PLfcPq"
                      width="100%"
                      height="500"
                      frameBorder="0"
                      className="rounded-lg"
                      title="Feedback Form"
                    ></iframe>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Other Recommendations Section */}
        {otherRecommendations.length > 0 && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center font-heading">
              More Great Options
            </h3>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherRecommendations.map((item, index) => {
            const feedbackIndex = index + 1;
            return <motion.div key={item.sku} variants={itemVariants} className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
                    {/* Add image section at the top */}
                    <div className="relative">
                      <img src={item.imageUrl || item.image_url} alt={getProductTitle(item)} className="w-full h-48 object-contain bg-white p-4" onError={e => {
                  console.error('Image load error:', e);
                  e.currentTarget.src = 'https://cerescann.com/wp-content/uploads/2016/07/Product-PlaceHolder.jpg';
                }} />
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1 rounded-full shadow-md">
                        <span className="text-purple-600 font-semibold">
                          £{item.price}
                        </span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <div className="bg-white text-[#343e47] px-3 py-0.5 rounded-full shadow-md border border-[#343e47]">
                          <div className="flex items-center">
                            <span className="font-black text-sm tracking-tight mr-0.5" style={{fontWeight: '900', textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)'}}>Check</span>
                            <img src="/prime_day_logo2.png" alt="Prime Day" className="h-8 w-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {truncateText(getProductTitle(item), 60)}
                      </h4>
                      {/* Ratings removed */}
                      <div className="flex items-start space-x-2 mb-2">
                        <TagIcon className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          {truncateText(capitalizeFirstWord(item.description), 100)}
                        </p>
                      </div>
                      {/* Buttons */}
                      <div className="space-y-2 mt-auto">
                        <a href={generateAmazonUrl(item.sku)} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(item.sku)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm no-underline">
                          <ShoppingCartIcon className="w-4 h-4 mr-2" />
                          Open on Amazon
                        </a>
                        
                        
                        {/* Sales CTA */}
                        <div className="text-center py-2">
                          <p className="text-xs text-gray-600 font-medium">
                            💡 <span className="text-orange-600 font-semibold">Add to your Amazon wishlist</span> or save for later!
                          </p>
                        </div>
                        {/* Row 2: Good and Bad buttons */}
                        <div className="flex gap-2 h-10">
                          <motion.button whileHover={{
                      scale: productFeedback[feedbackIndex] !== 'down' ? 1.05 : 1
                    }} whileTap={{
                      scale: productFeedback[feedbackIndex] !== 'down' ? 0.95 : 1
                    }} onClick={() => {
                      if (productFeedback[feedbackIndex] !== 'down') {
                        setProductFeedback(prev => ({
                          ...prev,
                          [feedbackIndex]: 'up'
                        }));
                        handleFeedback(item.sku, true);
                      }
                    }} disabled={productFeedback[feedbackIndex] === 'down'} className={`flex-1 ${productFeedback[feedbackIndex] === 'up' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md border border-green-400' : productFeedback[feedbackIndex] === 'down' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 border border-green-200 hover:border-green-300'} py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 font-semibold`}>
                            <ThumbsUpIcon className="w-4 h-4" />
                            <span className="text-xs font-medium">Love it!</span>
                          </motion.button>
                          <motion.button whileHover={{
                      scale: productFeedback[feedbackIndex] !== 'up' ? 1.05 : 1
                    }} whileTap={{
                      scale: productFeedback[feedbackIndex] !== 'up' ? 0.95 : 1
                    }} onClick={() => {
                      if (productFeedback[feedbackIndex] !== 'up') {
                        setProductFeedback(prev => ({
                          ...prev,
                          [feedbackIndex]: 'down'
                        }));
                        handleFeedback(item.sku, false);
                      }
                    }} disabled={productFeedback[feedbackIndex] === 'up'} className={`flex-1 ${productFeedback[feedbackIndex] === 'down' ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md border border-red-400' : productFeedback[feedbackIndex] === 'up' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200 text-red-700 border border-red-200 hover:border-red-300'} py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 font-semibold`}>
                            <ThumbsDownIcon className="w-4 h-4" />
                            <span className="text-xs font-medium">Not for me</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>;
          })}
            </motion.div>
          </motion.div>}

        {/* Request New Recommendations Button */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.7
      }}>
          <button onClick={() => submissionCount < 2 && setShowModal(true)} className={`w-full font-semibold py-4 px-8 rounded-2xl shadow-xl transition-all transform flex items-center justify-center gap-3 ${submissionCount >= 2 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:scale-[1.02] hover:shadow-2xl'} text-white`} disabled={submissionCount >= 2}>
            {submissionCount >= 2 ? (
              <>
                <XIcon className="w-5 h-5" />
                Maximum recommendations reached
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                Get Different Recommendations
              </>
            )}
          </button>
        </motion.div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleModalClose}>
            <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.95
        }} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              {isLoading ? <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 mb-8">
                    <motion.div animate={{
                rotate: 360
              }} transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear'
              }} className="w-full h-full border-4 border-purple-200 border-t-purple-600 rounded-full" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                    Finding New Recommendations
                  </h3>
                  <p className="text-gray-600 text-center">
                    We're analyzing your feedback to find better gift options...
                  </p>
                </motion.div> : isSubmitted ? <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} className="flex flex-col items-center justify-center py-8">
                  <CheckCircle2Icon className="w-24 h-24 text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Thank you for your feedback!
                  </h3>
                </motion.div> : <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Get Different Recommendations
                    </h3>
                    <button onClick={handleModalClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Include your email and we'll email you an improved recommendation just for you
                    </label>
                    <input 
                      type="email" 
                      value={modalEmail} 
                      onChange={e => setModalEmail(e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors mb-4" 
                      placeholder="your.email@example.com" 
                      required
                    />
                    <textarea value={modalFeedback} onChange={e => {
                setModalFeedback(e.target.value);
                if (e.target.value.length >= 10) {
                  setModalError('');
                }
              }} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none ${modalError ? 'border-red-300' : 'border-gray-200'}`} rows={4} placeholder="Share your feedback to help us improve our recommendations..." />
                    {modalError && <p className="text-red-500 text-sm mt-2">{modalError}</p>}
                    <p className="text-gray-500 text-sm mt-2">
                      {modalFeedback.length}/10 characters minimum
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleModalClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleModalSubmit} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Submit
                    </button>
                  </div>
                </>}
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </>
  );
}
// Helper functions
const getProductTitle = (product: any): string => {
  // Check all possible title fields and use the first one that exists
  const title = product.productTitle || product.name || '';
  if (!title || typeof title !== 'string' || title.trim() === '') {
    console.log('No valid title found for product:', product);
    return 'Product Title Not Available';
  }
  return capitalizeWords(title);
};
const capitalizeWords = (text: string | undefined | null): string => {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return 'Product Title Not Available';
  }
  // Remove any HTML tags that might be in the title
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, '');
  return cleanText.split(' ').map(word => {
    if (word.length === 0) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};
const capitalizeFirstWord = (text: string | undefined | null): string => {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return 'Description not available';
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
};
const truncateText = (text: string, maxLength: number): string => {
  if (!text || typeof text !== 'string') return 'Text not available';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};
import React, { useEffect, useState, Children } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, TagIcon, ShoppingCartIcon, ThumbsUpIcon, ThumbsDownIcon, XIcon, CheckCircle2Icon } from 'lucide-react';
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
}
export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Add debugging for component mount and state
  useEffect(() => {
    console.log('ResultsPage mounted');
    console.log('Location state:', location.state);
    // Scroll to top when component mounts
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modalError, setModalError] = useState('');
  const [submissionCount, setSubmissionCount] = useState(0);
  // Process and normalize the recommendations data
  useEffect(() => {
    console.log('Raw recommendations data:', recommendations);
    if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
      // Map and normalize the data structure
      const normalizedProducts = recommendations.map(product => {
        // Log each product to understand its structure
        console.log('Processing product:', product);
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
  // Generate Amazon URL from SKU
  const generateAmazonUrl = (sku: string) => {
    if (!sku) {
      console.error('No SKU provided for Amazon URL generation');
      return 'https://www.amazon.co.uk';
    }
    return `https://www.amazon.co.uk/dp/${sku}`;
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
      const response = await fetch('https://catboost-recommender-api-973409790816.europe-west1.run.app/feedback/label', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          item_feedback: {
            asin: sku,
            feedback_label: isGood ? 1 : 0
          }
        })
      });
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
      await fetch('https://catboost-recommender-api-973409790816.europe-west1.run.app/feedback/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          item_feedback: {
            asin: sku,
            clicked: true
          }
        })
      });
      console.log('Click feedback sent successfully');
    } catch (error) {
      console.error('Error sending link click feedback:', error);
    }
  };
  // Handle modal feedback submission
  const handleModalSubmit = async () => {
    if (!recommendationId) return;
    if (modalFeedback.length < 10) {
      setModalError('Please provide at least 10 characters of feedback');
      return;
    }
    // If we've already made 2 requests, don't proceed
    if (submissionCount >= 2) {
      return;
    }
    setIsLoading(true);
    try {
      console.log('Submitting feedback comment:', modalFeedback);
      const response = await fetch('https://catboost-recommender-api-973409790816.europe-west1.run.app/feedback/comment?usellm=false', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          feedback_comment: modalFeedback
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSubmissionCount(prev => prev + 1);
      const text = await response.text();
      setModalFeedback('');
      console.log('Feedback response:', text);
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
    } catch (error) {
      console.error('Error sending feedback:', error);
      setModalError('Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Render a message if no data is available
  if (!formData || !products || products.length === 0 || !topRecommendation) {
    return <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          No Recommendations Available
        </h2>
        <p className="text-gray-600 mb-4">
          We couldn't find any recommendations. This might be because you
          accessed this page directly.
        </p>
        <button onClick={() => navigate('/')} className="text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center mx-auto">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Home
        </button>
      </motion.div>;
  }
  // Debug the top recommendation
  console.log('Top recommendation:', topRecommendation);
  console.log('Top recommendation title:', topRecommendation.productTitle || topRecommendation.name);
  console.log('Top recommendation image:', topRecommendation.imageUrl || topRecommendation.image_url);
  return <>
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
        <motion.button initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.2
      }} onClick={() => navigate('/')} className="text-purple-600 hover:text-purple-700 font-medium flex items-center mb-6">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Start Over
        </motion.button>

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
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-5 py-2.5 rounded-full shadow-lg ring-2 ring-yellow-300/60">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                  £{topRecommendation.price}
                </span>
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
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={generateAmazonUrl(topRecommendation.sku)} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(topRecommendation.sku)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center no-underline">
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Show on Amazon
                </a>
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
                }} className={`flex-1 ${productFeedback[0] === 'up' ? 'bg-green-100 text-green-700 border-2 border-green-300' : productFeedback[0] === 'down' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2`} disabled={productFeedback[0] === 'down'}>
                    <ThumbsUpIcon className="w-5 h-5" />
                    <span className="font-medium">Good</span>
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
                }} className={`flex-1 ${productFeedback[0] === 'down' ? 'bg-red-100 text-red-700 border-2 border-red-300' : productFeedback[0] === 'up' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2`} disabled={productFeedback[0] === 'up'}>
                    <ThumbsDownIcon className="w-5 h-5" />
                    <span className="font-medium">Bad</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

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
            // Debug each item
            console.log(`Item ${index} title:`, getProductTitle(item));
            console.log(`Item ${index} image:`, item.imageUrl || item.image_url);
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
                          Show on Amazon
                        </a>
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
                    }} disabled={productFeedback[feedbackIndex] === 'down'} className={`flex-1 ${productFeedback[feedbackIndex] === 'up' ? 'bg-green-100 text-green-700 border-2 border-green-300' : productFeedback[feedbackIndex] === 'down' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1`}>
                            <ThumbsUpIcon className="w-4 h-4" />
                            <span className="text-xs font-medium">Good</span>
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
                    }} disabled={productFeedback[feedbackIndex] === 'up'} className={`flex-1 ${productFeedback[feedbackIndex] === 'down' ? 'bg-red-100 text-red-700 border-2 border-red-300' : productFeedback[feedbackIndex] === 'up' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1`}>
                            <ThumbsDownIcon className="w-4 h-4" />
                            <span className="text-xs font-medium">Bad</span>
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
          <button onClick={() => submissionCount < 2 && setShowModal(true)} className={`w-full font-semibold py-3 px-8 rounded-xl shadow-lg transition-all transform ${submissionCount >= 2 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 hover:scale-[1.02]'} text-white`} disabled={submissionCount >= 2}>
            {submissionCount >= 2 ? 'Maximum recommendations reached' : 'Request New Recommendations'}
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
      }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
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
                      Request New Recommendations
                    </h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tell us what we can do differently...
                    </label>
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
                    <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors">
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
    </>;
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
import React, { useEffect, useState, Children } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, TagIcon, HeartIcon, ShoppingCartIcon, ThumbsUpIcon, ThumbsDownIcon, XIcon, StarIcon, CheckCircle2Icon } from 'lucide-react';
export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    formData
  } = location.state || {};
  // Add useEffect to scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [modalFeedback, setModalFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modalError, setModalError] = useState('');
  // Mock recommendations data with 5 products
  const recommendations = [{
    title: 'Premium Wireless Headphones',
    price: 199.99,
    rating: 4.5,
    description: 'High-quality wireless headphones with noise cancellation, perfect for music lovers and tech enthusiasts.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    matchReason: 'Matches interest in Technology & Music'
  }, {
    title: 'Smart Fitness Watch',
    price: 149.99,
    rating: 4.2,
    description: 'Track your health and fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    matchReason: 'Perfect for Health & Wellness enthusiasts'
  }, {
    title: 'Professional Camera Kit',
    price: 299.99,
    rating: 4.8,
    description: 'Complete photography kit including a DSLR camera, lens, and accessories for capturing perfect moments.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    matchReason: 'Ideal for Photography lovers'
  }, {
    title: 'Gaming Console Bundle',
    price: 399.99,
    rating: 4.6,
    description: 'Latest gaming console with two controllers and popular game titles included.',
    image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    matchReason: 'Great for Gaming & Entertainment'
  }, {
    title: 'Artisan Cooking Set',
    price: 179.99,
    rating: 5.0,
    description: 'Professional-grade cooking set with premium pots, pans, and culinary tools.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    matchReason: 'Perfect for Cooking & Food enthusiasm'
  }];
  const StarRating = ({
    rating
  }: {
    rating: number;
  }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    return <div className="flex items-center gap-1">
        <div className="flex">
          {/* Full stars */}
          {Array.from({
          length: fullStars
        }).map((_, i) => <StarIcon key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
          {/* Half star */}
          {hasHalfStar && <div className="relative">
              <StarIcon className="w-4 h-4 text-gray-300" />
              <div className="absolute inset-0 overflow-hidden" style={{
            width: '50%'
          }}>
                <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>}
          {/* Empty stars */}
          {Array.from({
          length: emptyStars
        }).map((_, i) => <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)}
        </div>
        <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
      </div>;
  };
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
  // Add state for each product's feedback
  const [productFeedback, setProductFeedback] = useState<Record<number, 'up' | 'down' | null>>({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
  });
  const handleModalSubmit = () => {
    if (modalFeedback.length < 10) {
      setModalError('Please provide at least 10 characters of feedback');
      return;
    }
    setModalError('');
    setIsSubmitted(true);
    // Reset after 2 seconds
    setTimeout(() => {
      setShowModal(false);
      setModalFeedback('');
      setIsSubmitted(false);
    }, 2000);
  };
  if (!formData) {
    return <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="text-center">
        <p className="text-gray-600 mb-4">No recommendation data found.</p>
        <button onClick={() => navigate('/')} className="text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center mx-auto">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Form
        </button>
      </motion.div>;
  }
  const topRecommendation = recommendations[0];
  const otherRecommendations = recommendations.slice(1);
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
    }} className="space-y-8">
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
            <p className="text-white/90">
              Based on their interests and your budget of £{formData.minBudget}{' '}
              - £{formData.maxBudget}
            </p>
          </div>
          {/* Large Top Product Card */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.4
        }} className="bg-gradient-to-br from-[#7265f1] via-[#a87ec0] to-[#de9696] rounded-xl shadow-lg overflow-hidden border border-gray-200 max-w-2xl mx-auto">
            <div className="relative">
              <img src={topRecommendation.image} alt={topRecommendation.title} className="w-full h-64 object-cover" />
              <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-md">
                <span className="text-purple-600 font-bold text-lg">
                  £{topRecommendation.price}
                </span>
              </div>
            </div>
            <div className="p-6 bg-white/90 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                {topRecommendation.title}
              </h3>
              <div className="mb-3 flex justify-center">
                <StarRating rating={topRecommendation.rating} />
              </div>
              <div className="flex items-start space-x-3 mb-3">
                <TagIcon className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{topRecommendation.description}</p>
              </div>
              <div className="flex items-start space-x-3 mb-6">
                <HeartIcon className="w-5 h-5 text-rose-500 mt-1 flex-shrink-0" />
                <p className="text-gray-600">{topRecommendation.matchReason}</p>
              </div>
              {/* Button Section - Responsive layout */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Show on Amazon
                </motion.button>
                <div className="flex gap-2 sm:gap-3">
                  <motion.button whileHover={{
                  scale: productFeedback[0] !== 'down' ? 1.05 : 1
                }} whileTap={{
                  scale: productFeedback[0] !== 'down' ? 0.95 : 1
                }} onClick={() => productFeedback[0] !== 'down' && setProductFeedback(prev => ({
                  ...prev,
                  0: 'up'
                }))} className={`flex-1 ${productFeedback[0] === 'up' ? 'bg-green-100 text-green-700 border-2 border-green-300' : productFeedback[0] === 'down' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2`} disabled={productFeedback[0] === 'down'}>
                    <ThumbsUpIcon className="w-5 h-5" />
                    <span className="font-medium">Good</span>
                  </motion.button>
                  <motion.button whileHover={{
                  scale: productFeedback[0] !== 'up' ? 1.05 : 1
                }} whileTap={{
                  scale: productFeedback[0] !== 'up' ? 0.95 : 1
                }} onClick={() => productFeedback[0] !== 'up' && setProductFeedback(prev => ({
                  ...prev,
                  0: 'down'
                }))} className={`flex-1 ${productFeedback[0] === 'down' ? 'bg-red-100 text-red-700 border-2 border-red-300' : productFeedback[0] === 'up' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2`} disabled={productFeedback[0] === 'up'}>
                    <ThumbsDownIcon className="w-5 h-5" />
                    <span className="font-medium">Bad</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* Other Recommendations Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            More Great Options
          </h3>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherRecommendations.map((item, index) => {
            const feedbackIndex = index + 1;
            return <motion.div key={index} variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
                  <div className="relative">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                      <span className="text-purple-600 font-semibold">
                        £{item.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {item.title}
                    </h4>
                    <div className="mb-3">
                      <StarRating rating={item.rating} />
                    </div>
                    <div className="flex items-start space-x-2 mb-2">
                      <TagIcon className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-700">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-start space-x-2 mb-4 flex-1">
                      <HeartIcon className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        {item.matchReason}
                      </p>
                    </div>
                    {/* Button Section - Two Rows - Always at bottom */}
                    <div className="space-y-2 mt-auto">
                      {/* Row 1: Amazon button */}
                      <motion.button whileHover={{
                    scale: 1.02
                  }} whileTap={{
                    scale: 0.98
                  }} onClick={() => window.open('https://amazon.co.uk', '_blank')} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm">
                        <ShoppingCartIcon className="w-4 h-4 mr-2" />
                        Show on Amazon
                      </motion.button>
                      {/* Row 2: Good and Bad buttons */}
                      <div className="flex gap-2">
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
        </motion.div>
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
          <button onClick={() => setShowModal(true)} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]">
            Request New Recommendations
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
        }} className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              {isSubmitted ? <motion.div initial={{
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
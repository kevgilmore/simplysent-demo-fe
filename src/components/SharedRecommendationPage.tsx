import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, TagIcon, ShoppingCartIcon, AlertTriangleIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon, ThumbsUpIcon, ThumbsDownIcon, StarIcon } from 'lucide-react';
import { getApiBaseUrl, apiFetch } from '../utils/apiConfig';

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

export function SharedRecommendationPage() {
  const { recId } = useParams<{ recId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contextInfo, setContextInfo] = useState<any>(null);
  const [isInterestsExpanded, setIsInterestsExpanded] = useState(false);
  const [productRatings, setProductRatings] = useState<{[key: string]: number | null}>({});
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const handleRating = (productSku: string, rating: number) => {
    setProductRatings(prev => ({
      ...prev,
      [productSku]: prev[productSku] === rating ? null : rating
    }));
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      // Here you would typically send the comment to your backend
      console.log('Comment submitted:', comment);
      setComment('');
      setShowCommentInput(false);
      setShowThankYou(true);
    }
  };

  // Update meta tags for social sharing
  useEffect(() => {
    if (products.length > 0 && contextInfo) {
      const title = contextInfo.relationship?.toLowerCase() === 'father' 
        ? '🎁 Top Picks for Dad'
        : contextInfo.relationship?.toLowerCase() === 'mother'
        ? '🎁 Top Picks for Mum'
        : '🎁 Top Picks';
      
      const description = `Personalized gift recommendations for ${contextInfo.personAge ? `age ${contextInfo.personAge}` : 'them'}${contextInfo.occasion ? ` for ${contextInfo.occasion}` : ''}. ${products.length} carefully curated gift suggestions.`;
      
      // Update document title
      document.title = `${title} | SimplySent`;
      
      // Update or create meta tags
      const updateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      const updateMetaName = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Open Graph meta tags
      updateMetaTag('og:title', title);
      updateMetaTag('og:description', description);
      updateMetaTag('og:url', `https://simplysent.co/${recId}`);
      updateMetaTag('og:type', 'website');
      updateMetaTag('og:site_name', 'SimplySent');
      
      // Twitter Card meta tags
      updateMetaName('twitter:card', 'summary_large_image');
      updateMetaName('twitter:title', title);
      updateMetaName('twitter:description', description);
      
      // General meta tags
      updateMetaName('description', description);
    }
  }, [products, contextInfo, recId]);

  useEffect(() => {
    const loadRecommendation = () => {
      try {
        // Try to load from localStorage first
        const storedData = localStorage.getItem(`recommendation_${recId}`);
        if (storedData) {
          const data = JSON.parse(storedData);
          console.log('Loaded recommendation from localStorage:', data);
          
          // Store context info if available
          if (data.formData) {
            setContextInfo(data.formData);
          }
          
          // Normalize and set products similar to ResultsPage
          if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
            const normalizedProducts = data.recommendations.map((product: any) => {
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
            
            setProducts(sortedProducts);
            setLoading(false);
            return;
          }
        }
        
        // If not found in localStorage, try API (for future when backend supports it)
        const fetchFromAPI = async () => {
          try {
            const apiUrl = `${getApiBaseUrl()}/recommend/${recId}`;
            const response = await apiFetch(apiUrl, { method: 'GET' });
            
            if (!response.ok) {
              setError(true);
              return;
            }
            const data = await response.json();
            
            // Store in localStorage for future use
            localStorage.setItem(`recommendation_${recId}`, JSON.stringify(data));
            
            // Normalize and set products
            if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
              const normalizedProducts = data.recommendations.map((product: any) => {
                return {
                  sku: product.sku || product.ASIN || '',
                  productTitle: product.productTitle || product.name || '',
                  imageUrl: product.imageUrl || product.image_url || '',
                  price: product.price || '0.00',
                  description: product.description || '',
                  rank: product.rank || '999',
                  ASIN: product.ASIN,
                  name: product.name,
                  image_url: product.image_url
                };
              });
              
              const sortedProducts = [...normalizedProducts].sort((a, b) => {
                const rankA = parseInt(a.rank) || 999;
                const rankB = parseInt(b.rank) || 999;
                return rankA - rankB;
              });
              
              setProducts(sortedProducts);
            } else {
              setError(true);
            }
          } catch (err) {
            console.error('Failed to fetch recommendation from API:', err);
            setError(true);
          } finally {
            setLoading(false);
          }
        };
        
        fetchFromAPI();
        
      } catch (err) {
        console.error('Failed to load recommendation:', err);
        setError(true);
        setLoading(false);
      }
    };
    
    if (recId && recId.startsWith('rec_')) {
      loadRecommendation();
    } else {
      setError(true);
      setLoading(false);
    }
  }, [recId]);

  // Loading state
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-200/60 to-pink-200/60 blur-xl"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-gray-600">Loading your recommendations...</p>
        </div>
      </motion.div>
    );
  }

  // Error state (404)
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center space-y-6">
          <div className="relative w-40 h-40 mx-auto mb-2">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-200/60 to-pink-200/60 blur-2xl"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <AlertTriangleIcon className="w-20 h-20 text-purple-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Recommendation Not Found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            This recommendation link may be invalid, expired, or the recommendation was created on a different device. Please create a new recommendation to get started.
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Home
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/results')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-colors"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Create New Recommendation
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Success state - display products
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Home
        </motion.button>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {contextInfo?.relationship?.toLowerCase() === 'father' 
            ? '🎁 Top Picks for Dad'
            : contextInfo?.relationship?.toLowerCase() === 'mother'
            ? '🎁 Top Picks for Mum'
            : '🎁 Top Picks'
          }
        </h1>
      </div>


      {/* Context Information */}
      {contextInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
            <div className="space-y-4 pb-20">
              {/* Other preferences in a grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                {contextInfo.personAge && (
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">👤</span>
                    <span className="text-gray-700"><strong>Age:</strong> {contextInfo.personAge}</span>
                  </div>
                )}
                {contextInfo.gender && (
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">⚧</span>
                    <span className="text-gray-700"><strong>Gender:</strong> {contextInfo.gender}</span>
                  </div>
                )}
                {contextInfo.relationship && (
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">💕</span>
                    <span className="text-gray-700"><strong>Relationship:</strong> {contextInfo.relationship}</span>
                  </div>
                )}
                {contextInfo.occasion && (
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">🎉</span>
                    <span className="text-gray-700"><strong>Occasion:</strong> {contextInfo.occasion}</span>
                  </div>
                )}
                {contextInfo.sentiment && (
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">😊</span>
                    <span className="text-gray-700"><strong>Mood:</strong> {contextInfo.sentiment}</span>
                  </div>
                )}
                {contextInfo.favoritedrink && (
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">🥤</span>
                    <span className="text-gray-700"><strong>Favorite Drink:</strong> {contextInfo.favoritedrink}</span>
                  </div>
                )}
                {contextInfo.clothesSize && (
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">👕</span>
                    <span className="text-gray-700"><strong>Clothes Size:</strong> {contextInfo.clothesSize}</span>
                  </div>
                )}
                {(contextInfo.minBudget || contextInfo.maxBudget) && (
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">💰</span>
                    <span className="text-gray-700">
                      <strong>Budget:</strong> £{contextInfo.minBudget || 0} - £{contextInfo.maxBudget || '∞'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Interests section - absolutely positioned at bottom */}
            {contextInfo.interests && contextInfo.interests.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-b-2xl shadow-2xl">
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-indigo-400/20 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"></div>
                
                {/* Desktop Layout */}
                <div className="hidden md:block relative z-10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎨</span>
                      <span className="text-white font-bold text-lg">Interests</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 max-w-4xl">
                      {contextInfo.interests.map((interest: string, index: number) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-white/90 text-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 border border-white/50 backdrop-blur-sm"
                        >
                          {interest}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden relative z-10">
                  <motion.button
                    onClick={() => setIsInterestsExpanded(!isInterestsExpanded)}
                    className="w-full p-4 flex items-center justify-between text-left"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎨</span>
                      <span className="text-white font-bold text-lg">Interests</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isInterestsExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDownIcon className="w-5 h-5 text-white" />
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isInterestsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                          <div className="flex flex-wrap gap-2">
                            {contextInfo.interests.map((interest: string, index: number) => (
                              <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.1, y: -2 }}
                                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-white/90 text-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 border border-white/50 backdrop-blur-sm"
                              >
                                {interest}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Top Recommendation */}
      {products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Recommendation</h2>
            <p className="text-gray-600">Our #1 pick</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-100 via-indigo-50 to-pink-100 rounded-3xl shadow-2xl overflow-hidden border border-purple-200"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-gradient-to-br from-purple-200 to-indigo-200 overflow-hidden">
                {products[0].imageUrl ? (
                  <img
                    src={products[0].imageUrl}
                    alt={products[0].productTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-purple-400">
                    <TagIcon className="w-16 h-16" />
                  </div>
                )}
                
                {/* Rank Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                  #1 TOP PICK
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {products[0].productTitle}
                </h3>
                
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {products[0].description}
                </p>

                {/* Price and Rating */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleRating(products[0].sku, 1)}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      animate={productRatings[products[0].sku] ? {} : { y: [0, -8, 0] }}
                      transition={productRatings[products[0].sku] ? {} : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className={`p-3 rounded-full transition-all shadow-lg hover:shadow-xl ${
                        productRatings[products[0].sku] === 1
                          ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-200'
                          : 'bg-white border-2 border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-500 hover:bg-green-50'
                      }`}
                    >
                      <ThumbsUpIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleRating(products[0].sku, -1)}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      animate={productRatings[products[0].sku] ? {} : { y: [0, -8, 0] }}
                      transition={productRatings[products[0].sku] ? {} : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className={`p-3 rounded-full transition-all shadow-lg hover:shadow-xl ${
                        productRatings[products[0].sku] === -1
                          ? 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-red-200'
                          : 'bg-white border-2 border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <ThumbsDownIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <span className="text-3xl font-bold text-purple-600">
                    £{products[0].price}
                  </span>
                </div>

                {/* Action Button */}
                <motion.a
                  href={`https://www.amazon.co.uk/dp/${products[0].ASIN || products[0].sku}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  View on Amazon
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}



      {/* Other Recommendations */}
      {products.length > 1 && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">More Recommendations</h2>
            <p className="text-gray-600">Other great options</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {products.slice(1, 5).map((product, index) => (
                <motion.div
                  key={product.sku}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: (index + 1) * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.productTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <TagIcon className="w-12 h-12" />
                      </div>
                    )}
                    
                    {/* Rank Badge */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      #{product.rank}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 flex-grow">
                      {product.productTitle}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {product.description}
                    </p>

                    {/* Price and Rating */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex gap-1">
                        <motion.button
                          onClick={() => handleRating(product.sku, 1)}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          animate={productRatings[product.sku] ? {} : { y: [0, -6, 0] }}
                          transition={productRatings[product.sku] ? {} : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className={`p-2 rounded-full transition-all shadow-md hover:shadow-lg ${
                            productRatings[product.sku] === 1
                              ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-200'
                              : 'bg-white border-2 border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-500 hover:bg-green-50'
                          }`}
                        >
                          <ThumbsUpIcon className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleRating(product.sku, -1)}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          animate={productRatings[product.sku] ? {} : { y: [0, -6, 0] }}
                          transition={productRatings[product.sku] ? {} : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className={`p-2 rounded-full transition-all shadow-md hover:shadow-lg ${
                            productRatings[product.sku] === -1
                              ? 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-red-200'
                              : 'bg-white border-2 border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <ThumbsDownIcon className="w-4 h-4" />
                        </motion.button>
                      </div>
                      <span className="text-xl font-bold text-purple-600">
                        £{product.price}
                      </span>
                    </div>

                    {/* Action Button - Fixed height */}
                    <div className="mt-auto">
                      <motion.a
                        href={`https://www.amazon.co.uk/dp/${product.ASIN || product.sku}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <ShoppingCartIcon className="w-4 h-4" />
                        View on Amazon
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Special Rating Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8"
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
              {/* Subtle accent line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-300 to-emerald-300"></div>
              
              <div className="relative z-10 px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <motion.div 
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-lg">👍</span>
                  </motion.div>
                  <div className="relative overflow-hidden">
                    <h3 className="text-lg font-semibold text-white relative z-10">Help them decide!</h3>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                  <motion.div 
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
                  >
                    <span className="text-lg">👎</span>
                  </motion.div>
                </div>
                <p className="text-white/90 text-sm">
                  Use the thumbs up/down buttons to show which gifts you think they'd love most
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* No products message */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-200/60 to-pink-200/60 blur-2xl"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <TagIcon className="w-16 h-16 text-purple-500" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No recommendations found
          </h3>
          <p className="text-gray-600">
            This recommendation may not have any products available.
          </p>
        </div>
      )}

      {/* Overall Rating Section */}
      <div className="mt-16 pt-8 pb-8 border-t border-gray-200">
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              How did we do?
            </h3>
            <p className="text-gray-600">
              Rate this recommendation to help us improve
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {productRatings['overall'] ? (
              <motion.div
                key="thank-you"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-2 text-lg text-gray-600"
              >
                <span className="text-xl">👍</span>
                <span>Thanks for the feedback!</span>
              </motion.div>
            ) : (
              <motion.div
                key="stars"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center gap-2"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => handleRating('overall', star)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="transition-all"
                  >
                    <StarIcon 
                      className="w-8 h-8 text-gray-300 hover:text-yellow-300"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          
          <div className="mt-4">
            <AnimatePresence mode="wait">
              {showThankYou ? (
                <motion.div
                  key="thank-you"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center gap-2 text-sm text-gray-600"
                >
                  <span className="text-lg">🙏</span>
                  <span>Thank you for your feedback!</span>
                </motion.div>
              ) : !showCommentInput ? (
                <motion.button
                  key="comment-button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowCommentInput(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-50"
                >
                  Leave a comment
                </motion.button>
              ) : (
                <motion.div
                  key="comment-input"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-2 px-4 md:px-16 lg:px-24"
                >
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300 bg-gray-50 transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && comment.trim() && handleCommentSubmit()}
                  />
                  <motion.button
                    onClick={comment.trim() ? handleCommentSubmit : () => setShowCommentInput(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      comment.trim()
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow-md'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                  >
                    {comment.trim() ? 'Submit' : 'Cancel'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 pb-8 border-t border-gray-200">
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Want to find more personalized gift recommendations?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="https://www.simplysent.co/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Try AI Recommender
            </motion.a>
            <motion.a
              href="https://www.simplysent.co/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold rounded-xl transition-all w-full sm:w-auto"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Homepage
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

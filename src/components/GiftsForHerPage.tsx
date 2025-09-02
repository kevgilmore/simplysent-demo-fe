import React, { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ShoppingCartIcon, Loader2Icon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { fetchCollectionProducts, ShopifyProduct, generateAmazonUrl, truncateTitle, formatDescription } from '../services/shopifyService';
export function GiftsForHerPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);
  // Add useEffect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Add state for budget range
  const [budgetRange, setBudgetRange] = useState([10, 300]);
  // Add state for slider dragging
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  // Fetch products from Shopify API
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const shopifyProducts = await fetchCollectionProducts('for-her');
        setProducts(shopifyProducts);
        setFilteredProducts(shopifyProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);
  // Filter products based on budget range
  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(product => {
        const price = product.variants[0]?.price || 0;
        return price >= budgetRange[0] && price <= budgetRange[1];
      });
      setFilteredProducts(filtered);
      // Calculate total pages
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      // Reset to page 1 when filters change
      setCurrentPage(1);
    }
  }, [budgetRange, products]);
  // Get current products for pagination
  const getCurrentProducts = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  };
  // Toggle description expansion
  const toggleDescription = (productId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };
  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://cerescann.com/wp-content/uploads/2016/07/Product-PlaceHolder.jpg';
  };
  // Handle slider mouse events
  const handleMouseDown = (handle: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  };
  // Handle slider touch events
  const handleTouchStart = (handle: 'min' | 'max') => (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX, e.currentTarget.getBoundingClientRect());
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    updateSliderPosition(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
  };
  const updateSliderPosition = (clientX: number, rect: DOMRect) => {
    const newPosition = Math.max(0, Math.min(100, (clientX - rect.left) / rect.width * 100));
    const newValue = Math.round(newPosition / 100 * 300);
    // Ensure minimum value is 10
    const adjustedValue = Math.max(10, Math.min(300, newValue));
    if (isDragging === 'min') {
      if (adjustedValue < budgetRange[1]) {
        setBudgetRange([adjustedValue, budgetRange[1]]);
      }
    } else {
      if (adjustedValue > budgetRange[0]) {
        setBudgetRange([budgetRange[0], adjustedValue]);
      }
    }
  };
  const handleMouseUp = () => {
    setIsDragging(null);
  };
  const handleTouchEnd = () => {
    setIsDragging(null);
  };
  // Add event listeners for mouse up and touch end outside the slider
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(null);
      const handleGlobalTouchEnd = () => setIsDragging(null);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchend', handleGlobalTouchEnd);
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }
  }, [isDragging]);
  // Handle page change
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <motion.div initial={{
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
  }} className="space-y-6 pb-16">
      <div className="flex items-center mb-4">
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
          Back to Home
        </motion.button>
      </div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2 relative inline-block">
          <span className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 transform -rotate-1 rounded-xl"></span>
          <span className="relative bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent px-6 py-2">
            Gifts for Her
          </span>
          <div className="absolute -top-4 -right-6 text-pink-400 opacity-60 transform rotate-12 text-2xl">
            ♀
          </div>
        </h1>
        <p className="text-gray-600">
          Curated selection of perfect gifts for the special woman in your life
        </p>
      </div>
      {/* Simplified filtering section - centered with no card */}
      <div className="flex flex-col items-center space-y-4 mb-6">
        {/* Budget Range - single slider with two handles */}
        <div className="w-full max-w-md px-4">
          <div className="flex justify-between mb-1">
            <p className="text-sm font-medium text-pink-600">
              £{budgetRange[0]}
            </p>
            <p className="text-sm font-medium text-pink-600">
              £{budgetRange[1]}
            </p>
          </div>
          <div className="relative h-12 flex items-center cursor-pointer touch-none" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {/* Track background */}
            <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
            {/* Colored track between handles */}
            <div className="absolute h-2 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full" style={{
            left: `${budgetRange[0] / 300 * 100}%`,
            width: `${(budgetRange[1] - budgetRange[0]) / 300 * 100}%`
          }}></div>
            {/* Min handle */}
            <div className={`absolute w-7 h-7 bg-white border-2 ${isDragging === 'min' ? 'border-pink-500 scale-110' : 'border-pink-400'} rounded-full shadow-md cursor-grab ${isDragging === 'min' ? 'cursor-grabbing' : ''} transition-transform`} style={{
            left: `calc(${budgetRange[0] / 300 * 100}% - 14px)`
          }} onMouseDown={handleMouseDown('min')} onTouchStart={handleTouchStart('min')}></div>
            {/* Max handle */}
            <div className={`absolute w-7 h-7 bg-white border-2 ${isDragging === 'max' ? 'border-purple-500 scale-110' : 'border-purple-400'} rounded-full shadow-md cursor-grab ${isDragging === 'max' ? 'cursor-grabbing' : ''} transition-transform`} style={{
            left: `calc(${budgetRange[1] / 300 * 100}% - 14px)`
          }} onMouseDown={handleMouseDown('max')} onTouchStart={handleTouchStart('max')}></div>
          </div>
        </div>
      </div>
      {/* Loading state */}
      {loading && <div className="flex justify-center items-center py-20">
          <Loader2Icon className="w-12 h-12 text-pink-600 animate-spin" />
        </div>}
      {/* Error state */}
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button onClick={() => setLoading(true)} className="mt-4 bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg">
            Try Again
          </button>
        </div>}
      {/* Product Grid */}
      {!loading && !error && <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {getCurrentProducts().map(product => {
        const isExpanded = expandedDescriptions.has(product.id);
        const formattedDescription = formatDescription(product.description || '');
        return <motion.div key={product.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: getCurrentProducts().indexOf(product) * 0.1
        }} className="bg-gradient-to-b from-pink-50 to-purple-50 rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full">
                <div className="relative">
                  <img src={product.featuredImage?.url || 'https://cerescann.com/wp-content/uploads/2016/07/Product-PlaceHolder.jpg'} alt={product.title} className="w-full h-72 object-cover" onError={handleImageError} />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-2 rounded-full shadow-md">
                    <span className="text-purple-600 font-bold text-xl">
                      £{product.variants[0]?.price?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  {/* Fixed height title container */}
                  <div className="h-[60px] mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 font-heading line-clamp-2">
                      {truncateTitle(product.title, 50)}
                    </h3>
                  </div>
                  {/* Description with expandable content */}
                  <div className={`mb-4 overflow-hidden ${isExpanded ? '' : 'max-h-[120px]'} relative`}>
                    <p className="text-gray-700">{formattedDescription}</p>
                    {/* Show gradient overlay and more button if description is long */}
                    {formattedDescription.length > 120 && !isExpanded && <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-pink-50 to-transparent"></div>}
                  </div>
                  {/* Show more/less button if description is long enough */}
                  {formattedDescription.length > 120 && <button onClick={() => toggleDescription(product.id)} className="text-pink-600 hover:text-pink-800 text-sm font-medium flex items-center mb-4">
                      {isExpanded ? 'Show less' : 'Show more'}
                      <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>}
                  <div className="mb-6 flex-grow">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Features:
                    </h4>
                    <ul className="space-y-1">
                      {(formattedDescription ? formattedDescription.split('.').filter(s => s.trim().length > 5).slice(0, 5) : [`${product.title} is a thoughtful gift option.`]).map((feature, index) => <li key={index} className="text-gray-600 flex items-start">
                          <span className="text-pink-500 mr-2">•</span>
                          {feature.trim() + (feature.trim().endsWith('.') ? '' : '.')}
                        </li>)}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <a href={generateAmazonUrl(product.variants[0]?.sku || '')} target="_blank" rel="noopener noreferrer" className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center no-underline">
                      <ShoppingCartIcon className="w-5 h-5 mr-2" />
                      View on Amazon
                    </a>
                  </div>
                </div>
              </motion.div>;
      })}
        </div>}
      {/* Pagination Controls */}
      {totalPages > 1 && <div className="flex justify-center items-center mt-12 space-x-2">
          <button onClick={() => goToPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`p-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`} aria-label="Previous page">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          {/* Page Numbers */}
          <div className="flex space-x-2">
            {Array.from({
          length: totalPages
        }, (_, i) => i + 1).map(page => {
          // Show first page, last page, current page, and pages around current page
          if (page === 1 || page === totalPages || page >= currentPage - 1 && page <= currentPage + 1) {
            return <button key={page} onClick={() => goToPage(page)} className={`w-10 h-10 rounded-lg ${currentPage === page ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}>
                    {page}
                  </button>;
          }
          // Show ellipsis for skipped pages
          if (page === 2 && currentPage > 3 || page === totalPages - 1 && currentPage < totalPages - 2) {
            return <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-500">
                    ...
                  </span>;
          }
          return null;
        })}
          </div>
          <button onClick={() => goToPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={`p-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`} aria-label="Next page">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>}
      {/* No Products Found */}
      {!loading && !error && filteredProducts.length === 0 && <div className="text-center py-20">
          <p className="text-gray-700 text-lg">
            No products found in this price range.
          </p>
        </div>}
    </motion.div>;
}
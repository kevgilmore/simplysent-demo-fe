import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ShoppingCartIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from 'lucide-react';
interface Product {
  ASIN: string;
  name: string;
  image_url: string;
  price: number;
  description: string;
  average_star_rating: number;
  url: string;
}
interface Pagination {
  has_next: boolean;
  has_previous: boolean;
  page: number;
  per_page: number;
  total_pages: number;
  total_products: number;
}
interface ApiResponse {
  products: Product[];
  pagination: Pagination;
}
// Star rating component
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
export function GiftsForHimPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  // Add a separate useEffect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Add state for budget range (not functional yet)
  const [budgetRange, setBudgetRange] = useState([10, 300]);
  // Add state for selected sentiment
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  // Add state for slider dragging
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);
  // Handle sentiment selection
  const handleSentimentSelect = (sentiment: string) => {
    setSelectedSentiment(selectedSentiment === sentiment ? null : sentiment);
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
    const adjustedValue = Math.max(10, newValue);
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
  const fetchProducts = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://gift-api-973409790816.europe-west1.run.app/gifts-for-him?page=${page}&per_page=12`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://cerescann.com/wp-content/uploads/2016/07/Product-PlaceHolder.jpg';
  };
  const handlePreviousPage = () => {
    if (pagination?.has_previous) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (pagination?.has_next) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Format product name to have proper capitalization
  const formatProductName = (name: string) => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };
  // Format product description to have proper capitalization for first sentence
  const formatDescription = (description: string) => {
    return description.charAt(0).toUpperCase() + description.slice(1);
  };
  // Extract key features from description
  const extractFeatures = (description: string): string[] => {
    // Split the description into sentences
    const sentences = description.split(/\.\s+/);
    // Take up to 5 sentences and format them as features
    return sentences.filter(sentence => sentence.length > 10) // Filter out very short sentences
    .slice(0, 5).map(sentence => sentence.trim() + (sentence.endsWith('.') ? '' : '.'));
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
  }} className="space-y-6 w-full">
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
          <span className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 transform -rotate-1 rounded-xl"></span>
          <span className="relative bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent px-6 py-2">
            Gifts for Him
          </span>
          <div className="absolute -top-4 -right-6 text-blue-400 opacity-60 transform rotate-12 text-2xl">
            ♂
          </div>
        </h1>
        <p className="text-gray-600">
          Curated selection of perfect gifts for the special man in your life
        </p>
      </div>

      {/* Simplified filtering section - centered with no card */}
      <div className="flex flex-col items-center space-y-4 mb-6">
        {/* Sentiment Pills - centered with selectable state */}
        <div className="flex justify-center w-full pt-2">
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => handleSentimentSelect('Practical')} className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedSentiment === 'Practical' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
              Practical
            </button>
            <button onClick={() => handleSentimentSelect('Luxury')} className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedSentiment === 'Luxury' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
              Luxury
            </button>
            <button onClick={() => handleSentimentSelect('Thoughtful')} className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedSentiment === 'Thoughtful' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
              Thoughtful
            </button>
            <button onClick={() => handleSentimentSelect('Fun')} className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedSentiment === 'Fun' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
              Fun
            </button>
          </div>
        </div>
        {/* Budget Range - single slider with two handles */}
        <div className="w-full max-w-md px-4">
          <div className="flex justify-between mb-1">
            <p className="text-sm font-medium text-blue-600">
              £{budgetRange[0]}
            </p>
            <p className="text-sm font-medium text-blue-600">
              £{budgetRange[1]}
            </p>
          </div>
          <div className="relative h-12 flex items-center cursor-pointer touch-none" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {/* Track background */}
            <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
            {/* Colored track between handles */}
            <div className="absolute h-2 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full" style={{
            left: `${budgetRange[0] / 300 * 100}%`,
            width: `${(budgetRange[1] - budgetRange[0]) / 300 * 100}%`
          }}></div>
            {/* Min handle */}
            <div className={`absolute w-7 h-7 bg-white border-2 ${isDragging === 'min' ? 'border-blue-500 scale-110' : 'border-blue-400'} rounded-full shadow-md cursor-grab ${isDragging === 'min' ? 'cursor-grabbing' : ''} transition-transform`} style={{
            left: `calc(${budgetRange[0] / 300 * 100}% - 14px)`
          }} onMouseDown={handleMouseDown('min')} onTouchStart={handleTouchStart('min')}></div>
            {/* Max handle */}
            <div className={`absolute w-7 h-7 bg-white border-2 ${isDragging === 'max' ? 'border-indigo-500 scale-110' : 'border-indigo-400'} rounded-full shadow-md cursor-grab ${isDragging === 'max' ? 'cursor-grabbing' : ''} transition-transform`} style={{
            left: `calc(${budgetRange[1] / 300 * 100}% - 14px)`
          }} onMouseDown={handleMouseDown('max')} onTouchStart={handleTouchStart('max')}></div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="flex justify-center items-center py-20">
          <Loader2Icon className="w-12 h-12 text-purple-600 animate-spin" />
        </div>}

      {/* Error State */}
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button onClick={() => fetchProducts(currentPage)} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg">
            Try Again
          </button>
        </div>}

      {/* Product Grid */}
      {!loading && !error && products.length > 0 && <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.map(product => <motion.div key={product.ASIN} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: products.indexOf(product) * 0.1
        }} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full">
                <div className="relative">
                  <img src={product.image_url} alt={product.name} className="w-full h-72 object-contain bg-white p-4" onError={handleImageError} />
                  <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-md">
                    <span className="text-purple-600 font-bold text-lg">
                      £{product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {formatProductName(product.name)}
                  </h3>
                  <div className="mb-4">
                    <StarRating rating={product.average_star_rating} />
                  </div>
                  <p className="text-gray-700 mb-4">
                    {formatDescription(product.description.slice(0, 200))}
                    {product.description.length > 200 ? '...' : ''}
                  </p>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Features:
                    </h4>
                    <ul className="space-y-1">
                      {extractFeatures(product.description).map((feature, index) => <li key={index} className="text-gray-600 flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            {feature}
                          </li>)}
                    </ul>
                  </div>
                  <div className="mt-auto flex justify-center w-full">
                    <a href={product.url} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center no-underline">
                      <ShoppingCartIcon className="w-5 h-5 mr-2" />
                      View on Amazon
                    </a>
                  </div>
                </div>
              </motion.div>)}
          </div>

          {/* Pagination Controls */}
          {pagination && <div className="flex items-center justify-between mt-10 bg-white p-4 rounded-xl shadow-md">
              <button onClick={handlePreviousPage} disabled={!pagination.has_previous} className={`flex items-center ${pagination.has_previous ? 'text-purple-600 hover:text-purple-800' : 'text-gray-400 cursor-not-allowed'}`}>
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                Previous
              </button>
              <div className="text-gray-700">
                Page {pagination.page} of {pagination.total_pages}
                <span className="text-sm text-gray-500 ml-2">
                  ({pagination.total_products} products)
                </span>
              </div>
              <button onClick={handleNextPage} disabled={!pagination.has_next} className={`flex items-center ${pagination.has_next ? 'text-purple-600 hover:text-purple-800' : 'text-gray-400 cursor-not-allowed'}`}>
                Next
                <ChevronRightIcon className="w-5 h-5 ml-1" />
              </button>
            </div>}
        </>}

      {/* No Products Found */}
      {!loading && !error && products.length === 0 && <div className="text-center py-20">
          <p className="text-gray-700 text-lg">No products found.</p>
        </div>}
    </motion.div>;
}
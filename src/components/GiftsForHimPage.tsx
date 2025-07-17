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
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts(currentPage);
  }, [currentPage]);
  const fetchProducts = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://gift-api-973409790816.europe-west1.run.app/gifts-for-him?page=${page}&per_page=10`);
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
  }} className="space-y-8">
      <div className="flex items-center mb-6">
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gifts for Him</h1>
        <p className="text-gray-600">
          Curated selection of perfect gifts for the special man in your life
        </p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map(product => <motion.div key={product.ASIN} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: products.indexOf(product) * 0.1
        }} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="relative">
                  <img src={product.image_url} alt={product.name} className="w-full h-72 object-contain bg-white p-4" onError={handleImageError} />
                  <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-md">
                    <span className="text-purple-600 font-bold text-lg">
                      £{product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
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
                  <a href={product.url} target="_blank" rel="noopener noreferrer" className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center no-underline">
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    View on Amazon
                  </a>
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
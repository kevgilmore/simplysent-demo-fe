import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon } from 'lucide-react';
import { ShopifyProduct, generateAmazonUrl, formatPrice, truncateTitle, formatDescription } from '../services/shopifyService';
interface GiftItem {
  image: string;
  name: string;
  price: string;
  rating: number;
  description: string;
  sku: string;
}
interface GiftCarouselProps {
  items: GiftItem[];
  theme: 'purple' | 'pink';
  isLoading?: boolean;
}
export function GiftCarousel({
  items,
  theme,
  isLoading = false
}: GiftCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  // Reset currentIndex when items change
  useEffect(() => {
    if (items.length > 0 && currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.995
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: 'easeOut'
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.995,
      transition: {
        duration: 0.28,
        ease: 'easeInOut'
      }
    })
  };
  const handleNext = () => {
    if (items.length === 0) return;
    setDirection(1);
    setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
  };
  const handlePrevious = () => {
    if (items.length === 0) return;
    setDirection(-1);
    setCurrentIndex(prevIndex => (prevIndex - 1 + items.length) % items.length);
  };
  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };
  // Auto-advance carousel
  useEffect(() => {
    if (items.length === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, items.length]);
  const dotActiveClass = theme === 'purple' ? 'bg-purple-600' : 'bg-pink-500';
  const buttonGradient = theme === 'purple' ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gradient-to-r from-pink-500 to-purple-600';
  const buttonHoverGradient = theme === 'purple' ? 'hover:from-purple-600 hover:to-indigo-700' : 'hover:from-pink-600 hover:to-purple-700';
  // Modified button hover props to completely disable animations on touch devices
  const buttonHoverProps = {
    whileHover: {
      scale: 1.06,
      transition: {
        duration: 0.2
      }
    },
    whileTap: {
      scale: 0.96,
      transition: {
        duration: 0.2
      }
    }
  };
  // Add a CSS class to disable hover effects on touch devices
  useEffect(() => {
    // Add a class to the document to identify touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      document.documentElement.classList.add('touch-device');
    } else {
      document.documentElement.classList.remove('touch-device');
    }
  }, []);
  // Loading state
  if (isLoading) {
    return <div className="relative w-full mb-4 min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>;
  }
  // Empty state
  if (items.length === 0) {
    return <div className="relative w-full mb-4 min-h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>No products available</p>
        </div>
      </div>;
  }
  // Safety check for current item
  const currentItem = items[currentIndex];
  if (!currentItem) {
    return <div className="relative w-full mb-4 min-h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Loading product...</p>
        </div>
      </div>;
  }
  // Format the description
  const formattedDescription = formatDescription(currentItem.description);
  return <div className="relative w-full mb-4">
      <div className="relative rounded-2xl overflow-visible" ref={carouselRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} tabIndex={0} onKeyDown={e => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
    }}>
        {/* Overlay navigation buttons - disabled animations on touch devices */}
        <div className="hidden sm:flex justify-between items-center absolute top-1/2 -translate-y-1/2 left-2 right-2 z-20 pointer-events-none">
          <button onClick={handlePrevious} className={`${buttonGradient} ${buttonHoverGradient} text-white p-2 md:p-3 rounded-full shadow-lg transition-colors pointer-events-auto no-hover-scale`} aria-label="Previous item">
            <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
              <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </button>
          <button onClick={handleNext} className={`${buttonGradient} ${buttonHoverGradient} text-white p-2 md:p-3 rounded-full shadow-lg transition-colors pointer-events-auto no-hover-scale`} aria-label="Next item">
            <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
              <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </button>
        </div>
        {/* Add this style tag to disable hover effects on touch devices */}
        <style jsx global>{`
          .touch-device .no-hover-scale:hover {
            transform: none !important;
          }
          .touch-device .group:hover {
            transform: none !important;
          }
          .touch-device .group:hover img {
            transform: none !important;
          }
          @media (hover: none) {
            *:hover {
              transform: none !important;
            }
            .group:hover {
              transform: none !important;
            }
            .group:hover img {
              transform: none !important;
            }
          }
        `}</style>
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <div className="group relative rounded-3xl p-[2px] bg-gradient-to-r from-fuchsia-400/60 to-purple-400/60 shadow-2xl">
            <motion.div key={currentIndex} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" whileHover={{
            y: -2
          }} className="relative rounded-3xl overflow-hidden border border-white/40 backdrop-blur-md bg-white/60 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 md:p-6">
                <div className="relative">
                  <img src={currentItem.image} alt={currentItem.name} className="w-full h-56 sm:h-64 object-cover rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]" onError={e => {
                  ;
                  (e.target as HTMLImageElement).src = 'https://cerescann.com/wp-content/uploads/2016/07/Product-PlaceHolder.jpg';
                }} />
                  {/* Top Pick badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    Top Pick
                  </div>
                  {/* Price pill */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full shadow-md">
                    <span className="text-white font-semibold">
                      {currentItem.price}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-between min-h-[200px]">
                  <div>
                    {/* Fixed height title container */}
                    <div className="h-[60px] mb-2">
                      <h3 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 line-clamp-2">
                        {truncateTitle(currentItem.name, 50)}
                      </h3>
                    </div>
                    <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3"></div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-700 text-sm md:text-base mb-4 line-clamp-3">
                      {formattedDescription}
                    </p>
                    <div className="mt-auto">
                      <a href={generateAmazonUrl(currentItem.sku)} target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-gray-900 font-semibold py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center text-sm md:text-base">
                        <ShoppingCartIcon className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        View on Amazon
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      </div>
      {/* Pagination dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {items.map((_, index) => <button key={index} onClick={() => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
      }} className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? dotActiveClass : 'bg-gray-300'}`} aria-label={`Go to slide ${index + 1}`} />)}
      </div>
    </div>;
}
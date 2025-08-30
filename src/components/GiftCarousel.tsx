import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon, StarIcon } from 'lucide-react';
interface GiftItem {
  image: string;
  name: string;
  price: string;
  rating: number;
  description: string;
}
interface GiftCarouselProps {
  items: GiftItem[];
  theme: 'purple' | 'pink';
}
export function GiftCarousel({
  items,
  theme
}: GiftCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const slideVariants = {
    hiddenRight: {
      x: '100%',
      opacity: 0
    },
    hiddenLeft: {
      x: '-100%',
      opacity: 0
    },
    visible: {
      x: '0',
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        duration: 0.3
      }
    })
  };
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
  };
  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex(prevIndex => (prevIndex - 1 + items.length) % items.length);
  };
  const gradientFrom = theme === 'purple' ? 'from-purple-50' : 'from-pink-50';
  const gradientTo = theme === 'purple' ? 'to-purple-100' : 'to-purple-100';
  const dotActiveClass = theme === 'purple' ? 'bg-purple-600' : 'bg-pink-500';
  return <div className="relative w-full mb-4">
      <div className="overflow-hidden rounded-2xl relative">
        <div className="flex justify-between absolute top-1/2 transform -translate-y-1/2 left-2 right-2 z-10">
          <button onClick={handlePrevious} className="bg-white/70 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-sm transition-all" aria-label="Previous item">
            <div className="w-7 h-7 flex items-center justify-center">
              <ChevronLeftIcon className="w-5 h-5" />
            </div>
          </button>
          <button onClick={handleNext} className="bg-white/70 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-sm transition-all" aria-label="Next item">
            <div className="w-7 h-7 flex items-center justify-center">
              <ChevronRightIcon className="w-5 h-5" />
            </div>
          </button>
        </div>
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div key={currentIndex} custom={direction} variants={slideVariants} initial={direction > 0 ? 'hiddenRight' : 'hiddenLeft'} animate="visible" exit="exit" className={`bg-gradient-to-b ${gradientFrom} ${gradientTo} rounded-2xl shadow-md overflow-hidden border border-gray-100 w-full`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
              <div className="relative">
                <img src={items[currentIndex].image} alt={items[currentIndex].name} className="w-full h-48 object-cover rounded-xl" />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1 rounded-full shadow-md">
                  <span className="text-purple-600 font-semibold">
                    £{items[currentIndex].price}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {items[currentIndex].name}
                  </h3>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < Math.floor(items[currentIndex].rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                    <span className="text-sm text-gray-600 ml-1">
                      {items[currentIndex].rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {items[currentIndex].description}
                  </p>
                </div>
                <a href="#" className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-xl transition-colors flex items-center justify-center text-sm">
                  <ShoppingCartIcon className="w-4 h-4 mr-2" />
                  View on Amazon
                </a>
              </div>
            </div>
          </motion.div>
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
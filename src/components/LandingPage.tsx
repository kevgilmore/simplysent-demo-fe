import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiftIcon, SparklesIcon, ShoppingBagIcon } from 'lucide-react';
export function LandingPage() {
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
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          AI Gifting from SimplySent
        </h1>
        <p className="text-xl text-gray-600">
          Discover thoughtful, personalized gifts for every occasion without the
          stress
        </p>
      </div>
      {/* Gifts for Him Card - Now full width */}
      <Link to="/for-him">
        <motion.div whileHover={{
        scale: 1.03
      }} className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl shadow-xl p-8 h-80 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 transform translate-x-16 -translate-y-16">
            <div className="absolute inset-0 bg-blue-500 opacity-10 rounded-full"></div>
          </div>
          <div className="relative z-10 text-center">
            <div className="bg-white/60 backdrop-blur-sm p-5 rounded-full inline-block mb-6">
              <ShoppingBagIcon className="w-16 h-16 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Gifts for Him
            </h2>
            <p className="text-gray-700">
              Find the perfect gift for the special man in your life
            </p>
          </div>
        </motion.div>
      </Link>
      {/* AI Recommender Card - Changed from Father's Day Special */}
      <Link to="/fathers-day">
        <motion.div whileHover={{
        scale: 1.02
      }} className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl shadow-xl p-8 mt-6 cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16">
            <div className="absolute inset-0 bg-purple-500 opacity-10 rounded-full"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Use AI Recommender
              </h2>
              <p className="text-gray-700">
                Let our advanced AI find the perfect gift based on your
                preferences
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-full">
              <SparklesIcon className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>;
}
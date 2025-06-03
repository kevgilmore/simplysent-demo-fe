import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, WrenchIcon } from 'lucide-react';
export function ErrorPage() {
  const navigate = useNavigate();
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} className="text-center space-y-6">
      <div className="relative w-64 h-64 mx-auto mb-8">
        <motion.div initial={{
        rotate: 0
      }} animate={{
        rotate: 360
      }} transition={{
        duration: 60,
        repeat: Infinity,
        ease: 'linear'
      }} className="absolute inset-0 flex items-center justify-center">
          <WrenchIcon className="w-24 h-24 text-purple-300" />
        </motion.div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">
        Oops! We're Having a Moment
      </h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Our gift-finding elves are doing some maintenance. Please try again in a
        few minutes!
      </p>
      <motion.button whileHover={{
      scale: 1.02
    }} whileTap={{
      scale: 0.98
    }} onClick={() => navigate('/')} className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition-colors">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Try Again
      </motion.button>
    </motion.div>;
}
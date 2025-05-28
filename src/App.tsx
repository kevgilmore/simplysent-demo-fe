import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GiftRecommenderForm } from './components/GiftRecommenderForm';
import { ResultsPage } from './components/ResultsPage';
import { AnimatePresence } from 'framer-motion';
function AnimatedRoutes() {
  const location = useLocation();
  return <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<GiftRecommenderForm />} />
        <Route path="/products" element={<ResultsPage />} />
      </Routes>
    </AnimatePresence>;
}
export function App() {
  return <BrowserRouter>
      <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Father's Day Gift Recommender
            </h1>
            <p className="text-gray-600">
              Find the perfect gift with our AI-powered recommendations
            </p>
          </div>
          <AnimatedRoutes />
        </div>
      </div>
    </BrowserRouter>;
}
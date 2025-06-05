import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GiftRecommenderForm } from './components/GiftRecommenderForm';
import { ResultsPage } from './components/ResultsPage';
import { Footer } from './components/Footer';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from './components/Analytics';
import { MetaPixel } from './components/MetaPixel';

const GA_MEASUREMENT_ID = 'G-JRT058C4VQ';
const META_PIXEL_ID = '907664617393399';

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
  return (
    <BrowserRouter>
      <Analytics measurementId={GA_MEASUREMENT_ID} />
      <MetaPixel pixelId={META_PIXEL_ID} />
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
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
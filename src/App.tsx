import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GiftRecommenderForm } from './components/GiftRecommenderForm';
import { ResultsPage } from './components/ResultsPage';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { GiftsForHimPage } from './components/GiftsForHimPage';
import { GiftsForHerPage } from './components/GiftsForHerPage';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from './components/Analytics';
import { MetaPixel } from './components/MetaPixel';
const GA_MEASUREMENT_ID = 'G-JRT058C4VQ';
const META_PIXEL_ID = '907664617393399';
function AnimatedRoutes() {
  const location = useLocation();
  return <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/fathers-day" element={<GiftRecommenderForm />} />
        <Route path="/for-him" element={<GiftsForHimPage />} />
        <Route path="/for-her" element={<GiftsForHerPage />} />
        <Route path="/products" element={<ResultsPage />} />
      </Routes>
    </AnimatePresence>;
}
export function App() {
  return <BrowserRouter>
      <Analytics measurementId={GA_MEASUREMENT_ID} />
      <MetaPixel pixelId={META_PIXEL_ID} />
      <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedRoutes />
          <Footer />
        </div>
      </div>
    </BrowserRouter>;
}
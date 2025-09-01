import React, { useEffect, createElement } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GiftRecommenderForm } from './components/GiftRecommenderForm';
import { ResultsPage } from './components/ResultsPage';
import { LandingPage } from './components/LandingPage';
import { GiftsForHimPage } from './components/GiftsForHimPage';
import { GiftsForHerPage } from './components/GiftsForHerPage';
import { AboutUs } from './components/AboutUs';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from './components/Analytics';
import { MetaPixel } from './components/MetaPixel';
const GA_MEASUREMENT_ID = 'G-JRT058C4VQ';
const META_PIXEL_ID = '907664617393399';
// Import Google Fonts in the head section
function addGoogleFonts() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&family=Baloo+2:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
  // Add global styles
  const style = document.createElement('style');
  style.textContent = `
    html {
      font-family: 'Comfortaa', cursive;
      font-weight: 500;
    }
    h1, h2, h3, h4, h5, h6, .font-heading {
      font-family: 'Baloo 2', cursive;
      font-weight: 600;
    }
    p, li, span, div {
      font-weight: 500;
    }
    button, a {
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);
}
function AnimatedRoutes() {
  const location = useLocation();
  useEffect(() => {
    addGoogleFonts();
  }, []);
  return <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/fathers-day" element={<GiftRecommenderForm />} />
        <Route path="/for-him" element={<GiftsForHimPage />} />
        <Route path="/for-her" element={<GiftsForHerPage />} />
        <Route path="/products" element={<ResultsPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
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
        </div>
      </div>
    </BrowserRouter>;
}
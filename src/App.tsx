import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { GiftRecommenderForm } from './components/GiftRecommenderForm';
import { ResultsPage } from './components/ResultsPage';
import { LandingPage } from './components/LandingPage';
import { GiftsForHimPage } from './components/GiftsForHimPage';
import { GiftsForHerPage } from './components/GiftsForHerPage';
import { AboutUs } from './components/AboutUs';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { BlogPost1 } from './components/BlogPost1';
import { BlogPost2 } from './components/BlogPost2';
import { BlogPost3 } from './components/BlogPost3';
import { AnimatePresence } from 'framer-motion';
import { ErrorPage } from './components/ErrorPage';
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
    /* Disable hover effects on touch devices */
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
  `;
  document.head.appendChild(style);
  // Add a class to the document to identify touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    document.documentElement.classList.add('touch-device');
  }
}
function AppShell() {
  const location = useLocation();
  useEffect(() => {
    addGoogleFonts();
  }, []);
  return <>
      <Analytics measurementId={GA_MEASUREMENT_ID} />
      <MetaPixel pixelId={META_PIXEL_ID} />
      <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 pt-8 px-4 overflow-x-hidden">
        <style>{`
          .no-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
          /* Disable hover effects on touch devices */
          .touch-device .no-hover-scale:hover {
            transform: none !important;
          }
          .touch-device .group:hover {
            transform: none !important;
          }
          .touch-device .group:hover img {
            transform: none !important;
          }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <div key={location.pathname}>
              <Outlet />
            </div>
          </AnimatePresence>
        </div>
      </div>
    </>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'results', element: <GiftRecommenderForm /> },
      { path: 'for-him', element: <GiftsForHimPage /> },
      { path: 'for-her', element: <GiftsForHerPage /> },
      { path: 'products', element: <ResultsPage /> },
      { path: 'about-us', element: <AboutUs /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms-of-service', element: <TermsOfService /> },
      { path: 'app-release-blog', element: <BlogPost1 /> },
      { path: 'fathers-day-guide', element: <BlogPost2 /> },
      { path: 'budget-gifts-guide', element: <BlogPost3 /> },
      { path: 'error', element: <ErrorPage /> }
    ]
  }
]);

export function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
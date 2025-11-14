import { useEffect } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    useLocation,
} from "react-router-dom";
import { RecommenderForm } from "./components/RecommenderForm";
import { SharePage } from "./pages/SharePage";
import { IntroPage } from "./pages/IntroPage";
import { AboutUsPage } from "./pages/AboutUsPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { BlogPost1 } from "./components/BlogPost1";
import { BlogPost2 } from "./components/BlogPost2";
import { BlogPost3 } from "./components/BlogPost3";
import { UIKitPage } from "./pages/UIKitPage";
import { PersonPage } from "./pages/PersonPage";
import { ProductPage } from "./pages/ProductPage";
import { AnimatePresence } from "framer-motion";
import { ErrorPage } from "./pages/ErrorPage";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { Analytics } from "./components/common/Analytics";
import { MetaPixel } from "./components/common/MetaPixel";
import { ToastContainer } from "./components/common/Toast";
import { ToastProvider, useToastContext } from "./contexts/ToastContext";
import { setToastFunctions } from "./services/toastService";
const GA_MEASUREMENT_ID = "G-JRT058C4VQ";
const META_PIXEL_ID = "907664617393399";
// Import Google Fonts in the head section
function addGoogleFonts() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
        "https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&family=Baloo+2:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    // Add global styles
    const style = document.createElement("style");
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
    const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.documentElement.classList.add("touch-device");
    }
}
function AppShell() {
    const location = useLocation();
    const { toasts, removeToast, showError } = useToastContext();

    useEffect(() => {
        addGoogleFonts();
        // Register toast functions for use in non-React contexts
        setToastFunctions({ showError });
    }, [showError]);

    console.log("Current route:", location.pathname);

    // Check if current route is a carousel page that needs full width
    const isCarouselPage = location.pathname === "/recommendations";
    // Check if current route is a product page that needs full width purple background
    const isProductPage = location.pathname.startsWith("/product/");

    return (
        <>
            <Analytics measurementId={GA_MEASUREMENT_ID} />
            <MetaPixel pixelId={META_PIXEL_ID} />
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <div
                className={`w-full min-h-screen overflow-x-hidden ${isCarouselPage || isProductPage ? "" : "bg-gradient-to-br from-purple-50 to-pink-100 pt-8"}`}
            >
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
                <div
                    className={
                        isCarouselPage ? "" : "max-w-7xl mx-auto px-2 sm:px-4"
                    }
                >
                    <AnimatePresence mode="wait">
                        <div key={location.pathname}>
                            <Outlet />
                        </div>
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppShell />,
        children: [
            { index: true, element: <IntroPage /> },
            { path: "results", element: <RecommenderForm /> },
            { path: "about-us", element: <AboutUsPage /> },
            { path: "privacy-policy", element: <PrivacyPolicyPage /> },
            { path: "terms-of-service", element: <TermsOfServicePage /> },
            { path: "app-release-blog", element: <BlogPost1 /> },
            { path: "fathers-day-guide", element: <BlogPost2 /> },
            { path: "budget-gifts-guide", element: <BlogPost3 /> },
            { path: "components", element: <UIKitPage /> },
            { path: "error", element: <ErrorPage /> },
            { path: "recommendations", element: <PersonPage /> },
            { path: "product/:productId", element: <ProductPage /> },
            { path: ":recId", element: <SharePage /> }, // Add at end to avoid conflicts
        ],
    },
]);

export function App() {
    return (
        <ErrorBoundary>
            <ToastProvider>
                <RouterProvider
                    router={router}
                    future={{ v7_startTransition: true }}
                />
            </ToastProvider>
        </ErrorBoundary>
    );
}

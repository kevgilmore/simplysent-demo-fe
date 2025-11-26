import { useEffect } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    useLocation,
} from "react-router-dom";
import { SharePage } from "./pages/SharePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { AboutUsPage } from "./pages/AboutUsPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { PersonPage } from "./pages/PersonPage";
import { ProductPage } from "./pages/ProductPage";
import { UIKitPage } from "./pages/UIKitPage";
import { AnimatePresence } from "framer-motion";
import { ErrorPage } from "./pages/ErrorPage";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { Analytics } from "./components/common/Analytics";
import { MetaPixel } from "./components/common/MetaPixel";
import { ToastContainer } from "./components/common/Toast";
import { ToastProvider, useToastContext } from "./contexts/ToastContext";
import { setToastFunctions } from "./services/toastService";
import { DevModeIndicator } from "./components/common/DevModeIndicator";
const GA_MEASUREMENT_ID = "G-JRT058C4VQ";
const META_PIXEL_ID = "907664617393399";
// Load StackSans fonts
function addStackSansFonts() {
    const style = document.createElement("style");
    style.textContent = `
    /* StackSansText Font Faces */
    @font-face {
      font-family: 'StackSansText';
      src: url('/fonts/StackSansText-ExtraLight.ttf') format('truetype');
      font-weight: 200;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansText';
      src: url('/fonts/StackSansText-Light.ttf') format('truetype');
      font-weight: 300;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansText';
      src: url('/fonts/StackSansText-Regular.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansText';
      src: url('/fonts/StackSansText-Medium.ttf') format('truetype');
      font-weight: 500;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansText';
      src: url('/fonts/StackSansText-SemiBold.ttf') format('truetype');
      font-weight: 600;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansText';
      src: url('/fonts/StackSansText-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
    }

    /* StackSansHeadline Font Faces */
    @font-face {
      font-family: 'StackSansHeadline';
      src: url('/fonts/StackSansHeadline-ExtraLight.ttf') format('truetype');
      font-weight: 200;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansHeadline';
      src: url('/fonts/StackSansHeadline-Light.ttf') format('truetype');
      font-weight: 300;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansHeadline';
      src: url('/fonts/StackSansHeadline-Regular.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansHeadline';
      src: url('/fonts/StackSansHeadline-Medium.ttf') format('truetype');
      font-weight: 500;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansHeadline';
      src: url('/fonts/StackSansHeadline-SemiBold.ttf') format('truetype');
      font-weight: 600;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansHeadline';
      src: url('/fonts/StackSansHeadline-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
    }

    /* StackSansNotch Font Faces - Only for logo */
    @font-face {
      font-family: 'StackSansNotch';
      src: url('/fonts/StackSansNotch-ExtraLight.ttf') format('truetype');
      font-weight: 200;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansNotch';
      src: url('/fonts/StackSansNotch-Light.ttf') format('truetype');
      font-weight: 300;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansNotch';
      src: url('/fonts/StackSansNotch-Regular.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansNotch';
      src: url('/fonts/StackSansNotch-Medium.ttf') format('truetype');
      font-weight: 500;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansNotch';
      src: url('/fonts/StackSansNotch-SemiBold.ttf') format('truetype');
      font-weight: 600;
      font-style: normal;
    }
    @font-face {
      font-family: 'StackSansNotch';
      src: url('/fonts/StackSansNotch-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
    }

    /* Global styles */
    html {
      font-family: 'StackSansText', sans-serif;
      font-weight: 400;
    }
    h1, h2, h3, h4, h5, h6, .font-headline {
      font-family: 'StackSansHeadline', sans-serif;
      font-weight: 500;
    }
    .font-notch {
      font-family: 'StackSansNotch', sans-serif;
    }
    p, li, span, div, body {
      font-family: 'StackSansText', sans-serif;
    }
    button, a {
      font-family: 'StackSansText', sans-serif;
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
        addStackSansFonts();
        // Register toast functions for use in non-React contexts
        setToastFunctions({ showError });
    }, [showError]);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    console.log("Current route:", location.pathname);

    // Check if current route is a carousel page that needs full width
    const isCarouselPage = location.pathname === "/person";
    // Check if current route is a product page that needs full width purple background
    const isProductPage = location.pathname.startsWith("/product/");

    return (
        <>
            <Analytics measurementId={GA_MEASUREMENT_ID} />
            <MetaPixel pixelId={META_PIXEL_ID} />
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <DevModeIndicator />
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
                        isCarouselPage || isProductPage ? "" : "max-w-7xl mx-auto px-2 sm:px-4"
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
            { index: true, element: <OnboardingPage /> },
            { path: "person", element: <PersonPage /> },
            { path: "product/:productId", element: <ProductPage /> },
            { path: "about", element: <AboutUsPage /> },
            { path: "privacy", element: <PrivacyPolicyPage /> },
            { path: "terms", element: <TermsOfServicePage /> },
            { path: "ui", element: <UIKitPage /> },
            { path: "error", element: <ErrorPage /> },
            { path: ":recId", element: <SharePage /> }, // Share page - must be last to avoid conflicts
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

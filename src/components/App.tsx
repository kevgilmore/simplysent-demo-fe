import React from 'react';
// ... existing code ...
export function App() {
  return <BrowserRouter>
      <Analytics measurementId={GA_MEASUREMENT_ID} />
      <MetaPixel pixelId={META_PIXEL_ID} />
      <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
        <style>{`
          .no-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <AnimatedRoutes />
        </div>
      </div>
    </BrowserRouter>;
}
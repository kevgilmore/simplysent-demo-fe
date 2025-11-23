/**
 * Utility functions for handling product images
 * 
 * CORS Issue: Images from Google Cloud Storage may be blocked by CORS policy.
 * Solutions:
 * 1. Configure CORS on GCS bucket (recommended) - see docs/CORS-FIX.md
 * 2. Use proxy endpoint in backend API (if implemented)
 * 3. Use signed URLs (if GCS SDK is available)
 */

/**
 * Get product image URL
 * @param asin - Product ASIN
 * @param imageNumber - Image number (1, 2, 3, etc.)
 * @param useProxy - Whether to use backend proxy (if implemented)
 * @returns Image URL
 */
export const getProductImageUrl = (
    asin: string,
    imageNumber: number = 1,
    useProxy: boolean = false
): string => {
    // If proxy is enabled and backend endpoint exists, use it
    // TODO: Implement proxy endpoint in backend API
    // Example: return `${getApiBaseUrl()}/api/product-image?asin=${asin}&num=${imageNumber}`;
    
    if (useProxy) {
        // This would require a backend endpoint like:
        // GET /api/product-image?asin=B09JRSVNCJ&num=1
        // Which proxies the request to GCS and adds proper CORS headers
        console.warn('Image proxy not yet implemented. Using direct GCS URL.');
    }
    
    // Direct GCS URL (requires CORS configuration on bucket)
    return `https://storage.googleapis.com/simplysent-product-images/${asin}/t_${asin}_${imageNumber}.png`;
};

/**
 * Get multiple product image URLs
 * @param asin - Product ASIN
 * @param count - Number of images to get (default: 3)
 * @param useProxy - Whether to use backend proxy
 * @returns Array of image URLs
 */
export const getProductImageUrls = (
    asin: string,
    count: number = 3,
    useProxy: boolean = false
): string[] => {
    return Array.from({ length: count }, (_, i) => 
        getProductImageUrl(asin, i + 1, useProxy)
    );
};

/**
 * Get product image URL with Firebase fallback
 * Tries GCP first, falls back to Firebase product_photos if GCP image not available
 * @param asin - Product ASIN
 * @param imageNumber - Image number (1, 2, 3, etc.)
 * @param firebaseProductPhotos - Firebase product_photos array (fallback)
 * @returns Image URL (GCP or Firebase fallback)
 */
export const getProductImageUrlWithFallback = (
    asin: string,
    imageNumber: number = 1,
    firebaseProductPhotos?: string[] | string
): string => {
    // Try GCP URL first
    const gcpUrl = getProductImageUrl(asin, imageNumber);
    
    // If Firebase has product_photos, use as fallback
    if (firebaseProductPhotos) {
        if (Array.isArray(firebaseProductPhotos) && firebaseProductPhotos.length > 0) {
            // Use the first image for imageNumber 1, second for 2, etc.
            const index = imageNumber - 1;
            if (firebaseProductPhotos[index]) {
                return firebaseProductPhotos[index];
            }
            // If specific index doesn't exist, use first available
            return firebaseProductPhotos[0];
        } else if (typeof firebaseProductPhotos === 'string') {
            return firebaseProductPhotos;
        }
    }
    
    // Default to GCP URL
    return gcpUrl;
};



# Fixing CORS for Google Cloud Storage Images

## Why CORS Errors Happen

CORS (Cross-Origin Resource Sharing) is a browser security feature. When your frontend (`http://localhost:3000`) tries to load images from Google Cloud Storage (`https://storage.googleapis.com`), the browser blocks it unless GCS explicitly allows it via CORS headers.

**You cannot fix this from the frontend** - it must be fixed on the server side (GCS bucket configuration).

## Option 1: Configure CORS on GCS Bucket (Recommended - Easiest)

This is the simplest solution. Configure your GCS bucket to allow requests from your frontend origin.

### Using gsutil CLI:

1. Save the CORS config file (already created at `docs/gcs-cors-config.json`)
2. Run:
```bash
gsutil cors set docs/gcs-cors-config.json gs://simplysent-product-images
```

### Using Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/storage/browser)
2. Navigate to: **Cloud Storage** → **Buckets** → `simplysent-product-images`
3. Click the **"Permissions"** tab
4. Scroll down and click **"Edit CORS configuration"**
5. Paste this JSON:
```json
[
  {
    "origin": ["http://localhost:3000", "https://your-production-domain.com"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Content-Length", "Content-Range"],
    "maxAgeSeconds": 3600
  }
]
```
6. Replace `https://your-production-domain.com` with your actual production domain
7. Click **"Save"**

**This will immediately fix the CORS errors!**

## Option 2: Proxy Images Through Your Backend API

If you can't configure CORS on the bucket, create a proxy endpoint in your backend API (`recommender-api`).

### Backend Implementation (Go):

Add this endpoint to your backend:

```go
// GET /api/product-image?asin=B09JRSVNCJ&num=1
func GetProductImage(w http.ResponseWriter, r *http.Request) {
    asin := r.URL.Query().Get("asin")
    imageNum := r.URL.Query().Get("num")
    if asin == "" || imageNum == "" {
        http.Error(w, "Missing asin or num parameter", http.StatusBadRequest)
        return
    }
    
    // Build GCS URL
    imageURL := fmt.Sprintf("https://storage.googleapis.com/simplysent-product-images/%s/t_%s_%s.png", asin, asin, imageNum)
    
    // Fetch image from GCS (server-to-server, no CORS issues)
    resp, err := http.Get(imageURL)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer resp.Body.Close()
    
    // Copy headers and body to response
    w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
    w.Header().Set("Cache-Control", "public, max-age=3600")
    w.Header().Set("Access-Control-Allow-Origin", "*") // Or specific origin
    
    io.Copy(w, resp.Body)
}
```

### Frontend Update:

Then update `src/utils/imageUtils.ts` to use the proxy:

```typescript
export const getProductImageUrl = (asin: string, imageNumber: number = 1): string => {
    const apiBase = getApiBaseUrl(); // From your apiConfig
    return `${apiBase}/api/product-image?asin=${asin}&num=${imageNumber}`;
};
```

## Option 3: Use Signed URLs (Advanced)

If you have GCS SDK access, generate signed URLs in your backend that don't require CORS. This is more complex but provides better security.

## Recommendation

**Use Option 1** - it's the simplest and most efficient solution. It takes 2 minutes and fixes the issue permanently.


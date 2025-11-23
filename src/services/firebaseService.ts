import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration
// These should be set via environment variables or Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
};

// Log Firebase config status (without exposing sensitive data)
if (typeof window !== 'undefined') {
  console.log('🔥 Firebase Config Status:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    projectId: firebaseConfig.projectId,
  });
}

let app: FirebaseApp | null = null;
let firestore: Firestore | null = null;

/**
 * Initialize Firebase app (singleton pattern)
 */
export const initializeFirebase = (): FirebaseApp => {
  if (app) {
    return app;
  }

  // Check if Firebase is already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    console.log('✅ Using existing Firebase app');
    return app;
  }

  // Validate Firebase config
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    const error = new Error('Firebase configuration is missing. Please set VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID environment variables.');
    console.error('❌ Firebase initialization error:', error);
    throw error;
  }

  try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
    return app;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

/**
 * Get Firestore instance for product-catalog database
 * Note: 'product-catalog' is the database ID. If your Firestore uses the default database,
 * remove the databaseId parameter or set it to '(default)'
 */
export const getProductCatalogFirestore = (): Firestore => {
  if (firestore) {
    return firestore;
  }

  const appInstance = initializeFirebase();
  
  // Initialize Firestore with database ID 'product-catalog'
  // If 'product-catalog' is a named database (not default), use it as databaseId
  // If you're using the default database, change this to: getFirestore(appInstance)
  const databaseId = 'product-catalog';
  
  try {
    // Try to connect to the named database
    firestore = getFirestore(appInstance, databaseId);
  } catch (error) {
    // If database doesn't exist or you're using default database, fall back to default
    console.warn(`Database '${databaseId}' not found or using default database, falling back to default`);
    firestore = getFirestore(appInstance);
  }
  
  return firestore;
};

/**
 * Product interface matching Firestore document structure
 */
export interface ProductDetails {
  asin: string;
  name?: string;
  productTitle?: string;
  imageUrl?: string;
  image_url?: string;
  price?: number | string;
  product_price?: string;
  rating?: number;
  product_star_rating?: number;
  num_ratings?: number;
  product_num_ratings?: number;
  description?: string;
  rank?: number;
  [key: string]: any; // Allow additional fields
}

/**
 * Fetch product details from Firestore by ASIN
 * @param asin - Product ASIN
 * @returns Product details or null if not found
 */
export const getProductByAsin = async (asin: string): Promise<ProductDetails | null> => {
  try {
    const db = getProductCatalogFirestore();
    const { doc, getDoc } = await import('firebase/firestore');
    
    // Reference to the document in 'amazon' collection with ASIN as document ID
    const productRef = doc(db, 'amazon', asin);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const data = productSnap.data();
      return {
        asin,
        ...data,
      } as ProductDetails;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching product ${asin} from Firestore:`, error);
    throw error;
  }
};

/**
 * Fetch multiple products by ASINs
 * @param asins - Array of product ASINs
 * @returns Array of product details (null for products not found)
 */
export const getProductsByAsins = async (asins: string[]): Promise<(ProductDetails | null)[]> => {
  try {
    const db = getProductCatalogFirestore();
    const { getDocs, collection, query, where } = await import('firebase/firestore');
    
    // If no ASINs provided, return empty array
    if (asins.length === 0) {
      return [];
    }
    
    // Firestore 'in' operator supports up to 10 items
    // If we have more than 10, we need to batch the queries
    const batchSize = 10;
    const results: (ProductDetails | null)[] = [];
    
    for (let i = 0; i < asins.length; i += batchSize) {
      const batch = asins.slice(i, i + batchSize);
      
      // Query products where ASIN is in the batch
      // Note: Using 'in' operator - if ASIN is stored as a field in documents
      const q = query(
        collection(db, 'amazon'),
        where('asin', 'in', batch)
      );
      
      const querySnapshot = await getDocs(q);
      const batchResults = new Map<string, ProductDetails>();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const asin = data.asin || doc.id;
        batchResults.set(asin, {
          asin,
          ...data,
        } as ProductDetails);
      });
      
      // Map results maintaining order
      batch.forEach((asin) => {
        results.push(batchResults.get(asin) || null);
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    throw error;
  }
};

/**
 * Alternative: Fetch products by document ID (if ASIN is the document ID)
 * This is more efficient if ASIN is the document ID
 */
export const getProductsByDocumentIds = async (asins: string[]): Promise<(ProductDetails | null)[]> => {
  console.log('🔥 Firebase: Starting to fetch products for ASINs:', asins);
  
  try {
    const db = getProductCatalogFirestore();
    console.log('🔥 Firebase: Firestore instance obtained');
    
    const { doc, getDoc } = await import('firebase/firestore');
    
    console.log(`🔥 Firebase: Fetching ${asins.length} products from collection 'amazon'`);
    
    const promises = asins.map(async (asin) => {
      try {
        const productRef = doc(db, 'amazon', asin);
        console.log(`🔥 Firebase: Fetching document for ASIN: ${asin}`);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const docData = productSnap.data();
          console.log(`✅ Firebase: Found product ${asin}`);
          console.log(`📋 Firebase: Full catalog data structure for ${asin}:`, JSON.stringify(docData, null, 2));
          
          // Handle different data structures:
          // Some products have data nested in a 'data' field, others have it at the top level
          const productData = docData.data || docData;
          
          // Log all available fields to help debug image extraction
          const allFields = Object.keys(productData);
          const imageFields = allFields.filter(key => 
            key.toLowerCase().includes('image') || 
            key.toLowerCase().includes('img') ||
            key.toLowerCase().includes('photo') ||
            key.toLowerCase().includes('picture')
          );
          console.log(`🔍 Firebase: Available image-related fields for ${asin}:`, imageFields);
          if (imageFields.length > 0) {
            imageFields.forEach(field => {
              console.log(`  - ${field}:`, productData[field]);
            });
          }
          
          // Also log the full data structure to see what's available
          if (productData.data) {
            const dataFields = Object.keys(productData.data);
            const dataImageFields = dataFields.filter(key => 
              key.toLowerCase().includes('image') || 
              key.toLowerCase().includes('img') ||
              key.toLowerCase().includes('photo') ||
              key.toLowerCase().includes('picture')
            );
            console.log(`🔍 Firebase: Image fields in data.data for ${asin}:`, dataImageFields);
            if (dataImageFields.length > 0) {
              dataImageFields.forEach(field => {
                console.log(`  - data.${field}:`, productData.data[field]);
              });
            }
          }
          
          // Extract image - based on actual Firebase structure
          // Structure: { status: "OK", data: { product_photo: "...", product_photos: [...] } }
          let imageUrl: string | undefined;
          
          // Check data.product_photo first (main product image)
          if (productData.product_photo) {
            imageUrl = productData.product_photo;
          }
          // Check data.product_photos array (first image)
          else if (productData.product_photos && Array.isArray(productData.product_photos) && productData.product_photos.length > 0) {
            imageUrl = productData.product_photos[0];
          }
          // Fallback to other possible image fields
          else if (productData.data && productData.data.product_photo) {
            imageUrl = productData.data.product_photo;
          }
          else if (productData.data && productData.data.product_photos && Array.isArray(productData.data.product_photos) && productData.data.product_photos.length > 0) {
            imageUrl = productData.data.product_photos[0];
          }
          // Check for other common image field names
          else {
            imageUrl = productData.image_url 
              || productData.imageUrl 
              || productData.main_image
              || productData.primary_image
              || productData.product_image
              || productData.image
              || (productData.images && Array.isArray(productData.images) && productData.images[0])
              || docData.image_url
              || docData.imageUrl
              || docData.main_image;
          }
          
          console.log(`🖼️ Firebase: Extracted image for ${asin}:`, imageUrl || 'NOT FOUND');
          
          // If still not found, log the full structure for debugging
          if (!imageUrl) {
            console.warn(`⚠️ Firebase: No image found for ${asin}. Full data structure:`, JSON.stringify(docData, null, 2).substring(0, 500));
          }
          
          // Extract price - handle product_price field
          let price: number | string | undefined;
          const priceStr = productData.product_price;
          if (priceStr) {
            // Remove currency symbols and parse
            price = parseFloat(priceStr.toString().replace(/[£$€,]/g, '')) || 0;
          } else {
            price = productData.price || productData.price_amount || productData.current_price;
          }
          
          // Extract rating and reviews
          const rating = productData.product_star_rating 
            ? parseFloat(productData.product_star_rating.toString()) 
            : undefined;
          const numRatings = productData.product_num_ratings || productData.num_ratings || 0;
          
          return {
            asin,
            ...docData,
            // Extract nested data fields if they exist
            name: productData.name || productData.product_title || productData.title,
            productTitle: productData.product_title || productData.title || productData.name,
            imageUrl: imageUrl,
            image_url: imageUrl,
            price: price,
            product_price: priceStr || productData.product_price,
            rating: rating,
            product_star_rating: rating,
            num_ratings: numRatings,
            product_num_ratings: numRatings,
            description: productData.description || productData.product_description,
            // Keep all original fields
            ...productData,
          } as ProductDetails;
        } else {
          console.warn(`⚠️ Firebase: Product ${asin} not found in collection 'amazon'`);
        }
        
        return null;
      } catch (error) {
        console.error(`❌ Firebase: Error fetching product ${asin}:`, error);
        return null;
      }
    });
    
    const results = await Promise.all(promises);
    const foundCount = results.filter(r => r !== null).length;
    console.log(`🔥 Firebase: Fetched ${foundCount}/${asins.length} products successfully`);
    
    return results;
  } catch (error) {
    console.error('❌ Firebase: Error fetching products from Firestore:', error);
    throw error;
  }
};



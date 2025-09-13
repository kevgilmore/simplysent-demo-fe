// API configuration with mode support
export const getApiBaseUrl = (mode?: string): string => {
  // Check URL parameters for mode if not provided
  if (!mode && typeof window !== 'undefined') {
    mode = getCurrentMode() || undefined;
  }
  
  // Training mode uses the same base URL as sandbox-local, but only training header is added
  if (mode === 'training') {
    console.log('🧪 Using TRAINING MODE (same URL as SANDBOX-LOCAL)');
    return getApiBaseUrl('sandbox-local');
  }
  
  // Sandbox modes (placeholder URLs - update these as needed)
  if (mode === 'sandbox') {
    console.log('📦 Using SANDBOX MODE');
    return 'https://catboost-recommender-api-973409790816.europe-west1.run.app/v2'; // Update with actual sandbox URL
  }
  
  if (mode === 'sandbox-local') {
    console.log('📦🟢 Using SANDBOX-LOCAL MODE');
    return 'http://localhost:8080/v2';
  }
  
  // Default production
  console.log('🌐 Using PRODUCTION API: https://catboost-recommender-api-973409790816.europe-west1.run.app/v2');
  return 'https://catboost-recommender-api-973409790816.europe-west1.run.app/v2';
  
  // TODO: Re-enable environment-based switching later
  /*
  const appEnv = import.meta.env.VITE_APP_ENV;
  
  if (appEnv === 'local') {
    return 'http://localhost:8080/v2';
  }
  
  return 'https://catboost-recommender-api-973409790816.europe-west1.run.app/v2';
  */
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string, queryParams?: URLSearchParams, mode?: string): string => {
  const baseUrl = getApiBaseUrl(mode);
  const baseDir = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  const relativeEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = new URL(relativeEndpoint, baseDir);
  
  if (queryParams) {
    queryParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }
  
  return url.toString();
};

// Helper function to get the current mode from URL parameters
export const getCurrentMode = (): string | null => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  const urlMode = urlParams.get('mode');
  if (urlMode) {
    try { localStorage.setItem('app_mode', urlMode); } catch {}
    return urlMode;
  }
  try {
    const stored = localStorage.getItem('app_mode');
    return stored || null;
  } catch {
    return null;
  }
};

// Helper function to get headers for API requests based on mode
export const getApiHeaders = (mode?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  // Check URL parameters for mode if not provided
  if (!mode && typeof window !== 'undefined') {
    mode = getCurrentMode() || undefined;
  }
  
  // Add training mode header
  if (mode === 'training') {
    headers['X-Training-Mode'] = 'true';
  }
  
  return headers;
};

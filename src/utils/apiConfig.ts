// API configuration - using production URL with v2
export const getApiBaseUrl = (): string => {
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
export const buildApiUrl = (endpoint: string, queryParams?: URLSearchParams): string => {
  const baseUrl = getApiBaseUrl();
  const url = new URL(endpoint, baseUrl);
  
  if (queryParams) {
    queryParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }
  
  return url.toString();
};

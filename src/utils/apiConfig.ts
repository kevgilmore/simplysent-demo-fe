// API configuration with URL param + localStorage-based dev mode switching
const PROD_BASE = 'https://catboost-recommender-api-973409790816.europe-west1.run.app/v2';
const DEV_BASE = 'http://localhost:8080/v2';
const STORAGE_KEY = 'ss_api_mode'; // 'dev' | 'prod'

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

function detectAndPersistModeFromQuery(): 'dev' | 'prod' | undefined {
  if (!isBrowser) return undefined;
  try {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'dev') {
      localStorage.setItem(STORAGE_KEY, 'dev');
      return 'dev';
    }
    if (mode === 'prod') {
      localStorage.setItem(STORAGE_KEY, 'prod');
      return 'prod';
    }
  } catch (e) {
    // noop
  }
  return undefined;
}

function getPersistedMode(): 'dev' | 'prod' | undefined {
  if (!isBrowser) return undefined;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dev' || stored === 'prod') return stored;
  return undefined;
}

export const getApiBaseUrl = (): string => {
  // Priority: explicit query param this load → persisted value → default prod
  const queryMode = detectAndPersistModeFromQuery();
  const persistedMode = getPersistedMode();
  const mode = queryMode ?? persistedMode ?? 'prod';

  const base = mode === 'dev' ? DEV_BASE : PROD_BASE;
  if (isBrowser) {
    if (mode === 'dev' && !(window as any).__ssDevLogShown) {
      console.log('🛠️ Local dev mode enabled');
      (window as any).__ssDevLogShown = true;
    }
    console.log(`🌐 Using ${mode.toUpperCase()} API: ${base}`);
  }
  return base;
};

export const isDevApiMode = (): boolean => {
  const persistedMode = getPersistedMode();
  // If a query param is present, detect will have persisted it already on first load
  const mode = persistedMode ?? 'prod';
  return mode === 'dev';
};

// Helper function to build full API URLs (only for recommender/feedback API)
export const buildApiUrl = (endpoint: string, queryParams?: URLSearchParams): string => {
  const baseUrl = getApiBaseUrl();
  // Ensure exactly one slash between base and endpoint and preserve /v2 path
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedEndpoint = endpoint.replace(/^\//, '');
  const url = new URL(`${normalizedBase}/${normalizedEndpoint}`);
  if (queryParams) {
    queryParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
};

// Wrapper around fetch to log API calls in dev mode (excludes Shopify by usage)
export const apiFetch = (input: RequestInfo | URL, init?: RequestInit, label?: string): Promise<Response> => {
  const urlString = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : (input as Request).url);
  if (isBrowser && isDevApiMode()) {
    const isOurApi = urlString.startsWith(DEV_BASE) || urlString.startsWith(PROD_BASE);
    if (isOurApi) {
      const method = init?.method || 'GET';
      console.log(`➡️ API CALL${label ? ` (${label})` : ''}: ${method} ${urlString}`);
      if (init?.body) {
        try {
          console.log('   payload:', typeof init.body === 'string' ? JSON.parse(init.body as string) : init.body);
        } catch {
          console.log('   payload:', init.body);
        }
      }
    }
  }
  return fetch(input as any, init as any);
};

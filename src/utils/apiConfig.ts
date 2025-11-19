// API configuration with URL param + localStorage-based mode switching (non-Shopify)
const PROD_BASE = 'https://recommender-api-973409790816.europe-west1.run.app';
const DEV_BASE = 'http://localhost:8080';
const STORAGE_KEY = 'ss_api_mode'; // 'sandbox-local' | 'sandbox' | 'prod' (legacy: 'dev')

// Dev mode flag - controls whether dev mode UI is visible
const DEV_MODE_KEY = 'ss_dev_mode'; // 'true' | 'false' - whether dev mode is enabled
const SANDBOX_HEADER_KEY = 'ss_sandbox_header'; // 'true' | 'false' - whether to send X-Sandbox header with prod API
const LOCAL_MODE_KEY = 'ss_local_mode'; // 'true' | 'false' - whether to use local API + X-Sandbox header
const MOCK_RECOMMENDATIONS_KEY = 'ss_mock_recommendations'; // 'true' | 'false' - whether to send X-Mock-Recommendations header (only for /recommend)

// Import tracking utilities for anon ID
import { getOrCreateAnonId } from './tracking';

type ApiMode = 'sandbox-local' | 'sandbox' | 'prod' | 'training';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// Initialize dev mode from URL parameter or console command
if (isBrowser) {
  // Check URL parameter ?dev=1
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('dev') === '1') {
    localStorage.setItem(DEV_MODE_KEY, 'true');
  }
  
  // Expose console command: dev=1
  (window as any).dev = (value: string | number) => {
    if (value === '1' || value === 1) {
      localStorage.setItem(DEV_MODE_KEY, 'true');
      console.log('✅ Dev mode enabled');
      window.location.reload();
    } else {
      localStorage.removeItem(DEV_MODE_KEY);
      console.log('❌ Dev mode disabled');
      window.location.reload();
    }
  };
}

function detectAndPersistModeFromQuery(): ApiMode | undefined {
  if (!isBrowser) return undefined;
  try {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'sandbox-local') {
      localStorage.setItem(STORAGE_KEY, 'sandbox-local');
      return 'sandbox-local';
    }
    if (mode === 'sandbox') {
      localStorage.setItem(STORAGE_KEY, 'sandbox');
      return 'sandbox';
    }
    if (mode === 'prod') {
      localStorage.setItem(STORAGE_KEY, 'prod');
      return 'prod';
    }
    if (mode === 'training') {
      localStorage.setItem(STORAGE_KEY, 'training');
      return 'training';
    }
  } catch (e) {
    // noop
  }
  return undefined;
}

function getPersistedMode(): ApiMode | undefined {
  if (!isBrowser) return undefined;
  const stored = localStorage.getItem(STORAGE_KEY);
  // Back-compat: treat legacy 'dev' as 'sandbox-local'
  if (stored === 'dev') return 'sandbox-local';
  if (stored === 'sandbox-local' || stored === 'sandbox' || stored === 'prod' || stored === 'training') return stored as ApiMode;
  return undefined;
}

export const getApiMode = (): ApiMode => {
  const queryMode = detectAndPersistModeFromQuery();
  const persistedMode = getPersistedMode();
  return queryMode ?? persistedMode ?? 'prod';
};

/**
 * Check if dev mode UI is enabled (flag that shows the dev mode indicator)
 */
export const isDevModeEnabled = (): boolean => {
  if (!isBrowser) return false;
  return localStorage.getItem(DEV_MODE_KEY) === 'true';
};

/**
 * Enable or disable dev mode UI
 */
export const setDevModeEnabled = (enabled: boolean): void => {
  if (!isBrowser) return;
  if (enabled) {
    localStorage.setItem(DEV_MODE_KEY, 'true');
  } else {
    localStorage.removeItem(DEV_MODE_KEY);
  }
};

/**
 * Check if sandbox header mode is enabled (dev sandbox mode)
 */
export const isSandboxHeaderEnabled = (): boolean => {
  if (!isBrowser) return false;
  return localStorage.getItem(SANDBOX_HEADER_KEY) === 'true';
};

/**
 * Enable sandbox header mode (dev sandbox)
 */
export const setSandboxHeader = (enabled: boolean): void => {
  if (!isBrowser) return;
  if (enabled) {
    localStorage.setItem(SANDBOX_HEADER_KEY, 'true');
    localStorage.removeItem(LOCAL_MODE_KEY);
  } else {
    localStorage.removeItem(SANDBOX_HEADER_KEY);
  }
};

/**
 * Check if local mode is enabled (dev local mode)
 */
export const isLocalModeEnabled = (): boolean => {
  if (!isBrowser) return false;
  return localStorage.getItem(LOCAL_MODE_KEY) === 'true';
};

/**
 * Enable local mode (dev local)
 */
export const setLocalMode = (enabled: boolean): void => {
  if (!isBrowser) return;
  if (enabled) {
    localStorage.setItem(LOCAL_MODE_KEY, 'true');
    localStorage.removeItem(SANDBOX_HEADER_KEY);
    localStorage.setItem(STORAGE_KEY, 'sandbox-local');
  } else {
    localStorage.removeItem(LOCAL_MODE_KEY);
  }
};

/**
 * Set prod mode (disable all dev modes)
 */
export const setProdMode = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem(SANDBOX_HEADER_KEY);
  localStorage.removeItem(LOCAL_MODE_KEY);
  localStorage.setItem(STORAGE_KEY, 'prod');
};

/**
 * Check if prod mode is active
 */
export const isProdMode = (): boolean => {
  return !isLocalModeEnabled() && !isSandboxHeaderEnabled();
};

/**
 * Check if mock recommendations is enabled
 */
export const isMockRecommendationsEnabled = (): boolean => {
  if (!isBrowser) return false;
  return localStorage.getItem(MOCK_RECOMMENDATIONS_KEY) === 'true';
};

/**
 * Enable or disable mock recommendations
 */
export const setMockRecommendations = (enabled: boolean): void => {
  if (!isBrowser) return;
  if (enabled) {
    localStorage.setItem(MOCK_RECOMMENDATIONS_KEY, 'true');
  } else {
    localStorage.removeItem(MOCK_RECOMMENDATIONS_KEY);
  }
};

export const getApiBaseUrl = (): string => {
  // If local mode is enabled, use local API
  if (isLocalModeEnabled()) {
    return DEV_BASE;
  }
  
  const mode = getApiMode();
  if (isBrowser) {
    if ((mode === 'sandbox-local' || mode === 'sandbox') && !(window as any).__ssModeLogShown) {
      const label = mode === 'sandbox-local' ? 'Sandbox LOCAL' : 'Sandbox CLOUD';
      console.log(`🧪 ${label} API mode enabled`);
      (window as any).__ssModeLogShown = true;
    }
    if (mode === 'training' && !(window as any).__ssModeLogShown) {
      console.log('🧪 TRAINING API mode enabled');
      (window as any).__ssModeLogShown = true;
    }
    // No mode log in prod
  }
  
  if (mode === 'training') {
    // Training mode uses the same base URL as sandbox-local
    return DEV_BASE;
  }
  const base = mode === 'sandbox-local' ? DEV_BASE : PROD_BASE;
  return base;
};

/**
 * Check if dev local mode is enabled (uses local API URL)
 */
export const isDevLocalMode = (): boolean => getApiMode() === 'sandbox-local';

/**
 * Check if dev sandbox mode is enabled (uses prod API URL)
 */
export const isDevSandboxMode = (): boolean => getApiMode() === 'sandbox';

/**
 * Check if any dev mode is enabled (Dev Local or Dev Sandbox, not Prod)
 * Dev modes: Dev Local (sandbox-local) and Dev Sandbox (sandbox)
 * Both use X-Sandbox header, just different URLs
 */
export const isAnyDevModeEnabled = (): boolean => {
  const m = getApiMode();
  return m === 'sandbox-local' || m === 'sandbox';
};

// Legacy compatibility - keep for backward compatibility
export const isSandboxLocalMode = (): boolean => isDevLocalMode();
export const isSandboxMode = (): boolean => isDevSandboxMode();

// Legacy compatibility - keep for backward compatibility
export const isAnySandboxMode = (): boolean => isAnyDevModeEnabled();

// Special function for /error endpoint that doesn't include /v3
export const getErrorApiUrl = (): string => {
  const mode = getApiMode();
  if (mode === 'training') {
    return 'http://localhost:8080';
  }
  return mode === 'sandbox-local' ? 'http://localhost:8080' : 'https://recommender-api-973409790816.europe-west1.run.app';
};

// Helper function to build full API URLs (only for recommender/feedback API)
export const buildApiUrl = (endpoint: string, queryParams?: URLSearchParams): string => {
  const baseUrl = getApiBaseUrl();
  // Ensure exactly one slash between base and endpoint (no /v3 path in new API)
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

// Helper function to get the current mode from URL parameters
export const getCurrentMode = (): string | null => {
  const mode = getApiMode();
  return mode === 'prod' ? null : mode;
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

// Helper function to get anon ID for API requests (always use ss_anon_id from localStorage)
export const getApiAnonId = (): string => {
  return getOrCreateAnonId();
};

// Helper function to get user ID for API requests (converts aid_xxx to uid_xxx)
export const getApiUserId = (): string => {
  const anonId = getOrCreateAnonId();
  // Convert aid_xxx to uid_xxx format required by new API
  if (anonId.startsWith('aid_')) {
    return anonId.replace('aid_', 'uid_');
  }
  // If already in uid_ format, return as-is
  if (anonId.startsWith('uid_')) {
    return anonId;
  }
  // Fallback: create new uid_ format
  return `uid_${anonId}`;
};

// Helper function to generate request ID using UUID4
export const generateRequestId = (): string => {
  // Generate a proper UUID4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Enhanced error type for API errors with metadata
export interface ApiError extends Error {
  apiMetadata?: {
    endpoint: string;
    method: string;
    status: number;
    duration_ms: number;
    response_text: string;
    request_id: string;
    retry_count: number;
  };
}

// Wrapper around fetch to log API calls in dev mode (excludes Shopify by usage)
export const apiFetch = (input: RequestInfo | URL, init?: RequestInit, label?: string): Promise<Response> => {
  const urlString = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : (input as Request).url);
  const isOurApi = urlString.startsWith(DEV_BASE) || urlString.startsWith(PROD_BASE);
  const devModeEnabled = isAnyDevModeEnabled();
  const shouldLog = isBrowser && devModeEnabled && isOurApi && /\/recommend(\b|\?|$)/.test(urlString);
  if (shouldLog) {
    const method = init?.method || 'GET';
    console.log(`➡️ API CALL${label ? ` (${label})` : ''}: ${method} ${urlString}`);
  }
  
  // Always inject required headers for our API calls
  if (isOurApi) {
    const headers = new Headers(init?.headers || {});
    const requestId = generateRequestId();
    headers.set('X-User-Id', getApiUserId());
    headers.set('X-Request-Id', requestId);
    
    // Inject X-Sandbox header for both dev modes (dev local and dev sandbox)
    // Both dev modes use the same header, just different URLs
    if (isSandboxHeaderEnabled() || isLocalModeEnabled()) {
      headers.set('X-Sandbox', 'true');
    }
    
    // Inject mock recommendations header for /recommend endpoint if enabled
    if (isMockRecommendationsEnabled() && /\/recommend(\b|\?|$)/.test(urlString)) {
      headers.set('X-Mock-Recommendations', 'true');
    }
    
    const startTime = Date.now();
    
    return fetch(input as any, { ...(init as any), headers } as any)
      .then(async res => {
        const duration = Date.now() - startTime;
        
        if (shouldLog) {
          console.log(res.ok ? '✅ /recommend success' : `❌ /recommend failed ${res.status}`);
        }
        
        // For non-OK responses, read response text and throw enriched error
        if (!res.ok) {
          let responseText = '';
          try {
            responseText = await res.text();
          } catch (e) {
            responseText = 'Failed to read response text';
          }
          
          const method = init?.method || 'GET';
          const endpoint = urlString.replace(DEV_BASE, '').replace(PROD_BASE, '') || '/';
          const requestIdFromHeader = res.headers.get('X-Request-Id') || requestId;
          
          const error = new Error(`API Error: ${res.status} ${res.statusText}`) as ApiError;
          error.apiMetadata = {
            endpoint,
            method,
            status: res.status,
            duration_ms: duration,
            response_text: responseText,
            request_id: requestIdFromHeader,
            retry_count: 0
          };
          
          throw error;
        }
        
        return res;
      })
      .catch(err => {
        const duration = Date.now() - startTime;
        
        if (shouldLog) {
          console.log(`❌ /recommend network error: ${err?.message || err}`);
        }
        
        // If it's already an ApiError with metadata, re-throw as-is
        if (err.apiMetadata) {
          throw err;
        }
        
        // For network errors, create ApiError with available metadata
        const method = init?.method || 'GET';
        const endpoint = urlString.replace(DEV_BASE, '').replace(PROD_BASE, '') || '/';
        
        const error = new Error(`Network Error: ${err?.message || 'Unknown network error'}`) as ApiError;
        error.apiMetadata = {
          endpoint,
          method,
          status: 0, // Network errors don't have HTTP status
          duration_ms: duration,
          response_text: err?.message || 'Network error',
          request_id: requestId,
          retry_count: 0
        };
        
        throw error;
      });
  }
  return fetch(input as any, init as any)
    .then(res => {
      if (shouldLog) {
        console.log(res.ok ? '✅ /recommend success' : `❌ /recommend failed ${res.status}`);
      }
      return res;
    })
    .catch(err => {
      if (shouldLog) {
        console.log(`❌ /recommend network error: ${err?.message || err}`);
      }
      throw err;
    });
};

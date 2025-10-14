// API configuration with URL param + localStorage-based mode switching (non-Shopify)
const PROD_BASE = 'https://catboost-recommender-api-973409790816.europe-west1.run.app/v3';
const DEV_BASE = 'http://localhost:8080/v3';
const STORAGE_KEY = 'ss_api_mode'; // 'sandbox-local' | 'sandbox' | 'prod' (legacy: 'dev')

// Import tracking utilities for anon ID
import { getOrCreateAnonId } from './tracking';

type ApiMode = 'sandbox-local' | 'sandbox' | 'prod' | 'training';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

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

export const getApiBaseUrl = (): string => {
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

export const isSandboxLocalMode = (): boolean => getApiMode() === 'sandbox-local';
export const isSandboxMode = (): boolean => getApiMode() === 'sandbox';
export const isAnySandboxMode = (): boolean => {
  const m = getApiMode();
  return m === 'sandbox-local' || m === 'sandbox';
};

// Special function for /error endpoint that doesn't include /v3
export const getErrorApiUrl = (): string => {
  const mode = getApiMode();
  if (mode === 'training') {
    return 'http://localhost:8080';
  }
  return mode === 'sandbox-local' ? 'http://localhost:8080' : 'https://catboost-recommender-api-973409790816.europe-west1.run.app';
};

// Helper function to build full API URLs (only for recommender/feedback API)
export const buildApiUrl = (endpoint: string, queryParams?: URLSearchParams): string => {
  const baseUrl = getApiBaseUrl();
  // Ensure exactly one slash between base and endpoint and preserve /v3 path
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
  const sandbox = isAnySandboxMode();
  const shouldLog = isBrowser && sandbox && isOurApi && /\/recommend(\b|\?|$)/.test(urlString);
  if (shouldLog) {
    const method = init?.method || 'GET';
    console.log(`➡️ API CALL${label ? ` (${label})` : ''}: ${method} ${urlString}`);
  }
  
  // Always inject required headers for our API calls
  if (isOurApi) {
    const headers = new Headers(init?.headers || {});
    const requestId = generateRequestId();
    headers.set('x-anon-id', getApiAnonId());
    headers.set('x-request-id', requestId);
    
    // Inject sandbox header for sandbox modes
    if (sandbox) {
      headers.set('X-Sandbox-Mode', 'true');
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

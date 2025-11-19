// User session tracking utility
import { getApiBaseUrl, isAnyDevModeEnabled, apiFetch } from './apiConfig';
import { logApiError } from './errorLogger';

// Base62 character set for ID generation
const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// Storage keys
const ANON_ID_KEY = 'ss_anon_id';
const SESSION_ID_KEY = 'ss_session_id';

// Generate a random Base62 string of specified length
function generateBase62(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += BASE62_CHARS.charAt(Math.floor(Math.random() * BASE62_CHARS.length));
  }
  return result;
}

// Check if anonymous ID exists without creating one
export function hasExistingAnonId(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const anonId = localStorage.getItem(ANON_ID_KEY);
    return anonId !== null && anonId !== '';
  } catch (error) {
    console.warn('Failed to check for existing anonymous ID:', error);
    return false;
  }
}

// Generate anonymous ID (persists across sessions)
export function getOrCreateAnonId(): string {
  if (typeof window === 'undefined') return '';
  
  try {
    let anonId = localStorage.getItem(ANON_ID_KEY);
    if (!anonId) {
      anonId = `aid_${generateBase62(4)}`;
      localStorage.setItem(ANON_ID_KEY, anonId);
    }
    return anonId;
  } catch (error) {
    console.warn('Failed to get/create anonymous ID:', error);
    return `aid_${generateBase62(4)}`;
  }
}

// Generate session ID (clears when tab closes)
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  try {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = `sid_${generateBase62(4)}`;
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  } catch (error) {
    console.warn('Failed to get/create session ID:', error);
    return `sid_${generateBase62(4)}`;
  }
}

// Track event types
export type TrackingEvent = 'visit_start' | 'visit_ping' | 'visit_shared_link';

// Global function to mark visit_start as sent (will be set by useTracking hook)
let markVisitStartSent: (() => void) | null = null;

export function setMarkVisitStartSentCallback(callback: () => void) {
  markVisitStartSent = callback;
}

// Track an event (fire-and-forget)
export async function trackEvent(event: TrackingEvent, clientOrigin?: string, recId?: string): Promise<void> {
  console.log('📡 trackEvent called:', { event, clientOrigin, recId });
  try {
    const anonId = getOrCreateAnonId();
    const sessionId = getOrCreateSessionId();
    console.log('📡 Using IDs:', { anonId, sessionId });
    
    const payload: any = {
      event,
      session_id: sessionId
    };

    // Add rec_id for visit_shared_link and visit_start events
    if ((event === 'visit_shared_link' || event === 'visit_start') && recId) {
      payload.rec_id = recId;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-anon-id': anonId,
      'x-request-id': 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      })
    };

    // Add client_origin as header if provided
    if (clientOrigin) {
      headers['client_origin'] = clientOrigin;
    }

    // Add X-Sandbox header for both dev modes (dev local and dev sandbox)
    // Both dev modes use the same header, just different URLs
    if (isAnyDevModeEnabled()) {
      headers['X-Sandbox'] = 'true';
    }

    console.log('📡 Sending to:', `${getApiBaseUrl()}/track`);
    console.log('📡 Payload:', payload);
    console.log('📡 Headers:', headers);
    
    const response = await apiFetch(`${getApiBaseUrl()}/track`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    
    console.log('📡 Response status:', response.status);

    // Don't throw on non-200 responses - fire-and-forget
    if (!response.ok) {
      console.warn(`Tracking event ${event} failed with status ${response.status}`);
      // Note: Toast notifications are handled at component level for better specificity
    } else if (event === 'visit_start' && markVisitStartSent) {
      // Mark that visit_start has been sent successfully
      markVisitStartSent();
    }
  } catch (error) {
    // Log API errors to /errors endpoint
    if (error.apiMetadata) {
      try {
        await logApiError(error, error.apiMetadata);
      } catch (logError) {
        console.error('Failed to log tracking error:', logError);
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(`Tracking event ${event} failed:`, error);
    }
    
    // Note: Toast notifications are handled at component level for better specificity
  }
}

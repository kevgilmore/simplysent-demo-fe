// User session tracking utility
import { getApiBaseUrl, isAnySandboxMode } from './apiConfig';

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
export type TrackingEvent = 'visit_start' | 'visit_ping';

// Track an event (fire-and-forget)
export async function trackEvent(event: TrackingEvent): Promise<void> {
  // Skip tracking in sandbox modes
  if (isAnySandboxMode()) {
    return;
  }

  try {
    const anonId = getOrCreateAnonId();
    const sessionId = getOrCreateSessionId();
    
    const payload = {
      event,
      anon_id: anonId,
      session_id: sessionId
    };

    const response = await fetch(`${getApiBaseUrl()}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // Don't throw on non-200 responses - fire-and-forget
    if (!response.ok) {
      console.warn(`Tracking event ${event} failed with status ${response.status}`);
    }
  } catch (error) {
    // Silent failure - don't log to avoid spam
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Tracking event ${event} failed:`, error);
    }
  }
}

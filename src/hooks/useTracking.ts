import { useEffect, useRef } from 'react';
import { trackEvent, getOrCreateAnonId, getOrCreateSessionId, hasExistingAnonId } from '../utils/tracking';

interface UseTrackingOptions {
  sendVisitStart?: boolean;
  pingInterval?: number; // in milliseconds
}

// Global tracking state to prevent multiple intervals
let globalInterval: NodeJS.Timeout | null = null;
let currentSessionId: string | null = null;

export function useTracking(options: UseTrackingOptions = {}) {
  const { sendVisitStart = false, pingInterval = 30000 } = options;

  useEffect(() => {
    // Initialize IDs
    getOrCreateAnonId();
    const sessionId = getOrCreateSessionId();

    // Send visit_start only if this is a new session (different session ID)
    if (sendVisitStart && currentSessionId !== sessionId) {
      // Determine client origin for tracking
      let clientOrigin: string | undefined;
      
      // Check URL params first
      const urlParams = new URLSearchParams(window.location.search);
      const originFromUrl = urlParams.get('client_origin');
      
      if (originFromUrl) {
        clientOrigin = originFromUrl;
      } else if (hasExistingAnonId()) {
        // User has visited before, set as returning visitor
        clientOrigin = 'visit_returning';
      }
      
      trackEvent('visit_start', clientOrigin);
      currentSessionId = sessionId;
    }

    // Clear any existing global interval
    if (globalInterval) {
      clearInterval(globalInterval);
    }

    // Set up new global ping interval
    globalInterval = setInterval(() => {
      trackEvent('visit_ping');
    }, pingInterval);

    // Cleanup: clear global interval when component unmounts
    return () => {
      if (globalInterval) {
        clearInterval(globalInterval);
        globalInterval = null;
      }
    };
  }, [sendVisitStart, pingInterval]);

  // Return tracking functions for manual use if needed
  return {
    trackEvent,
    getAnonId: getOrCreateAnonId,
    getSessionId: getOrCreateSessionId
  };
}

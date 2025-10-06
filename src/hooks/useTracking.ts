import { useEffect, useRef } from 'react';
import { trackEvent, getOrCreateAnonId, getOrCreateSessionId } from '../utils/tracking';

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
      trackEvent('visit_start');
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

import { useEffect, useRef } from 'react';
import { trackEvent, getOrCreateAnonId, getOrCreateSessionId, hasExistingAnonId, setMarkVisitStartSentCallback } from '../utils/tracking';

interface UseTrackingOptions {
  sendVisitStart?: boolean;
  pingInterval?: number; // in milliseconds
}

// Global tracking state to prevent multiple intervals
let globalInterval: NodeJS.Timeout | null = null;
let currentSessionId: string | null = null;
let visitStartSent: boolean = false;

export function useTracking(options: UseTrackingOptions = {}) {
  const { sendVisitStart = false, pingInterval = 30000 } = options;

  useEffect(() => {
    // Initialize IDs
    getOrCreateAnonId();
    const sessionId = getOrCreateSessionId();

    // Don't send visit_start automatically - it should be sent after /recommend
    // Just track the session ID for ping purposes
    if (currentSessionId !== sessionId) {
      currentSessionId = sessionId;
      visitStartSent = false; // Reset visit start flag for new session
    }

    // Clear any existing global interval
    if (globalInterval) {
      clearInterval(globalInterval);
    }

    // Set up new global ping interval - only start pinging after visit_start is sent
    globalInterval = setInterval(() => {
      if (visitStartSent) {
        trackEvent('visit_ping');
      }
    }, pingInterval);

    // Cleanup: clear global interval when component unmounts
    return () => {
      if (globalInterval) {
        clearInterval(globalInterval);
        globalInterval = null;
      }
    };
  }, [sendVisitStart, pingInterval]);

  // Function to mark that visit_start has been sent
  const markVisitStartSent = () => {
    visitStartSent = true;
  };

  // Register the callback with the tracking utility
  useEffect(() => {
    setMarkVisitStartSentCallback(markVisitStartSent);
  }, []);

  // Return tracking functions for manual use if needed
  return {
    trackEvent,
    getAnonId: getOrCreateAnonId,
    getSessionId: getOrCreateSessionId,
    markVisitStartSent
  };
}

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

    // Check if there are existing recommendations in localStorage
    const hasExistingRecommendations = () => {
      try {
        const history = localStorage.getItem('rec_history');
        if (history) {
          const parsed = JSON.parse(history);
          return Array.isArray(parsed) && parsed.length > 0;
        }
        return false;
      } catch (error) {
        return false;
      }
    };

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

    // Set up new global ping interval - start pinging if visit_start was sent OR if there are existing recommendations
    globalInterval = setInterval(() => {
      if (visitStartSent || hasExistingRecommendations()) {
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

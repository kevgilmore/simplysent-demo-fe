import { getErrorApiUrl, apiFetch } from './apiConfig';
import { getOrCreateAnonId } from './tracking';

interface ErrorLogData {
  endpoint: string;
  method: string;
  status?: number;
  error: string;
  url?: string;
  timestamp: string;
  userAgent: string;
  recommendation?: {
    recommendationId?: string;
    sessionId?: string;
  };
}

/**
 * Log API errors to the /error endpoint
 */
export const logApiError = async (errorData: Omit<ErrorLogData, 'timestamp' | 'userAgent'>) => {
  try {
    const errorPayload: ErrorLogData = {
      ...errorData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    console.log('📝 Logging API error to /error endpoint:', errorPayload);

    await apiFetch(`${getErrorApiUrl()}/error`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-anon-id': getOrCreateAnonId(),
        'x-request-id': 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        })
      },
      body: JSON.stringify(errorPayload)
    });

    console.log('✅ API error logged successfully');
  } catch (logError) {
    console.error('❌ Failed to log API error:', logError);
    // Don't throw - we don't want error logging to break the app
  }
};

/**
 * Log interaction endpoint errors
 */
export const logInteractionError = async (
  endpoint: string,
  method: string,
  error: string,
  status?: number,
  recommendationId?: string,
  sessionId?: string
) => {
  await logApiError({
    endpoint,
    method,
    status,
    error,
    url: window.location.href,
    recommendation: {
      recommendationId,
      sessionId
    }
  });
};

/**
 * Log tracking endpoint errors
 */
export const logTrackingError = async (
  endpoint: string,
  method: string,
  error: string,
  status?: number,
  recommendationId?: string,
  sessionId?: string
) => {
  await logApiError({
    endpoint,
    method,
    status,
    error,
    url: window.location.href,
    recommendation: {
      recommendationId,
      sessionId
    }
  });
};

/**
 * Log recommend endpoint errors
 */
export const logRecommendError = async (
  endpoint: string,
  method: string,
  error: string,
  status?: number,
  sessionId?: string
) => {
  await logApiError({
    endpoint,
    method,
    status,
    error,
    url: window.location.href,
    recommendation: {
      sessionId
    }
  });
};

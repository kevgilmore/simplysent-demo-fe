import { getErrorApiUrl, apiFetch, ApiError } from './apiConfig';
import { getOrCreateAnonId, getOrCreateSessionId } from './tracking';

interface ErrorLogData {
  anon_id: string;
  session_id: string;
  error_type: "ApiError" | "ReactError" | "NotFound";
  message: string;
  componentStack?: string;
  stack?: string;
  page: string;
  api?: {
    endpoint: string;
    method: string;
    status: number;
    duration_ms: number;
    response_text: string;
    request_id: string;
    retry_count: number;
  };
  userAgent: string;
}

/**
 * Log errors to the /errors endpoint
 */
export const logError = async (errorData: Omit<ErrorLogData, 'userAgent'>) => {
  try {
    const errorPayload: ErrorLogData = {
      ...errorData,
      userAgent: navigator.userAgent
    };

    console.log('📝 Logging error to /errors endpoint:', errorPayload);

    await apiFetch(`${getErrorApiUrl()}/errors`, {
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

    console.log('✅ Error logged successfully');
  } catch (logError) {
    console.error('❌ Failed to log error:', logError);
    // Don't throw - we don't want error logging to break the app
  }
};

/**
 * Log API errors with metadata
 */
export const logApiError = async (
  error: Error | string,
  apiMetadata?: {
    endpoint: string;
    method: string;
    status: number;
    duration_ms: number;
    response_text: string;
    request_id: string;
    retry_count: number;
  },
  page?: string
) => {
  const message = typeof error === 'string' ? error : error.message;
  const stack = typeof error === 'string' ? undefined : error.stack;
  
  await logError({
    anon_id: getOrCreateAnonId(),
    session_id: getOrCreateSessionId(),
    error_type: "ApiError",
    message,
    stack,
    page: page || window.location.href,
    api: apiMetadata || undefined,
    userAgent: navigator.userAgent
  });
};

/**
 * Log React component errors
 */
export const logReactError = async (
  error: Error,
  componentStack?: string,
  page?: string
) => {
  await logError({
    anon_id: getOrCreateAnonId(),
    session_id: getOrCreateSessionId(),
    error_type: "ReactError",
    message: error.message,
    componentStack,
    stack: error.stack,
    page: page || window.location.href,
    userAgent: navigator.userAgent
  });
};

/**
 * Log NotFound errors (business logic - no results found)
 */
export const logNotFoundError = async (
  message: string,
  page?: string
) => {
  await logError({
    anon_id: getOrCreateAnonId(),
    session_id: getOrCreateSessionId(),
    error_type: "NotFound",
    message,
    page: page || window.location.href,
    userAgent: navigator.userAgent
  });
};

/**
 * Log interaction endpoint errors (legacy function for backward compatibility)
 */
export const logInteractionError = async (
  endpoint: string,
  method: string,
  error: string,
  status?: number,
  recommendationId?: string,
  sessionId?: string
) => {
  await logApiError(error, {
    endpoint,
    method,
    status: status || 0,
    duration_ms: 0,
    response_text: error,
    request_id: 'unknown',
    retry_count: 0
  });
};

/**
 * Log tracking endpoint errors (legacy function for backward compatibility)
 */
export const logTrackingError = async (
  endpoint: string,
  method: string,
  error: string,
  status?: number,
  recommendationId?: string,
  sessionId?: string
) => {
  await logApiError(error, {
    endpoint,
    method,
    status: status || 0,
    duration_ms: 0,
    response_text: error,
    request_id: 'unknown',
    retry_count: 0
  });
};

/**
 * Log recommend endpoint errors (legacy function for backward compatibility)
 */
export const logRecommendError = async (
  endpoint: string,
  method: string,
  error: string,
  status?: number,
  sessionId?: string
) => {
  await logApiError(error, {
    endpoint,
    method,
    status: status || 0,
    duration_ms: 0,
    response_text: error,
    request_id: 'unknown',
    retry_count: 0
  });
};

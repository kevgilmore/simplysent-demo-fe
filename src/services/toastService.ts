// Toast service for showing notifications from non-React contexts
let toastFunctions: {
  showError: (title: string, message: string, duration?: number) => void;
} | null = null;

export const setToastFunctions = (functions: {
  showError: (title: string, message: string, duration?: number) => void;
}) => {
  toastFunctions = functions;
};

export const showApiError = (endpoint: string, error: string, status?: number) => {
  if (toastFunctions) {
    const title = `API Error: ${endpoint}`;
    const message = status ? `Status ${status}: ${error}` : error;
    toastFunctions.showError(title, message, 8000); // Show for 8 seconds
  }
};

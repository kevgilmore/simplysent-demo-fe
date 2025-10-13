interface SavedRecommendation {
  id: string;
  relationship: string;
  occasion: string;
  timestamp: number;
  formData: any;
  recommendations?: any[];
  genieTrainingState?: {
    productFeedback: Record<number, 'up' | 'down' | null>;
    recommendationRating: number;
    hasSubmittedComment?: boolean;
  };
}

const HISTORY_KEY = 'rec_history';
const MAX_HISTORY_ITEMS = 5;

/**
 * Save a recommendation to localStorage history
 * @param recommendationId - The unique ID of the recommendation
 * @param formData - The form data used to generate the recommendation
 * @param recommendations - Optional full recommendation data with products
 * @param genieTrainingState - Optional genie training state (product feedback and rating)
 */
export const saveRecommendation = (
  recommendationId: string,
  formData: any,
  recommendations?: any[],
  genieTrainingState?: {
    productFeedback: Record<number, 'up' | 'down' | null>;
    recommendationRating: number;
    hasSubmittedComment?: boolean;
  }
): void => {
  try {
    const history = getRecommendationHistory();
    
    // Create new recommendation entry
    const newRecommendation: SavedRecommendation = {
      id: recommendationId,
      relationship: formData.relationship,
      occasion: formData.occasion,
      timestamp: Date.now(),
      formData,
      recommendations,
      genieTrainingState
    };
    
    // Add to beginning of array (most recent first)
    history.unshift(newRecommendation);
    
    // Keep only the most recent 5 items
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    // Save back to localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    
    console.log('Saved recommendation to history:', newRecommendation);
  } catch (error) {
    console.error('Error saving recommendation to history:', error);
  }
};

/**
 * Get all saved recommendations from localStorage
 * @returns Array of saved recommendations, most recent first
 */
export const getRecommendationHistory = (): SavedRecommendation[] => {
  try {
    const historyStr = localStorage.getItem(HISTORY_KEY);
    if (!historyStr) {
      return [];
    }
    
    const history = JSON.parse(historyStr);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('Error getting recommendation history:', error);
    return [];
  }
};

/**
 * Clear all recommendation history
 */
export const clearRecommendationHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    console.log('Cleared recommendation history');
  } catch (error) {
    console.error('Error clearing recommendation history:', error);
  }
};

/**
 * Format timestamp for display
 * @param timestamp - Unix timestamp
 * @returns Formatted date string
 */
export const formatRecommendationDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffHours < 1) {
    return 'Just now';
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    // Show month and day for older items
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

/**
 * Check if full recommendation data exists in localStorage
 * @param recommendationId - The recommendation ID to check
 * @returns True if full data exists
 */
export const hasFullRecommendationData = (recommendationId: string): boolean => {
  try {
    const fullData = localStorage.getItem(`recommendation_${recommendationId}`);
    if (!fullData) return false;
    
    const parsed = JSON.parse(fullData);
    return parsed && parsed.recommendations && Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0;
  } catch (error) {
    console.error('Error checking full recommendation data:', error);
    return false;
  }
};

/**
 * Get full recommendation data from localStorage
 * @param recommendationId - The recommendation ID
 * @returns Full recommendation data or null
 */
export const getFullRecommendationData = (recommendationId: string): any => {
  try {
    const fullData = localStorage.getItem(`recommendation_${recommendationId}`);
    if (!fullData) return null;
    
    return JSON.parse(fullData);
  } catch (error) {
    console.error('Error getting full recommendation data:', error);
    return null;
  }
};

/**
 * Update genie training state for a recommendation in history
 * @param recommendationId - The recommendation ID
 * @param genieTrainingState - The genie training state to save (includes hasSubmittedComment)
 */
export const updateGenieTrainingState = (
  recommendationId: string,
  genieTrainingState: {
    productFeedback: Record<number, 'up' | 'down' | null>;
    recommendationRating: number;
    hasSubmittedComment?: boolean;
  }
): void => {
  try {
    const history = getRecommendationHistory();
    const updatedHistory = history.map(rec => {
      if (rec.id === recommendationId) {
        return {
          ...rec,
          genieTrainingState
        };
      }
      return rec;
    });
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    console.log('Updated genie training state for recommendation:', recommendationId);
  } catch (error) {
    console.error('Error updating genie training state:', error);
  }
};

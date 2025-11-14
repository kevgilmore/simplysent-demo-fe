/**
 * SimplySent Brand Colors
 *
 * This file defines the official brand colors used throughout the SimplySent application.
 * All colors are also configured in tailwind.config.js for Tailwind CSS utility classes.
 */

export const colors = {
  /**
   * Primary Brand Colors
   */
  simplysent: {
    // Main brand purple - matches results page (#5f59a6)
    purple: '#5f59a6',

    // Light variant for hover states and backgrounds
    purpleLight: '#7a75ba',

    // Dark variant for active states and emphasis
    purpleDark: '#4a4582',

    // Alternative purple for backgrounds and sections
    purpleAlt: '#d1ccfb',
  },

  /**
   * Secondary Colors
   */
  accent: {
    pink: {
      primary: '#ec4899',
      light: '#f9a8d4',
      dark: '#be185d',
    },
    green: {
      success: '#10b981',
      light: '#6ee7b7',
      dark: '#059669',
    },
    yellow: {
      amazon: '#FFA500',
      light: '#FBBF24',
      dark: '#F59E0B',
    },
  },

  /**
   * Utility Colors
   */
  utility: {
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    success: '#10b981',
  },
} as const;

/**
 * Usage Guidelines:
 *
 * 1. In Tailwind CSS classes:
 *    - Use `text-simplysent-purple` for text
 *    - Use `bg-simplysent-purple` for backgrounds
 *    - Use `border-simplysent-purple` for borders
 *    - Use opacity modifier: `bg-simplysent-purple/20` for 20% opacity
 *
 * 2. In inline styles or CSS-in-JS:
 *    import { colors } from '@/theme/colors';
 *    style={{ color: colors.simplysent.purple }}
 *
 * 3. For gradients:
 *    - Primary gradient: `from-simplysent-purple to-pink-600`
 *    - Background: `from-simplysent-purple/10 to-pink-50`
 *
 * Examples:
 * - Buttons: bg-simplysent-purple text-white
 * - Badges: bg-simplysent-purple/20 text-simplysent-purple
 * - Borders: border-2 border-simplysent-purple/30
 * - Hover: hover:bg-simplysent-purple-light
 * - Active: active:bg-simplysent-purple-dark
 */

export type SimplySentColors = typeof colors;

export default colors;

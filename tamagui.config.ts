import { createTamagui } from '@tamagui/core'
import { config } from '@tamagui/config/v3'

const tamaguiConfig = createTamagui({
  ...config,
  tokens: {
    ...config.tokens,
    color: {
      ...config.tokens.color,
      // Purple theme colors
      purple1: '#faf5ff',
      purple2: '#f3e8ff',
      purple3: '#e9d5ff',
      purple4: '#ddd6fe',
      purple5: '#c4b5fd',
      purple6: '#a78bfa',
      purple7: '#9333ea',
      purple8: '#7c3aed',
      purple9: '#6d28d9',
      purple10: '#5b21b6',
      purple11: '#4c1d95',
      purple12: '#2e1065',
      
      // Glass effect colors
      glass: 'rgba(255, 255, 255, 0.1)',
      glassDark: 'rgba(0, 0, 0, 0.1)',
      glassPurple: 'rgba(147, 51, 234, 0.1)',
    },
    radius: {
      ...config.tokens.radius,
      // More rounded corners for modern look
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      xxl: 24,
      full: 9999,
    },
    space: {
      ...config.tokens.space,
      // Consistent spacing
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
  },
  themes: {
    ...config.themes,
    purple: {
      ...config.themes.light,
      background: '#faf5ff',
      backgroundHover: '#f3e8ff',
      backgroundPress: '#e9d5ff',
      backgroundFocus: '#ddd6fe',
      color: '#4c1d95',
      colorHover: '#5b21b6',
      colorPress: '#6d28d9',
      colorFocus: '#7c3aed',
      borderColor: '#c4b5fd',
      borderColorHover: '#a78bfa',
      borderColorPress: '#9333ea',
      borderColorFocus: '#7c3aed',
      placeholderColor: '#a78bfa',
    },
    purpleDark: {
      ...config.themes.dark,
      background: '#2e1065',
      backgroundHover: '#4c1d95',
      backgroundPress: '#5b21b6',
      backgroundFocus: '#6d28d9',
      color: '#faf5ff',
      colorHover: '#f3e8ff',
      colorPress: '#e9d5ff',
      colorFocus: '#ddd6fe',
      borderColor: '#7c3aed',
      borderColorHover: '#9333ea',
      borderColorPress: '#a78bfa',
      borderColorFocus: '#c4b5fd',
      placeholderColor: '#a78bfa',
    },
  },
  media: {
    ...config.media,
    // Responsive breakpoints
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
  animations: {
    ...config.animations,
    // Smooth animations
    smooth: {
      type: 'spring',
      damping: 20,
      mass: 1.2,
      stiffness: 250,
    },
    bouncy: {
      type: 'spring',
      damping: 10,
      mass: 0.9,
      stiffness: 200,
    },
    lazy: {
      type: 'spring',
      damping: 20,
      mass: 1,
      stiffness: 60,
    },
  },
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

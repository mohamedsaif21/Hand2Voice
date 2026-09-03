import { Platform } from 'react-native';

export const PALETTE = {
  // Brand
  primary: '#0284C7',        // Vibrant Azure / Sky 600
  primaryLight: '#38BDF8',   // Sky 400
  primaryDark: '#0369A1',    // Sky 700
  accent: '#6366F1',         // Indigo 500
  accentCyan: '#06B6D4',     // Cyan 500
  accentPurple: '#8B5CF6',   // Violet 500
  
  // Status
  success: '#10B981',        // Emerald 500
  successBg: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B',        // Amber 500
  warningBg: 'rgba(245, 158, 11, 0.12)',
  danger: '#EF4444',         // Rose 500
  dangerBg: 'rgba(239, 68, 68, 0.12)',
  info: '#3B82F6',           // Blue 500

  // Neutrals - Light
  light: {
    background: '#F8FAFC',    // Slate 50
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9', // Slate 100
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    border: '#E2E8F0',        // Slate 200
    borderSubtle: '#F1F5F9',
    textPrimary: '#0F172A',   // Slate 900
    textSecondary: '#475569', // Slate 600
    textTertiary: '#94A3B8',  // Slate 400
    icon: '#475569',
    navBg: '#FFFFFF',
    divider: '#E2E8F0',
    inputBg: '#F8FAFC',
    inputBorder: '#CBD5E1',
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
  },

  // Neutrals - Dark (Ultra-modern Deep Obsidian / Midnight Slate)
  dark: {
    background: '#0B0F17',    // Deep obsidian
    surface: '#111827',       // Gray 900
    surfaceSubtle: '#1E293B', // Slate 800
    card: '#131C2E',          // High-tech deep blue-gray
    cardElevated: '#1E293B',
    border: '#1E293B',
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#F8FAFC',   // Slate 50
    textSecondary: '#94A3B8', // Slate 400
    textTertiary: '#64748B',  // Slate 500
    icon: '#94A3B8',
    navBg: '#0F172A',
    divider: '#1E293B',
    inputBg: '#131C2E',
    inputBorder: '#1E293B',
    badgeBg: 'rgba(14, 165, 233, 0.16)',
    badgeText: '#38BDF8',
  }
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  full: 9999,
};

export const SHADOWS = {
  sm: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
    web: {
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
    } as any,
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
    },
    android: { elevation: 4 },
    web: {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
    } as any,
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#0284C7',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 18,
    },
    android: { elevation: 8 },
    web: {
      boxShadow: '0 10px 25px -3px rgba(2, 132, 199, 0.15), 0 4px 6px -4px rgba(2, 132, 199, 0.1)',
    } as any,
  }),
  glow: Platform.select({
    ios: {
      shadowColor: '#0EA5E9',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    web: {
      boxShadow: '0 0 20px rgba(14, 165, 233, 0.35)',
    } as any,
  }),
};

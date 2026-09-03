import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { PALETTE, RADIUS, SHADOWS } from '../theme';

export type NavTab = 'home' | 'learn' | 'history' | 'profile' | 'settings';

interface AppBottomNavProps {
  currentTab: NavTab;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({ currentTab }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  const tabs: { key: NavTab; label: string; icon: keyof typeof Ionicons.glyphMap; route: any }[] = [
    {
      key: 'home',
      label: 'Translate',
      icon: 'sparkles',
      route: '/prototype/translation Mode',
    },
    {
      key: 'learn',
      label: 'Learn',
      icon: 'school-outline',
      route: '/prototype/signdetails',
    },
    {
      key: 'history',
      label: 'History',
      icon: 'time-outline',
      route: '/prototype/history',
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: 'person-outline',
      route: '/prototype/profile',
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: 'settings-outline',
      route: '/prototype/settings',
    },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.navBg, borderTopColor: theme.borderSubtle }]}>
      <View style={styles.navRow}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                isActive && [
                  styles.activeTabItem,
                  { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.16)' : 'rgba(2, 132, 199, 0.1)' },
                ],
              ]}
              onPress={() => {
                if (!isActive) {
                  router.push(tab.route);
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  isActive
                    ? (tab.icon.replace('-outline', '') as any)
                    : tab.icon
                }
                size={22}
                color={isActive ? PALETTE.primary : theme.textTertiary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? PALETTE.primary : theme.textTertiary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    ...SHADOWS.sm,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: RADIUS.md,
    marginHorizontal: 2,
    gap: 3,
  },
  activeTabItem: {
    borderRadius: RADIUS.md,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: -0.2,
  },
});

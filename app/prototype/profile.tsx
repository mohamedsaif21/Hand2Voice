import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { AppBottomNav } from '../components/AppBottomNav';
import { PALETTE, RADIUS, SHADOWS } from '../theme';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>User Profile</Text>
          <Text style={[styles.headerSub, { color: theme.textTertiary }]}>Preferences & Analytics</Text>
        </View>

        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
          onPress={() => router.push('/prototype/settings')}
        >
          <Ionicons name="settings-outline" size={20} color={PALETTE.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Hero Section */}
        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/images/Hand2Voice.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={[styles.verifiedDot, { backgroundColor: '#10B981' }]}>
              <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: theme.textPrimary }]}>Hand2Voice Champion</Text>
            <Text style={[styles.userEmail, { color: theme.textTertiary }]}>hand2voice.team@gmail.com</Text>

            <View style={[styles.memberBadge, { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.12)' : '#E0F2FE' }]}>
              <MaterialCommunityIcons name="shield-check" size={14} color={PALETTE.primary} />
              <Text style={[styles.memberBadgeText, { color: PALETTE.primary }]}>Active ISL Communicator</Text>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={[styles.statsRow, { borderTopColor: theme.borderSubtle }]}>
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: theme.textPrimary }]}>128</Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Signs Learned</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.borderSubtle }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: '#10B981' }]}>42</Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Conversations</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.borderSubtle }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: '#F59E0B' }]}>3 Days</Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Practice Streak</Text>
            </View>
          </View>
        </View>

        {/* AR Wearables Device Quick Tile */}
        <TouchableOpacity
          style={[styles.deviceCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}
          onPress={() => router.push('/prototype/ConnectDevices')}
          activeOpacity={0.8}
        >
          <View style={[styles.deviceIconBox, { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.12)' : '#E0F2FE' }]}>
            <Ionicons name="glasses-outline" size={24} color={PALETTE.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.deviceRowTop}>
              <Text style={[styles.deviceTitle, { color: theme.textPrimary }]}>VisionPro AR Glasses</Text>
              <View style={[styles.statusTag, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Text style={[styles.statusTagText, { color: '#10B981' }]}>Ready</Text>
              </View>
            </View>
            <Text style={[styles.deviceSub, { color: theme.textTertiary }]}>Low-latency HUD captions paired</Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
        </TouchableOpacity>

        {/* Translation History Quick Link */}
        <TouchableOpacity
          style={[styles.actionRowCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}
          onPress={() => router.push('/prototype/history')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.12)' }]}>
            <Ionicons name="time" size={20} color="#8B5CF6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { color: theme.textPrimary }]}>View Translation History</Text>
            <Text style={[styles.actionSub, { color: theme.textTertiary }]}>Review past audio and signs</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
        </TouchableOpacity>

        {/* Preferences Section */}
        <View style={[styles.prefCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <Text style={[styles.prefSectionHeader, { color: theme.textSecondary }]}>Accessibility & Settings</Text>

          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <Ionicons name="notifications-outline" size={20} color={theme.textPrimary} />
              <View>
                <Text style={[styles.prefTitle, { color: theme.textPrimary }]}>Practice Reminders</Text>
                <Text style={[styles.prefSub, { color: theme.textTertiary }]}>Daily ISL gesture learning alerts</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#334155', true: PALETTE.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.prefDivider, { backgroundColor: theme.borderSubtle }]} />

          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <Ionicons name="phone-portrait-outline" size={20} color={theme.textPrimary} />
              <View>
                <Text style={[styles.prefTitle, { color: theme.textPrimary }]}>Haptic Tactile Feedback</Text>
                <Text style={[styles.prefSub, { color: theme.textTertiary }]}>Vibrate on confirmed sign recognition</Text>
              </View>
            </View>
            <Switch
              value={haptics}
              onValueChange={setHaptics}
              trackColor={{ false: '#334155', true: PALETTE.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.prefDivider, { backgroundColor: theme.borderSubtle }]} />

          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <Ionicons name="contrast-outline" size={20} color={theme.textPrimary} />
              <View>
                <Text style={[styles.prefTitle, { color: theme.textPrimary }]}>High Contrast Colors</Text>
                <Text style={[styles.prefSub, { color: theme.textTertiary }]}>Enhanced visual edges for visibility</Text>
              </View>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: '#334155', true: PALETTE.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Logout / Switch Account Button */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: theme.border }]}
          onPress={() => router.push('/prototype/login')}
        >
          <Ionicons name="log-out-outline" size={18} color={PALETTE.danger} style={{ marginRight: 6 }} />
          <Text style={[styles.logoutBtnText, { color: PALETTE.danger }]}>Sign Out / Switch Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <AppBottomNav currentTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  headerSub: { fontSize: 11, fontWeight: '600' },
  scrollContent: { padding: 16, paddingBottom: 32, gap: 16 },
  profileCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  verifiedDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    gap: 4,
  },
  userName: { fontSize: 20, fontWeight: '800' },
  userEmail: { fontSize: 13 },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginTop: 6,
  },
  memberBadgeText: { fontSize: 12, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  statCol: { alignItems: 'center', gap: 2 },
  statVal: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600' },
  statDivider: { width: 1, height: 28 },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: 12,
  },
  deviceIconBox: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceRowTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deviceTitle: { fontSize: 15, fontWeight: '700' },
  statusTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm },
  statusTagText: { fontSize: 11, fontWeight: '700' },
  deviceSub: { fontSize: 12, marginTop: 2 },
  actionRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: 12,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: { fontSize: 15, fontWeight: '700' },
  actionSub: { fontSize: 12, marginTop: 2 },
  prefCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  prefSectionHeader: { fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prefLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 8 },
  prefTitle: { fontSize: 14, fontWeight: '600' },
  prefSub: { fontSize: 12, marginTop: 2 },
  prefDivider: { height: 1, width: '100%' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  logoutBtnText: { fontSize: 14, fontWeight: '700' },
});
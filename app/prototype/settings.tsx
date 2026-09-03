import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  const [offlineMode, setOfflineMode] = useState(true);
  const [hudSubtitles, setHudSubtitles] = useState(true);
  const [autoSpeakWords, setAutoSpeakWords] = useState(false);
  const [textSize, setTextSize] = useState<'Standard' | 'Large'>('Standard');

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'Local temporary video and speech cache cleared successfully.');
  };

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
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Settings</Text>
          <Text style={[styles.headerSub, { color: theme.textTertiary }]}>System & AI Configuration</Text>
        </View>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: AI & Gesture Vision */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>AI & GESTURE RECOGNITION</Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="speedometer-outline" size={20} color={PALETTE.primary} />
                <View>
                  <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Detection Polling Rate</Text>
                  <Text style={[styles.rowSub, { color: theme.textTertiary }]}>Continuous frame frequency</Text>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                <Text style={[styles.badgeText, { color: PALETTE.primary }]}>900 ms</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
                <View>
                  <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Confidence Threshold</Text>
                  <Text style={[styles.rowSub, { color: theme.textTertiary }]}>Filter inaccurate predictions</Text>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                <Text style={[styles.badgeText, { color: '#10B981' }]}>65% Min</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="cloud-offline-outline" size={20} color="#8B5CF6" />
                <View>
                  <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>On-Device Model Caching</Text>
                  <Text style={[styles.rowSub, { color: theme.textTertiary }]}>Fast execution without network</Text>
                </View>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: '#334155', true: PALETTE.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Section 2: Speech & Voice Output */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>SPEECH & AUDIO OUTPUT</Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="volume-high-outline" size={20} color={PALETTE.primary} />
                <View>
                  <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Auto-Speak Detected Words</Text>
                  <Text style={[styles.rowSub, { color: theme.textTertiary }]}>Pronounce signs immediately upon recognition</Text>
                </View>
              </View>
              <Switch
                value={autoSpeakWords}
                onValueChange={setAutoSpeakWords}
                trackColor={{ false: '#334155', true: PALETTE.primary }}
                thumbColor="#fff"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

            <TouchableOpacity
              style={styles.row}
              onPress={() => setTextSize(textSize === 'Standard' ? 'Large' : 'Standard')}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="text-outline" size={20} color={theme.textPrimary} />
                <View>
                  <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Display Text Size</Text>
                  <Text style={[styles.rowSub, { color: theme.textTertiary }]}>Adjust subtitle and sentence scale</Text>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                <Text style={[styles.badgeText, { color: theme.textPrimary }]}>{textSize}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 3: Hardware & AR Wearables */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>HARDWARE & WEARABLES</Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push('/prototype/ConnectDevices')}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="glasses-outline" size={20} color={PALETTE.primary} />
                <View>
                  <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Smart AR Glasses Setup</Text>
                  <Text style={[styles.rowSub, { color: theme.textTertiary }]}>Manage bluetooth and heads-up display</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="tv-outline" size={20} color="#10B981" />
                <View>
                  <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Live HUD Subtitles</Text>
                  <Text style={[styles.rowSub, { color: theme.textTertiary }]}>Stream signs to wearable display</Text>
                </View>
              </View>
              <Switch
                value={hudSubtitles}
                onValueChange={setHudSubtitles}
                trackColor={{ false: '#334155', true: PALETTE.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Section 4: Privacy & Maintenance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PRIVACY & STORAGE</Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="lock-closed-outline" size={20} color="#10B981" />
                <View>
                  <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Frame Privacy Guard</Text>
                  <Text style={[styles.rowSub, { color: theme.textTertiary }]}>Camera frames are never stored or logged</Text>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Text style={[styles.badgeText, { color: '#10B981' }]}>Active</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

            <TouchableOpacity style={styles.row} onPress={handleClearCache}>
              <View style={styles.rowLeft}>
                <Ionicons name="trash-bin-outline" size={20} color={PALETTE.danger} />
                <View>
                  <Text style={[styles.rowTitle, { color: PALETTE.danger }]}>Clear Temporary Cache</Text>
                  <Text style={[styles.rowSub, { color: theme.textTertiary }]}>Free up video and audio disk memory</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About App Badge */}
        <View style={styles.aboutFooter}>
          <MaterialCommunityIcons name="sign-language" size={32} color={PALETTE.primary} />
          <Text style={[styles.aboutTitle, { color: theme.textPrimary }]}>Hand2Voice • SignLink AI</Text>
          <Text style={[styles.aboutVersion, { color: theme.textTertiary }]}>Version 2.0.0 (Production Release)</Text>
          <Text style={[styles.aboutCopyright, { color: theme.textTertiary }]}>
            Bridging Indian Sign Language for inclusivity worldwide
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <AppBottomNav currentTab="settings" />
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
  scrollContent: { padding: 16, paddingBottom: 32, gap: 20 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  rowTitle: { fontSize: 14, fontWeight: '600' },
  rowSub: { fontSize: 12, marginTop: 2 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  divider: { height: 1, width: '100%' },
  aboutFooter: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  aboutTitle: { fontSize: 15, fontWeight: '800' },
  aboutVersion: { fontSize: 12 },
  aboutCopyright: { fontSize: 11, textAlign: 'center', maxWidth: 280 },
});
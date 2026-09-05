import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBottomNav } from '../components/AppBottomNav';
import { PALETTE, RADIUS, SHADOWS } from '../theme';

export default function TranslationModeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greetingSub, { color: theme.textSecondary }]}>Hello, Communicator 👋</Text>
          <Text style={[styles.greetingTitle, { color: theme.textPrimary }]}>Translation Hub</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
            onPress={() => router.push('/prototype/ConnectDevices')}
          >
            <Ionicons name="glasses-outline" size={20} color={PALETTE.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
            onPress={() => router.push('/prototype/profile')}
          >
            <Ionicons name="person-circle-outline" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Daily Streak & Status Banner */}
        <View style={[styles.streakBanner, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <View style={styles.streakLeft}>
            <View style={styles.streakBadgeRow}>
              <View style={[styles.liveDot, { backgroundColor: PALETTE.success }]} />
              <Text style={[styles.statusText, { color: PALETTE.success }]}>AI CORE ONLINE</Text>
            </View>
            <Text style={[styles.streakTitle, { color: theme.textPrimary }]}>Daily Sign Practice</Text>
            <Text style={[styles.streakSubtitle, { color: theme.textTertiary }]}>15 of 20 signs reviewed today</Text>

            {/* Progress Bar */}
            <View style={[styles.progressTrack, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
              <View style={[styles.progressBar, { width: '75%', backgroundColor: PALETTE.primary }]} />
            </View>
          </View>

          <View style={[styles.streakFireBox, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
            <Text style={{ fontSize: 24 }}>🔥</Text>
            <Text style={styles.streakDays}>3</Text>
            <Text style={styles.streakLabel}>Days</Text>
          </View>
        </View>

        {/* Quick Access Utility Pills */}
        <View style={styles.quickAccessRow}>
          <TouchableOpacity
            style={[styles.quickPill, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/prototype/alphabet')}
          >
            <Ionicons name="apps" size={16} color={PALETTE.primary} />
            <Text numberOfLines={1} style={[styles.quickPillText, { color: theme.textPrimary }]}>A-Z Alphabet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickPill, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/prototype/history')}
          >
            <Ionicons name="time" size={16} color="#8B5CF6" />
            <Text numberOfLines={1} style={[styles.quickPillText, { color: theme.textPrimary }]}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickPill, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/prototype/ConnectDevices')}
          >
            <Ionicons name="bluetooth" size={16} color="#10B981" />
            <Text numberOfLines={1} style={[styles.quickPillText, { color: theme.textPrimary }]}>AR Glasses</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Translation Modes</Text>

        {/* Card 1: Sign to Text (Camera AI) */}
        <View style={[styles.modeCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.md]}>
          <View style={styles.imageBox}>
            <ImageBackground
              source={require('../../assets/images/Sign to Text.jpg')}
              style={styles.cardImg}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(11, 15, 23, 0.85)']}
                style={styles.gradientOverlay}
              />
              <View style={styles.cardOverlayHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: PALETTE.primary }]}>
                  <Ionicons name="videocam" size={12} color="#fff" style={{ marginRight: 4 }} />
                  <Text style={styles.categoryBadgeText}>VISION AI • 900MS</Text>
                </View>
                <View style={styles.liveIndicator}>
                  <View style={[styles.pulsingDot, { backgroundColor: '#22c55e' }]} />
                  <Text style={styles.liveText}>READY</Text>
                </View>
              </View>

              <View style={styles.imageFooterInfo}>
                <Text style={styles.imageOverlayTitle}>Sign to Text</Text>
                <Text style={styles.imageOverlaySub}>Real-time ISL gesture-to-speech converter</Text>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.cardBody}>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Show your Indian Sign Language gestures to your camera. Our machine learning engine analyzes frames and translates them into live text sentences.
            </Text>

            <View style={styles.featureChipsRow}>
              <View style={[styles.chip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                <Text style={[styles.chipText, { color: theme.textTertiary }]}>📷 Front/Back Lens</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                <Text style={[styles.chipText, { color: theme.textTertiary }]}>⚡ Confidence Meter</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                <Text style={[styles.chipText, { color: theme.textTertiary }]}>🗣️ Auto-Speak</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryActionBtn, SHADOWS.sm]}
              onPress={() => router.push('/prototype/signtotext')}
              activeOpacity={0.85}
            >
              <Ionicons name="camera" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryActionBtnText}>Launch Camera AI</Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2: Text to Speech (Multi-lingual) */}
        <View style={[styles.modeCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.md]}>
          <View style={styles.imageBox}>
            <ImageBackground
              source={require('../../assets/images/Text to Speech.jpg')}
              style={styles.cardImg}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(11, 15, 23, 0.85)']}
                style={styles.gradientOverlay}
              />
              <View style={styles.cardOverlayHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: '#10B981' }]}>
                  <Ionicons name="volume-high" size={12} color="#fff" style={{ marginRight: 4 }} />
                  <Text style={styles.categoryBadgeText}>NEURAL VOICE • GEMINI TTS</Text>
                </View>
              </View>

              <View style={styles.imageFooterInfo}>
                <Text style={styles.imageOverlayTitle}>Text to Speech</Text>
                <Text style={styles.imageOverlaySub}>Multi-dialect Indian speech generator</Text>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.cardBody}>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Translate and generate human-like speech in Tamil, Hindi, Malayalam, or English with device audio or cloud speech synthesis.
            </Text>

            <View style={styles.featureChipsRow}>
              <View style={[styles.chip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                <Text style={[styles.chipText, { color: theme.textTertiary }]}>🇮🇳 தமிழ் (Tamil)</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                <Text style={[styles.chipText, { color: theme.textTertiary }]}>🇮🇳 हिन्दी (Hindi)</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                <Text style={[styles.chipText, { color: theme.textTertiary }]}>🇮🇳 മലയാളം</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.secondaryActionBtn, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)' }]}
              onPress={() => router.push('/prototype/texttovoice')}
              activeOpacity={0.85}
            >
              <Ionicons name="mic" size={18} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={[styles.secondaryActionBtnText, { color: '#10B981' }]}>Open Voice Studio</Text>
              <Ionicons name="chevron-forward" size={18} color="#10B981" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 3: Text to Sign (Video Gestures) */}
        <View style={[styles.modeCard, { backgroundColor: theme.card, borderColor: theme.border, marginBottom: 24 }, SHADOWS.md]}>
          <View style={styles.imageBox}>
            <ImageBackground
              source={require('../../assets/images/Text to Sign.jpg')}
              style={styles.cardImg}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(11, 15, 23, 0.85)']}
                style={styles.gradientOverlay}
              />
              <View style={styles.cardOverlayHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: '#8B5CF6' }]}>
                  <MaterialCommunityIcons name="gesture-tap-button" size={12} color="#fff" style={{ marginRight: 4 }} />
                  <Text style={styles.categoryBadgeText}>GESTURE SYNTH • HD VIDEO</Text>
                </View>
              </View>

              <View style={styles.imageFooterInfo}>
                <Text style={styles.imageOverlayTitle}>Text to Sign</Text>
                <Text style={styles.imageOverlaySub}>Interactive video dictionary & quick phrases</Text>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.cardBody}>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Enter conversational phrases or select from emergency, greeting, and everyday sign video presets to play looping high-definition demonstrations.
            </Text>

            <View style={styles.featureChipsRow}>
              <View style={[styles.chip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                <Text style={[styles.chipText, { color: theme.textTertiary }]}>🔁 Loop Playback</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                <Text style={[styles.chipText, { color: theme.textTertiary }]}>⚡ Quick Presets</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                <Text style={[styles.chipText, { color: theme.textTertiary }]}>🔍 Instant Search</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.secondaryActionBtn, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)' }]}
              onPress={() => router.push('/prototype/texttosign')}
              activeOpacity={0.85}
            >
              <Ionicons name="play-circle" size={18} color="#8B5CF6" style={{ marginRight: 8 }} />
              <Text style={[styles.secondaryActionBtnText, { color: '#8B5CF6' }]}>Launch Sign Player</Text>
              <Ionicons name="chevron-forward" size={18} color="#8B5CF6" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <AppBottomNav currentTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
    gap: 2,
  },
  greetingSub: {
    fontSize: 13,
    fontWeight: '600',
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: RADIUS.xl,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  streakLeft: {
    flex: 1,
    marginRight: 12,
  },
  streakBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  streakSubtitle: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  streakFireBox: {
    width: 64,
    height: 68,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDays: {
    fontSize: 16,
    fontWeight: '800',
    color: '#D97706',
    lineHeight: 18,
  },
  streakLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  quickAccessRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  quickPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  quickPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  modeCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imageBox: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardOverlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  imageFooterInfo: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
  },
  imageOverlayTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  imageOverlaySub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  cardBody: {
    padding: 16,
    gap: 12,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  featureChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  primaryActionBtn: {
    height: 48,
    backgroundColor: PALETTE.primary,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  primaryActionBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    height: 48,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  secondaryActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PALETTE, RADIUS, SHADOWS } from '../theme';

interface Slide {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  highlight: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  featurePills: string[];
}

const SLIDES: Slide[] = [
  {
    id: '1',
    tag: 'REAL-TIME ISL AI',
    tagColor: PALETTE.primary,
    title: 'Speak Freely,',
    highlight: 'Sign Fluently',
    description: 'Break communication barriers with real-time Indian Sign Language detection powered by on-device computer vision.',
    icon: 'videocam',
    featurePills: ['⚡ 900ms Detection', '🇮🇳 Indian Sign Language', '🤖 ML Powered'],
  },
  {
    id: '2',
    tag: 'TWO-WAY DIALOGUE',
    tagColor: '#10B981',
    title: 'Voice & Text to',
    highlight: 'Sign Animation',
    description: 'Transform your speech into accurate sign language videos and animations instantly for effortless conversations.',
    icon: 'chatbubbles',
    featurePills: ['🗣️ Neural TTS', '🎥 Video Library', '🌐 Multi-language'],
  },
  {
    id: '3',
    tag: 'CONNECTED FUTURE',
    tagColor: '#8B5CF6',
    title: 'Hands-Free with',
    highlight: 'AR Glasses',
    description: 'Pair with smart AR wearables for heads-up ISL subtitles and real-time captioning in your field of view.',
    icon: 'glasses',
    featurePills: ['👓 AR Hardware Ready', '🔋 Low Latency', '✨ Live Subtitles'],
  },
];

export default function Onboarding() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { height: screenHeight } = useWindowDimensions();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  const [activeSlide, setActiveSlide] = useState(0);

  const isCompactScreen = screenHeight < 720;
  const imageHeight = isCompactScreen ? 160 : Math.min(screenHeight * 0.26, 230);

  const handleNext = () => {
    if (activeSlide < SLIDES.length - 1) {
      setActiveSlide(prev => prev + 1);
    } else {
      router.push('/prototype/translation Mode');
    }
  };

  const current = SLIDES[activeSlide];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={[styles.logoBubble, { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.15)' : 'rgba(2, 132, 199, 0.1)' }]}>
            <MaterialCommunityIcons name="sign-language" size={22} color={PALETTE.primary} />
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>Hand2Voice</Text>
            <Text style={[styles.brandSubtitle, { color: theme.textTertiary }]}>SignLink AI Core</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => router.push('/prototype/translation Mode')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Visual Card */}
        <View style={styles.heroWrapper}>
          <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Visual Showcase Image with Overlay */}
            <View style={[styles.imageContainer, { height: imageHeight }]}>
              <Image
                source={require('../../assets/images/Hand2Voice.png')}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={[styles.imageGradientOverlay, { backgroundColor: isDark ? 'rgba(11, 15, 23, 0.4)' : 'rgba(255, 255, 255, 0.1)' }]} />

              {/* Floating Tag Badge */}
              <View style={[styles.tagBadge, { backgroundColor: current.tagColor }]}>
                <Ionicons name={current.icon} size={14} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.tagText}>{current.tag}</Text>
              </View>
            </View>

          {/* Slide Pill Chips */}
          <View style={styles.pillRow}>
            {current.featurePills.map((pill, idx) => (
              <View
                key={idx}
                style={[
                  styles.featurePill,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                    borderColor: theme.borderSubtle,
                  },
                ]}
              >
                <Text style={[styles.featurePillText, { color: theme.textSecondary }]}>{pill}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Content & Action Section */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActiveSlide(i)}
              style={[
                styles.dot,
                {
                  backgroundColor: i === activeSlide ? PALETTE.primary : isDark ? '#334155' : '#CBD5E1',
                  width: i === activeSlide ? 28 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.textPrimary }, isCompactScreen && { fontSize: 24, lineHeight: 30 }]}>
            {current.title}{' '}
            <Text style={{ color: PALETTE.primary }}>{current.highlight}</Text>
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }, isCompactScreen && { fontSize: 14, lineHeight: 20 }]}>
            {current.description}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={[styles.primaryBtn, SHADOWS.lg]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>
              {activeSlide === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <View style={styles.secondaryRow}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push('/prototype/login')}
            >
              <Text style={[styles.secondaryBtnText, { color: theme.textSecondary }]}>
                Already have an account? <Text style={{ color: PALETTE.primary, fontWeight: '700' }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBubble: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  heroWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  imageContainer: {
    height: 240,
    width: '100%',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  tagBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
  },
  tagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
  featurePill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  featurePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  dot: {
    height: 6,
    borderRadius: RADIUS.full,
  },
  textContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  ctaContainer: {
    gap: 12,
  },
  primaryBtn: {
    height: 56,
    backgroundColor: PALETTE.primary,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  secondaryRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtn: {
    paddingVertical: 8,
  },
  secondaryBtnText: {
    fontSize: 14,
  },
});

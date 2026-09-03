import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { AppBottomNav } from '../components/AppBottomNav';
import { PALETTE, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

interface PhraseItem {
  id: string;
  english: string;
  hindi: string;
  tamil: string;
}

const COMMON_PHRASES: PhraseItem[] = [
  { id: '1', english: 'Hello, how are you?', hindi: 'नमस्ते, आप कैसे हैं?', tamil: 'வணக்கம், எப்படி இருக்கிறீர்கள்?' },
  { id: '2', english: 'Hello, nice to meet you.', hindi: 'नमस्ते, आपसे मिलकर खुशी हुई।', tamil: 'வணக்கம், உங்களை சந்தித்ததில் மகிழ்ச்சி.' },
  { id: '3', english: 'Good morning, everyone.', hindi: 'शुभ प्रभात आप सभी को।', tamil: 'அனைவருக்கும் காலை வணக்கம்.' },
];

export default function SignDetailsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  const [isPlaying, setIsPlaying] = useState(true);
  const [markedDone, setMarkedDone] = useState(false);
  const videoRef = useRef<Video | null>(null);

  const speakAudio = (text: string) => {
    Speech.speak(text, { language: 'en-IN' });
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
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Sign Dictionary</Text>
          <Text style={[styles.headerSub, { color: theme.textTertiary }]}>Indian Sign Language Masterclass</Text>
        </View>

        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
          onPress={() => router.push('/prototype/alphabet')}
        >
          <MaterialCommunityIcons name="alphabetical" size={22} color={PALETTE.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Video Player Card */}
        <View style={[styles.videoCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.md]}>
          <View style={styles.videoHeader}>
            <View style={styles.videoBadge}>
              <View style={[styles.liveDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.videoBadgeText}>HD SIGN DEMO</Text>
            </View>
            <Text style={[styles.videoCategory, { color: theme.textTertiary }]}>Category: Greetings</Text>
          </View>

          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={require('../../assets/video/hello.mp4')}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay={isPlaying}
              useNativeControls
            />
          </View>
        </View>

        {/* Sign Header Details */}
        <View style={[styles.signMetaCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <View style={styles.signMetaTop}>
            <View>
              <Text style={[styles.signTitle, { color: theme.textPrimary }]}>Hello</Text>
              <Text style={[styles.signSub, { color: theme.textSecondary }]}>
                Universal greeting used to initiate conversation and acknowledge presence.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.doneBadgeBtn,
                { backgroundColor: markedDone ? '#10B981' : isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' },
              ]}
              onPress={() => setMarkedDone(!markedDone)}
            >
              <Ionicons name={markedDone ? 'checkmark-circle' : 'checkmark-circle-outline'} size={20} color={markedDone ? '#fff' : PALETTE.primary} />
              <Text style={[styles.doneBadgeText, { color: markedDone ? '#fff' : theme.textPrimary }]}>
                {markedDone ? 'Mastered' : 'Mark Done'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pronunciation Row */}
          <View style={[styles.pronounceBox, { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.08)' : '#F0F9FF' }]}>
            <View style={styles.pronounceLeft}>
              <Text style={[styles.pronounceLabel, { color: theme.textTertiary }]}>PHONETIC IPA</Text>
              <Text style={[styles.pronounceIpa, { color: PALETTE.primary }]}>/həˈloʊ/</Text>
            </View>

            <TouchableOpacity
              style={[styles.listenBtn, { backgroundColor: PALETTE.primary }]}
              onPress={() => speakAudio('Hello')}
            >
              <Ionicons name="volume-medium" size={18} color="#fff" />
              <Text style={styles.listenBtnText}>Listen</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Step-by-Step Execution Guide */}
        <View style={[styles.guideCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <Text style={[styles.cardSectionTitle, { color: theme.textPrimary }]}>Step-by-Step Execution</Text>

          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={[styles.stepNum, { backgroundColor: PALETTE.primary }]}>
                <Text style={styles.stepNumText}>1</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Initial Hand Posture</Text>
                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  Raise your dominant hand near temple or ear level with fingers fully extended and palm facing forward.
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={[styles.stepNum, { backgroundColor: '#8B5CF6' }]}>
                <Text style={styles.stepNumText}>2</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Oscillation Movement</Text>
                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  Gently sweep hand laterally side-to-side in a small arc twice with relaxed wrist motion.
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={[styles.stepNum, { backgroundColor: '#10B981' }]}>
                <Text style={styles.stepNumText}>3</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Facial Expression</Text>
                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  Pair the sign with direct, warm eye contact and a gentle smile to convey openness.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Common Conversational Phrases */}
        <View style={[styles.guideCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <Text style={[styles.cardSectionTitle, { color: theme.textPrimary }]}>Conversational Examples</Text>

          <View style={styles.phrasesList}>
            {COMMON_PHRASES.map((phrase) => (
              <View
                key={phrase.id}
                style={[
                  styles.phraseRow,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', borderColor: theme.borderSubtle },
                ]}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.phraseEng, { color: theme.textPrimary }]}>{phrase.english}</Text>
                  <Text style={[styles.phraseRegional, { color: theme.textTertiary }]}>
                    {phrase.hindi} • {phrase.tamil}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.audioIconBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                  onPress={() => speakAudio(phrase.english)}
                >
                  <Ionicons name="volume-medium" size={18} color={PALETTE.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Link to Full Alphabet Practice */}
        <TouchableOpacity
          style={[styles.alphabetBanner, SHADOWS.md]}
          onPress={() => router.push('/prototype/alphabet')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="alphabetical" size={28} color="#fff" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.bannerTitle}>Explore Full Sign Alphabet</Text>
            <Text style={styles.bannerSub}>Master Indian Sign Language letters A to Z with mnemonics</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <AppBottomNav currentTab="learn" />
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
  videoCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  videoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  videoBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6, color: '#10B981' },
  videoCategory: { fontSize: 12, fontWeight: '600' },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: '#000',
  },
  signMetaCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  signMetaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  signTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  signSub: { fontSize: 13, marginTop: 4, lineHeight: 18, maxWidth: 220 },
  doneBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  doneBadgeText: { fontSize: 12, fontWeight: '700' },
  pronounceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: RADIUS.lg,
  },
  pronounceLeft: { gap: 2 },
  pronounceLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  pronounceIpa: { fontSize: 16, fontWeight: '700' },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  listenBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  guideCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  cardSectionTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  stepsList: { gap: 14 },
  stepItem: { flexDirection: 'row', gap: 12 },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  stepTitle: { fontSize: 14, fontWeight: '700' },
  stepDesc: { fontSize: 12, marginTop: 2, lineHeight: 17 },
  phrasesList: { gap: 10 },
  phraseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  phraseEng: { fontSize: 14, fontWeight: '600' },
  phraseRegional: { fontSize: 11, marginTop: 2 },
  audioIconBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphabetBanner: {
    backgroundColor: PALETTE.primary,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  bannerTitle: { color: '#fff', fontSize: 15, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
});
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PALETTE, RADIUS, SHADOWS } from '../theme';

interface SignPhrase {
  id: number;
  text: string;
  category: 'Greetings' | 'Emergency' | 'Feelings' | 'Daily';
  handShape: string;
  motion: string;
  video: number;
}

const SIGN_PHRASES: SignPhrase[] = [
  {
    id: 1,
    text: 'Good morning',
    category: 'Greetings',
    handShape: 'Flat hand to sun rise',
    motion: 'Arced upward motion from horizon',
    video: require('../../assets/video/good-morning.mp4'),
  },
  {
    id: 2,
    text: 'Thank you',
    category: 'Greetings',
    handShape: 'Open fingers at chin',
    motion: 'Moved gently forward toward listener',
    video: require('../../assets/video/thank-you.mp4'),
  },
  {
    id: 3,
    text: 'Hello',
    category: 'Greetings',
    handShape: 'Raised open palm',
    motion: 'Two gentle lateral side-to-side waves',
    video: require('../../assets/video/hello.mp4'),
  },
  {
    id: 4,
    text: 'Can you help me',
    category: 'Emergency',
    handShape: 'Thumbs up on flat palm',
    motion: 'Lifted upward toward the signer',
    video: require('../../assets/video/can-you-help-me.mp4'),
  },
  {
    id: 5,
    text: 'I need help',
    category: 'Emergency',
    handShape: 'Closed fist on base palm',
    motion: 'Urgent upward lift and hold',
    video: require('../../assets/video/i-need-help.mp4'),
  },
  {
    id: 6,
    text: 'I love this',
    category: 'Feelings',
    handShape: 'Crossed fists over chest',
    motion: 'Gentle inward press',
    video: require('../../assets/video/i-love-this.mp4'),
  },
  {
    id: 8,
    text: 'I understand',
    category: 'Daily',
    handShape: 'Index finger flick',
    motion: 'Flicked upward adjacent to temple',
    video: require('../../assets/video/i-understand.mp4'),
  },
  {
    id: 9,
    text: "Let's go",
    category: 'Daily',
    handShape: 'Both hands pointed forward',
    motion: 'Rhythmic forward push motion',
    video: require('../../assets/video/lets-go.mp4.mp4'),
  },
];

const CATEGORIES = ['All', 'Greetings', 'Emergency', 'Feelings', 'Daily'] as const;

export default function TextToSign() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhrase, setActivePhrase] = useState<SignPhrase | null>(SIGN_PHRASES[2]); // Default 'Hello'
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  const videoRef = useRef<Video | null>(null);

  const filteredPhrases = SIGN_PHRASES.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery = p.text.toLowerCase().includes(inputText.toLowerCase());
    return matchesCategory && (inputText ? matchesQuery : true);
  });

  const handlePhraseSelect = (phrase: SignPhrase) => {
    setInputText(phrase.text);
    setActivePhrase(phrase);
    videoRef.current?.playAsync();
  };

  const handleConvert = () => {
    const matched = SIGN_PHRASES.find(
      (p) => p.text.toLowerCase() === inputText.trim().toLowerCase(),
    );
    if (matched) {
      setActivePhrase(matched);
      videoRef.current?.playAsync();
    } else if (SIGN_PHRASES.length > 0) {
      // Partial match fallback
      const partial = SIGN_PHRASES.find((p) =>
        p.text.toLowerCase().includes(inputText.trim().toLowerCase()),
      );
      if (partial) {
        setActivePhrase(partial);
        videoRef.current?.playAsync();
      }
    }
  };

  const cycleSpeed = async () => {
    const speeds = [0.75, 1.0, 1.25];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      await videoRef.current.setRateAsync(nextSpeed, true);
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Text to Sign</Text>
          <Text style={[styles.headerSub, { color: theme.textTertiary }]}>ISL Video Animation Studio</Text>
        </View>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
          onPress={() => router.push('/prototype/alphabet')}
        >
          <MaterialCommunityIcons name="alphabetical" size={22} color={PALETTE.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Video Player Card */}
        {activePhrase && (
          <View style={[styles.videoCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.md]}>
            <View style={styles.videoHeader}>
              <View style={styles.videoTitleRow}>
                <View style={[styles.dotLive, { backgroundColor: '#8B5CF6' }]} />
                <Text style={[styles.videoTitle, { color: theme.textPrimary }]}>{activePhrase.text}</Text>
              </View>

              <View style={styles.videoActions}>
                {/* Speed Toggle */}
                <TouchableOpacity style={[styles.controlPill, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]} onPress={cycleSpeed}>
                  <Text style={[styles.controlPillText, { color: PALETTE.primary }]}>{playbackSpeed}x</Text>
                </TouchableOpacity>

                {/* Loop Toggle */}
                <TouchableOpacity
                  style={[
                    styles.controlPill,
                    { backgroundColor: isLooping ? 'rgba(139, 92, 246, 0.15)' : isDark ? '#1E293B' : '#F1F5F9' },
                  ]}
                  onPress={() => setIsLooping(!isLooping)}
                >
                  <Ionicons name="repeat" size={14} color={isLooping ? '#8B5CF6' : theme.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Video Viewport */}
            <View style={styles.videoFrame}>
              <Video
                ref={videoRef}
                source={activePhrase.video}
                style={StyleSheet.absoluteFill}
                resizeMode={ResizeMode.CONTAIN}
                isLooping={isLooping}
                shouldPlay={true}
                useNativeControls
              />
            </View>

            {/* Sign Breakdown Info */}
            <View style={[styles.signGuideBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }]}>
              <View style={styles.guideRow}>
                <Ionicons name="hand-right-outline" size={16} color={PALETTE.primary} />
                <Text style={[styles.guideLabel, { color: theme.textSecondary }]}>Hand Shape:</Text>
                <Text style={[styles.guideVal, { color: theme.textPrimary }]}>{activePhrase.handShape}</Text>
              </View>
              <View style={styles.guideRow}>
                <Ionicons name="swap-horizontal-outline" size={16} color="#8B5CF6" />
                <Text style={[styles.guideLabel, { color: theme.textSecondary }]}>Motion:</Text>
                <Text style={[styles.guideVal, { color: theme.textPrimary }]}>{activePhrase.motion}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Input Card */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <View style={styles.inputHeader}>
            <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Enter Sentence or Phrase</Text>
            {inputText.length > 0 && (
              <TouchableOpacity onPress={() => setInputText('')}>
                <Text style={[styles.clearBtnText, { color: theme.textTertiary }]}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.inputBox, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
            <TextInput
              placeholder="e.g. Good morning, Thank you, Need help..."
              placeholderTextColor={theme.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              style={[styles.textInput, { color: theme.textPrimary }]}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[styles.convertBtn, { backgroundColor: '#8B5CF6' }, SHADOWS.md]}
            onPress={handleConvert}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="gesture-tap" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.convertBtnText}>Synthesize ISL Video</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Carousel */}
        <View style={styles.categorySection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Quick Phrase Dictionary</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryPill,
                    {
                      backgroundColor: isSelected ? '#8B5CF6' : isDark ? '#1E293B' : '#F1F5F9',
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      { color: isSelected ? '#fff' : theme.textSecondary, fontWeight: isSelected ? '700' : '600' },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Quick Phrases Grid */}
          <View style={styles.phrasesGrid}>
            {filteredPhrases.map((phrase) => {
              const isCurrent = activePhrase?.id === phrase.id;
              return (
                <TouchableOpacity
                  key={phrase.id}
                  style={[
                    styles.phraseItem,
                    {
                      backgroundColor: isCurrent
                        ? isDark
                          ? 'rgba(139, 92, 246, 0.18)'
                          : '#EDE9FE'
                        : theme.card,
                      borderColor: isCurrent ? '#8B5CF6' : theme.border,
                    },
                  ]}
                  onPress={() => handlePhraseSelect(phrase)}
                  activeOpacity={0.7}
                >
                  <View style={styles.phraseLeft}>
                    <Ionicons
                      name={isCurrent ? 'play-circle' : 'videocam-outline'}
                      size={18}
                      color={isCurrent ? '#8B5CF6' : theme.textTertiary}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.phraseItemText,
                        {
                          color: isCurrent ? '#8B5CF6' : theme.textPrimary,
                          fontWeight: isCurrent ? '700' : '500',
                        },
                      ]}
                    >
                      {phrase.text}
                    </Text>
                  </View>

                  <View style={[styles.categoryTag, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
                    <Text style={[styles.categoryTagText, { color: theme.textTertiary }]}>{phrase.category}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  headerSub: { fontSize: 11, fontWeight: '600' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  videoCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  videoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dotLive: { width: 8, height: 8, borderRadius: 4 },
  videoTitle: { fontSize: 16, fontWeight: '700' },
  videoActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  controlPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  controlPillText: { fontSize: 12, fontWeight: '700' },
  videoFrame: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: '#000',
    position: 'relative',
  },
  signGuideBox: {
    padding: 14,
    gap: 6,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guideLabel: { fontSize: 12, fontWeight: '600' },
  guideVal: { fontSize: 12, fontWeight: '700', flex: 1 },
  card: {
    borderRadius: RADIUS.xl,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: { fontSize: 13, fontWeight: '600' },
  clearBtnText: { fontSize: 12, fontWeight: '600' },
  inputBox: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: 12,
    minHeight: 80,
  },
  textInput: {
    fontSize: 15,
    textAlignVertical: 'top',
  },
  convertBtn: {
    height: 48,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  categorySection: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  categoryScroll: { marginBottom: 4 },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    marginRight: 8,
  },
  categoryPillText: { fontSize: 13 },
  phrasesGrid: { gap: 8 },
  phraseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  phraseLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginRight: 8 },
  phraseItemText: { fontSize: 14 },
  categoryTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  categoryTagText: { fontSize: 10, fontWeight: '700' },
});
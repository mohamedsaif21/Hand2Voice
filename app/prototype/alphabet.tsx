import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBottomNav } from '../components/AppBottomNav';
import { PALETTE, RADIUS, SHADOWS } from '../theme';

interface AlphabetLetter {
  letter: string;
  image: any;
  isVowel: boolean;
  mnemonic: string;
  fingers: string;
}

const ALPHABET_DATA: AlphabetLetter[] = [
  { letter: 'A', image: require('../../assets/alphabet/A.jpg'), isVowel: true, mnemonic: 'Fist with thumb upright beside index finger', fingers: 'Closed fist, thumb resting upright' },
  { letter: 'B', image: require('../../assets/alphabet/B.jpg'), isVowel: false, mnemonic: 'Flat open four fingers, thumb tucked across palm', fingers: '4 fingers extended upward, thumb folded' },
  { letter: 'C', image: require('../../assets/alphabet/C.jpg'), isVowel: false, mnemonic: 'Curved hand forming the letter C shape', fingers: 'Fingers curved inward facing thumb' },
  { letter: 'D', image: require('../../assets/alphabet/D.jpg'), isVowel: false, mnemonic: 'Index finger pointing straight up, thumb touches other fingers', fingers: 'Index up, circle with thumb & other fingers' },
  { letter: 'E', image: require('../../assets/alphabet/E.jpg'), isVowel: true, mnemonic: 'Curled fingertips resting against thumb tip', fingers: 'Fingers curled back to thumb' },
  { letter: 'F', image: require('../../assets/alphabet/F.jpg'), isVowel: false, mnemonic: 'Index and thumb form an O, other three fingers up', fingers: 'Circle with index & thumb, 3 fingers up' },
  { letter: 'G', image: require('../../assets/alphabet/G.jpg'), isVowel: false, mnemonic: 'Index finger and thumb pointing horizontally', fingers: 'Index & thumb parallel pointing left' },
  { letter: 'H', image: require('../../assets/alphabet/H.jpg'), isVowel: false, mnemonic: 'Index and middle fingers together pointing sideways', fingers: 'Two fingers extended horizontally' },
  { letter: 'I', image: require('../../assets/alphabet/I.jpg'), isVowel: true, mnemonic: 'Pinky finger extended upright', fingers: 'Pinky finger straight up, fist closed' },
  { letter: 'J', image: require('../../assets/alphabet/J.jpg'), isVowel: false, mnemonic: 'Pinky finger traces a J curve downward in air', fingers: 'Pinky curved in motion of J' },
  { letter: 'K', image: require('../../assets/alphabet/K.jpg'), isVowel: false, mnemonic: 'Index pointing up, middle forward, thumb between them', fingers: 'V-shape with thumb placed between' },
  { letter: 'L', image: require('../../assets/alphabet/L.jpg'), isVowel: false, mnemonic: 'Index finger and thumb form an L shape', fingers: 'Index up and thumb out perpendicular' },
  { letter: 'M', image: require('../../assets/alphabet/M.jpg'), isVowel: false, mnemonic: 'Thumb tucked under three fingers', fingers: 'Three fingers folded over thumb' },
  { letter: 'N', image: require('../../assets/alphabet/N.jpg'), isVowel: false, mnemonic: 'Thumb tucked under two fingers', fingers: 'Two fingers folded over thumb' },
  { letter: 'O', image: require('../../assets/alphabet/O.jpg'), isVowel: true, mnemonic: 'All fingertips meet thumb to form an O', fingers: 'Circle formed by all fingertips & thumb' },
  { letter: 'P', image: require('../../assets/alphabet/P.jpg'), isVowel: false, mnemonic: 'K shape pointed downward', fingers: 'Downward inverted K formation' },
  { letter: 'Q', image: require('../../assets/alphabet/Q.jpg'), isVowel: false, mnemonic: 'G shape pointed downward toward the ground', fingers: 'Index and thumb pointed downward' },
  { letter: 'R', image: require('../../assets/alphabet/R.jpg'), isVowel: false, mnemonic: 'Index and middle fingers crossed', fingers: 'Fingers crossed for luck shape' },
  { letter: 'S', image: require('../../assets/alphabet/S.jpg'), isVowel: false, mnemonic: 'Tight fist with thumb across the front of fingers', fingers: 'Fist with thumb wrapped across front' },
  { letter: 'T', image: require('../../assets/alphabet/T.jpg'), isVowel: false, mnemonic: 'Thumb between index and middle fingers', fingers: 'Thumb peeking between first two fingers' },
  { letter: 'U', image: require('../../assets/alphabet/U.jpg'), isVowel: true, mnemonic: 'Index and middle fingers straight up and together', fingers: 'Two fingers straight up touching' },
  { letter: 'V', image: require('../../assets/alphabet/V.jpg'), isVowel: false, mnemonic: 'Index and middle fingers form a V peace sign', fingers: 'V shape victory sign' },
  { letter: 'W', image: require('../../assets/alphabet/W.jpg'), isVowel: false, mnemonic: 'Three middle fingers spread upward', fingers: 'Three fingers extended in W shape' },
  { letter: 'X', image: require('../../assets/alphabet/X.jpg'), isVowel: false, mnemonic: 'Index finger curled like a hook', fingers: 'Hooked index finger, other fingers closed' },
  { letter: 'Y', image: require('../../assets/alphabet/Y.jpg'), isVowel: false, mnemonic: 'Thumb and pinky extended out (shaka sign)', fingers: 'Thumb and little finger extended outward' },
  { letter: 'Z', image: require('../../assets/alphabet/Z.jpg'), isVowel: false, mnemonic: 'Index finger traces a Z in the air', fingers: 'Index traces the letter Z' },
];

export default function SignLanguageAlphabet() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { width: screenWidth } = useWindowDimensions();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  const cardWidth = Math.max(90, Math.floor((screenWidth - 52) / 3));

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'vowels' | 'consonants'>('all');
  const [selectedLetter, setSelectedLetter] = useState<AlphabetLetter | null>(null);

  const filteredData = ALPHABET_DATA.filter((item) => {
    const matchesSearch = item.letter.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterMode === 'vowels') return matchesSearch && item.isVowel;
    if (filterMode === 'consonants') return matchesSearch && !item.isVowel;
    return matchesSearch;
  });

  const speakLetter = (letter: string) => {
    Speech.speak(`Letter ${letter}`, { language: 'en-IN', rate: 0.9 });
  };

  const handleOpenLetter = (item: AlphabetLetter) => {
    setSelectedLetter(item);
    speakLetter(item.letter);
  };

  const navigateModal = (delta: number) => {
    if (!selectedLetter) return;
    const currIdx = ALPHABET_DATA.findIndex((a) => a.letter === selectedLetter.letter);
    const nextIdx = (currIdx + delta + ALPHABET_DATA.length) % ALPHABET_DATA.length;
    const nextLetter = ALPHABET_DATA[nextIdx];
    setSelectedLetter(nextLetter);
    speakLetter(nextLetter.letter);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
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

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Sign Alphabet</Text>
          <Text style={[styles.headerSub, { color: theme.textTertiary }]}>Indian Sign Language (A–Z)</Text>
        </View>

        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
          onPress={() => router.push('/prototype/signdetails')}
        >
          <Ionicons name="school-outline" size={20} color={PALETTE.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <Ionicons name="search-outline" size={18} color={theme.textTertiary} />
          <TextInput
            placeholder="Search sign letter..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.textPrimary }]}
            autoCapitalize="characters"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: filterMode === 'all' ? PALETTE.primary : isDark ? theme.card : '#F1F5F9',
                borderColor: filterMode === 'all' ? PALETTE.primary : theme.border,
              },
            ]}
            onPress={() => setFilterMode('all')}
          >
            <Text style={[styles.filterPillText, { color: filterMode === 'all' ? '#fff' : theme.textSecondary }]}>
              All Signs (26)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: filterMode === 'vowels' ? PALETTE.primary : isDark ? theme.card : '#F1F5F9',
                borderColor: filterMode === 'vowels' ? PALETTE.primary : theme.border,
              },
            ]}
            onPress={() => setFilterMode('vowels')}
          >
            <Text style={[styles.filterPillText, { color: filterMode === 'vowels' ? '#fff' : theme.textSecondary }]}>
              Vowels (5)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: filterMode === 'consonants' ? PALETTE.primary : isDark ? theme.card : '#F1F5F9',
                borderColor: filterMode === 'consonants' ? PALETTE.primary : theme.border,
              },
            ]}
            onPress={() => setFilterMode('consonants')}
          >
            <Text style={[styles.filterPillText, { color: filterMode === 'consonants' ? '#fff' : theme.textSecondary }]}>
              Consonants (21)
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Alphabet Grid */}
        <View style={styles.grid}>
          {filteredData.map((item) => (
            <TouchableOpacity
              key={item.letter}
              style={[
                styles.gridCard,
                { width: cardWidth, backgroundColor: theme.card, borderColor: theme.border },
                SHADOWS.sm,
              ]}
              onPress={() => handleOpenLetter(item)}
              activeOpacity={0.75}
            >
              {/* Badge */}
              <View style={[styles.letterBadge, { backgroundColor: item.isVowel ? '#E0F2FE' : isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
                <Text style={[styles.letterBadgeText, { color: item.isVowel ? PALETTE.primary : theme.textPrimary }]}>
                  {item.letter}
                </Text>
              </View>

              {/* Image Frame */}
              <View style={styles.imgFrame}>
                <Image source={item.image} style={styles.letterImg} resizeMode="cover" />
              </View>

              <Text style={[styles.letterLabel, { color: theme.textSecondary }]}>Sign {item.letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Letter Inspector Modal */}
      <Modal visible={!!selectedLetter} transparent animationType="fade" onRequestClose={() => setSelectedLetter(null)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.lg]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <View style={[styles.modalBigBadge, { backgroundColor: PALETTE.primary }]}>
                  <Text style={styles.modalBigBadgeText}>{selectedLetter?.letter}</Text>
                </View>
                <View>
                  <Text style={[styles.modalSignTitle, { color: theme.textPrimary }]}>
                    Letter {selectedLetter?.letter}
                  </Text>
                  <Text style={[styles.modalSignSub, { color: theme.textTertiary }]}>
                    {selectedLetter?.isVowel ? 'Vowel' : 'Consonant'} • ISL Gesture
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.modalCloseBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}
                onPress={() => setSelectedLetter(null)}
              >
                <Ionicons name="close" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Modal Image */}
            {selectedLetter && (
              <View style={styles.modalImgFrame}>
                <Image source={selectedLetter.image} style={styles.modalImg} resizeMode="contain" />
              </View>
            )}

            {/* Mnemonic Details */}
            <View style={[styles.modalInfoBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }]}>
              <View style={styles.infoLine}>
                <MaterialCommunityIcons name="hand-pointing-right" size={18} color={PALETTE.primary} />
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>{selectedLetter?.fingers}</Text>
              </View>
              <View style={styles.infoLine}>
                <Ionicons name="bulb-outline" size={18} color="#F59E0B" />
                <Text style={[styles.infoText, { color: theme.textTertiary }]}>{selectedLetter?.mnemonic}</Text>
              </View>
            </View>

            {/* Navigation Carousel Arrows */}
            <View style={styles.modalNavRow}>
              <TouchableOpacity
                style={[styles.modalNavBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                onPress={() => navigateModal(-1)}
              >
                <Ionicons name="chevron-back" size={20} color={theme.textPrimary} />
                <Text style={[styles.modalNavBtnText, { color: theme.textPrimary }]}>Prev</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalAudioBtn, { backgroundColor: PALETTE.primary }]}
                onPress={() => selectedLetter && speakLetter(selectedLetter.letter)}
              >
                <Ionicons name="volume-high" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalNavBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
                onPress={() => navigateModal(1)}
              >
                <Text style={[styles.modalNavBtnText, { color: theme.textPrimary }]}>Next</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  headerTitleWrap: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  headerSub: { fontSize: 11, fontWeight: '600' },
  scrollContent: { padding: 16, paddingBottom: 24, gap: 14 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  filterPillText: { fontSize: 12, fontWeight: '700' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  letterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    marginBottom: 6,
  },
  letterBadgeText: { fontSize: 14, fontWeight: '800' },
  imgFrame: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 6,
  },
  letterImg: { width: '100%', height: '100%' },
  letterLabel: { fontSize: 11, fontWeight: '600' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: RADIUS.xl,
    padding: 20,
    borderWidth: 1,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalBigBadge: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBigBadgeText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  modalSignTitle: { fontSize: 18, fontWeight: '800' },
  modalSignSub: { fontSize: 12 },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImgFrame: {
    width: '100%',
    height: 200,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  modalImg: { width: '100%', height: '100%' },
  modalInfoBox: {
    padding: 14,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  infoLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 13, flex: 1, lineHeight: 18 },
  modalNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  modalNavBtnText: { fontSize: 13, fontWeight: '700' },
  modalAudioBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
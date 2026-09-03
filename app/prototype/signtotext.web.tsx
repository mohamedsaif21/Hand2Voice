/**
 * Hand2Voice — Sign to Text Screen (Web & Simulator)
 * ===================================================
 * Interactive web-safe simulator for Indian Sign Language gesture recognition.
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { PALETTE, RADIUS, SHADOWS } from '../theme';

const SAMPLE_GESTURES = [
  { label: 'Hello', confidence: 0.94, hint: 'Open palm raised and waved' },
  { label: 'Thank you', confidence: 0.91, hint: 'Fingertips to chin and moved forward' },
  { label: 'Good morning', confidence: 0.88, hint: 'Right hand sunrise gesture' },
  { label: 'Need help', confidence: 0.96, hint: 'Thumbs up resting on open palm' },
  { label: 'Understand', confidence: 0.89, hint: 'Index finger flicked near temple' },
  { label: 'Sign Language', confidence: 0.93, hint: 'Alternating circling hands' },
];

export default function SignToTextWeb() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  const [activeGesture, setActiveGesture] = useState(SAMPLE_GESTURES[0]);
  const [sentence, setSentence] = useState<string[]>(['Hello', 'Good morning']);
  const [isSimulating, setIsSimulating] = useState(true);

  const addWord = (word: string) => {
    setSentence((prev) => [...prev, word]);
  };

  const removeWordAt = (index: number) => {
    setSentence((prev) => prev.filter((_, i) => i !== index));
  };

  const clearSentence = () => setSentence([]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Sign to Text (Web Studio)</Text>
          <Text style={[styles.headerSub, { color: theme.textTertiary }]}>Interactive Gesture Simulator</Text>
        </View>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Simulator Viewfinder */}
        <View style={[styles.viewfinder, { backgroundColor: '#0F172A' }, SHADOWS.md]}>
          <View style={styles.reticle}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>

          <View style={styles.simCenter}>
            <MaterialCommunityIcons name="hand-back-right" size={64} color={PALETTE.primary} />
            <Text style={styles.simHeadline}>ISL Gesture Simulator Active</Text>
            <Text style={styles.simDetail}>{activeGesture.hint}</Text>
          </View>

          <View style={styles.hudBar}>
            <View style={styles.hudPill}>
              <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.hudPillText}>SIMULATED CAMERA • 60 FPS</Text>
            </View>
          </View>
        </View>

        {/* Prediction Card */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.tag, { color: theme.textTertiary }]}>DETECTED SIGN</Text>
            <View style={[styles.confBadge, { backgroundColor: 'rgba(14, 165, 233, 0.12)' }]}>
              <Text style={[styles.confText, { color: PALETTE.primary }]}>
                {Math.round(activeGesture.confidence * 100)}% Confidence
              </Text>
            </View>
          </View>

          <View style={styles.predRow}>
            <Text style={[styles.signText, { color: theme.textPrimary }]}>{activeGesture.label}</Text>
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: PALETTE.primary }]}
              onPress={() => addWord(activeGesture.label)}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.addBtnText}>Add Word</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Sign Presets to Test */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Select Test Sign Gesture</Text>
        <View style={styles.gestureGrid}>
          {SAMPLE_GESTURES.map((item) => {
            const isSelected = item.label === activeGesture.label;
            return (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.gestureItem,
                  {
                    backgroundColor: isSelected
                      ? isDark
                        ? 'rgba(14, 165, 233, 0.18)'
                        : '#E0F2FE'
                      : theme.card,
                    borderColor: isSelected ? PALETTE.primary : theme.border,
                  },
                ]}
                onPress={() => setActiveGesture(item)}
              >
                <Text
                  style={[
                    styles.gestureLabel,
                    {
                      color: isSelected ? PALETTE.primary : theme.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Constructed Sentence Bar */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 16 }, SHADOWS.sm]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.tag, { color: theme.textTertiary }]}>CONSTRUCTED SENTENCE</Text>
            {sentence.length > 0 && (
              <TouchableOpacity onPress={clearSentence}>
                <Text style={[styles.clearText, { color: theme.textTertiary }]}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.chipsRow}>
            {sentence.map((word, i) => (
              <View
                key={i}
                style={[
                  styles.chip,
                  { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.16)' : '#E0F2FE', borderColor: 'rgba(14, 165, 233, 0.3)' },
                ]}
              >
                <Text style={[styles.chipText, { color: PALETTE.primaryDark }]}>{word}</Text>
                <TouchableOpacity onPress={() => removeWordAt(i)}>
                  <Ionicons name="close-circle" size={16} color={PALETTE.primary} style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            ))}
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
  scrollContent: { padding: 16, paddingBottom: 32 },
  viewfinder: {
    width: '100%',
    height: 240,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  reticle: { ...StyleSheet.absoluteFillObject, margin: 24 },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: '#38BDF8' },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 6 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 6 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 6 },
  simCenter: { alignItems: 'center', gap: 6, paddingHorizontal: 20 },
  simHeadline: { color: '#fff', fontSize: 16, fontWeight: '700' },
  simDetail: { color: '#94A3B8', fontSize: 12, textAlign: 'center' },
  hudBar: { position: 'absolute', top: 12, left: 12 },
  hudPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  hudPillText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  card: { borderRadius: RADIUS.xl, padding: 16, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tag: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  confBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  confText: { fontSize: 11, fontWeight: '700' },
  predRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  signText: { fontSize: 26, fontWeight: '800' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
  },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  gestureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gestureItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  gestureLabel: { fontSize: 13 },
  clearText: { fontSize: 12, fontWeight: '600' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: '700' },
});

/**
 * Hand2Voice — Sign to Text Screen (Mobile Camera AI)
 * ====================================================
 * World-class computer vision interface for Indian Sign Language.
 * Features viewfinder target brackets, live confidence meters,
 * sentence builder chips with speech synthesis, and camera controls.
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
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

const { width } = Dimensions.get('window');

interface PredictResponse {
  label: string;
  confidence: number;
  hand_detected: boolean;
}

const POLL_MS = 900;
const MIN_CONFIDENCE = 0.65;

export default function SignToText() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  const [isDetecting, setIsDetecting] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [handDetected, setHandDetected] = useState(false);
  const [sentence, setSentence] = useState<string[]>([]);
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const apiUrl = useMemo(
    () => process.env.EXPO_PUBLIC_SIGN_API_URL ?? 'http://10.0.2.2:8000',
    [],
  );

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
    setIsBusy(false);
    setHandDetected(false);
  }, []);

  useEffect(() => () => stopDetection(), [stopDetection]);

  const sendFrame = useCallback(async () => {
    if (isBusy || !cameraRef.current || !permission?.granted) return;
    setIsBusy(true);

    try {
      const photo = await (cameraRef.current as any).takePictureAsync?.({
        base64: true,
        quality: 0.25,
        skipProcessing: true,
      });

      if (!photo?.base64) return;

      const res = await fetch(`${apiUrl.replace(/\/$/, '')}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: photo.base64 }),
      });

      if (!res.ok) return;

      const data = (await res.json()) as PredictResponse;
      setHandDetected(data.hand_detected);

      if (data.hand_detected && data.label && data.confidence >= MIN_CONFIDENCE) {
        setPrediction(data.label);
        setConfidence(data.confidence);
      } else if (!data.hand_detected) {
        setPrediction('');
        setConfidence(0);
      }
    } catch {
      // Graceful fallback during offline testing
    } finally {
      setIsBusy(false);
    }
  }, [apiUrl, isBusy, permission?.granted]);

  const startDetection = useCallback(async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setPrediction('');
    setConfidence(0);
    setIsDetecting(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => void sendFrame(), POLL_MS);
  }, [permission, requestPermission, sendFrame]);

  const addWord = useCallback(() => {
    if (prediction) {
      setSentence((prev) => [...prev, prediction]);
    }
  }, [prediction]);

  const removeWordAt = useCallback((index: number) => {
    setSentence((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearSentence = useCallback(() => setSentence([]), []);

  const flipCamera = useCallback(() => {
    setFacing((f) => (f === 'front' ? 'back' : 'front'));
  }, []);

  const speakSentence = useCallback(() => {
    const textToSpeak = sentence.join(' ');
    if (!textToSpeak) return;
    Speech.speak(textToSpeak, { language: 'en-IN', rate: 0.95 });
  }, [sentence]);

  const speakWord = useCallback((word: string) => {
    if (!word) return;
    Speech.speak(word, { language: 'en-IN' });
  }, []);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
          onPress={() => {
            stopDetection();
            router.back();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Sign to Text</Text>
          <Text style={[styles.headerSub, { color: theme.textTertiary }]}>ISL Neural Vision Engine</Text>
        </View>

        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
          onPress={flipCamera}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="camera-reverse-outline" size={20} color={PALETTE.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Camera Viewfinder Box */}
        <View style={[styles.cameraContainer, SHADOWS.md]}>
          {!permission ? (
            <View style={styles.camCenter}>
              <ActivityIndicator color={PALETTE.primary} size="large" />
              <Text style={[styles.permNotice, { color: '#94A3B8' }]}>Initializing camera engine...</Text>
            </View>
          ) : !permission.granted ? (
            <View style={styles.camCenter}>
              <Ionicons name="camera-outline" size={48} color="#94A3B8" style={{ marginBottom: 12 }} />
              <Text style={styles.permNotice}>Camera permission is required for real-time sign detection.</Text>
              <TouchableOpacity style={styles.allowPermBtn} onPress={() => requestPermission()}>
                <Text style={styles.allowPermBtnText}>Grant Camera Access</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <CameraView
                ref={(r) => {
                  cameraRef.current = r;
                }}
                style={StyleSheet.absoluteFill}
                facing={facing}
              />

              {/* Viewfinder Reticle Framing Corners */}
              <View style={styles.reticleOverlay} pointerEvents="none">
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>

              {/* Top HUD overlay */}
              <View style={styles.hudTopBar}>
                <View
                  style={[
                    styles.trackingPill,
                    { backgroundColor: handDetected ? 'rgba(16, 185, 129, 0.85)' : 'rgba(15, 23, 42, 0.75)' },
                  ]}
                >
                  <View style={[styles.statusDot, { backgroundColor: handDetected ? '#fff' : '#EF4444' }]} />
                  <Text style={styles.trackingPillText}>
                    {handDetected ? 'HAND DETECTED' : isDetecting ? 'SEARCHING HAND' : 'STANDBY'}
                  </Text>
                </View>

                {isBusy && (
                  <View style={styles.busyPill}>
                    <ActivityIndicator color="#fff" size="small" style={{ marginRight: 4 }} />
                    <Text style={styles.busyText}>Analyzing</Text>
                  </View>
                )}
              </View>

              {/* Center Guidance Hint when detecting and no hand */}
              {isDetecting && !handDetected && (
                <View style={styles.guidanceBox}>
                  <Text style={styles.guidanceText}>Hold hand steadily inside the frame</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Prediction Card */}
        <View style={[styles.predictionCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <View style={styles.predHeader}>
            <View style={styles.predTagRow}>
              <MaterialCommunityIcons name="hand-wave-outline" size={16} color={PALETTE.primary} />
              <Text style={[styles.predTag, { color: theme.textTertiary }]}>RECOGNIZED SIGN</Text>
            </View>

            {confidence > 0 && (
              <View style={[styles.confidenceBadge, { backgroundColor: 'rgba(14, 165, 233, 0.12)' }]}>
                <Text style={[styles.confidenceText, { color: PALETTE.primary }]}>
                  {Math.round(confidence * 100)}% Match
                </Text>
              </View>
            )}
          </View>

          {prediction ? (
            <View style={styles.predResultRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.predWord, { color: theme.textPrimary }]}>{prediction}</Text>
                {/* Confidence Bar */}
                <View style={[styles.confTrack, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                  <View style={[styles.confBar, { width: `${Math.round(confidence * 100)}%`, backgroundColor: PALETTE.primary }]} />
                </View>
              </View>

              <View style={styles.predActions}>
                <TouchableOpacity
                  style={[styles.audioPillBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }]}
                  onPress={() => speakWord(prediction)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="volume-medium" size={18} color={PALETTE.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.addPillBtn, { backgroundColor: PALETTE.primary }]}
                  onPress={addWord}
                >
                  <Ionicons name="add" size={18} color="#fff" />
                  <Text style={styles.addPillText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.emptyPredBox}>
              <Text style={[styles.emptyPredHint, { color: theme.textTertiary }]}>
                {isDetecting
                  ? 'Perform an Indian Sign Language gesture facing the camera'
                  : 'Press Start Recognition below to begin live analysis'}
              </Text>
            </View>
          )}
        </View>

        {/* Live Sentence Builder */}
        <View style={[styles.sentenceCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <View style={styles.sentenceHeader}>
            <View style={styles.sentenceTitleRow}>
              <Ionicons name="chatbox-ellipses-outline" size={16} color={PALETTE.primary} />
              <Text style={[styles.sentenceHeaderTitle, { color: theme.textPrimary }]}>Constructed Sentence</Text>
            </View>

            {sentence.length > 0 && (
              <View style={styles.sentenceActionRow}>
                <TouchableOpacity style={styles.speakSentenceBtn} onPress={speakSentence}>
                  <Ionicons name="volume-high" size={16} color="#10B981" />
                  <Text style={styles.speakSentenceText}>Speak</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.clearBtn} onPress={clearSentence}>
                  <Text style={[styles.clearBtnText, { color: theme.textTertiary }]}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {sentence.length > 0 ? (
            <View style={styles.chipsContainer}>
              {sentence.map((word, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.wordChip,
                    { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.16)' : '#E0F2FE', borderColor: 'rgba(14, 165, 233, 0.3)' },
                  ]}
                >
                  <Text style={[styles.wordChipText, { color: PALETTE.primaryDark }]}>{word}</Text>
                  <TouchableOpacity
                    onPress={() => removeWordAt(idx)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="close-circle" size={16} color={PALETTE.primary} style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.sentencePlaceholder, { color: theme.textTertiary }]}>
              Words added from detection will build your conversation sentence here.
            </Text>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controlRow}>
          {!isDetecting ? (
            <TouchableOpacity
              style={[styles.mainActionBtn, { backgroundColor: PALETTE.primary }, SHADOWS.md]}
              onPress={() => void startDetection()}
              disabled={!permission?.granted}
              activeOpacity={0.85}
            >
              <Ionicons name="play" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.mainActionBtnText}>Start Live Detection</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.mainActionBtn, { backgroundColor: PALETTE.danger }, SHADOWS.md]}
              onPress={stopDetection}
              activeOpacity={0.85}
            >
              <Ionicons name="stop" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.mainActionBtnText}>Pause Detection</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  cameraContainer: {
    width: '100%',
    height: 320,
    backgroundColor: '#000',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  camCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permNotice: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  allowPermBtn: {
    backgroundColor: PALETTE.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
  },
  allowPermBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  reticleOverlay: {
    ...StyleSheet.absoluteFillObject,
    margin: 28,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#38BDF8',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  hudTopBar: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  trackingPillText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  busyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  busyText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  guidanceBox: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  guidanceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  predictionCard: {
    borderRadius: RADIUS.xl,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  predHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  predTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  predTag: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
  },
  predResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  predWord: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  confTrack: {
    height: 5,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    width: '90%',
  },
  confBar: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  predActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioPillBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: RADIUS.full,
  },
  addPillText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyPredBox: {
    paddingVertical: 12,
  },
  emptyPredHint: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  sentenceCard: {
    borderRadius: RADIUS.xl,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
    minHeight: 100,
  },
  sentenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sentenceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sentenceHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  sentenceActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  speakSentenceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  speakSentenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  clearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  wordChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sentencePlaceholder: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  controlRow: {
    gap: 12,
  },
  mainActionBtn: {
    height: 54,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainActionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
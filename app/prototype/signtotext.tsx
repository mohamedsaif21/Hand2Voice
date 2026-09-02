/**
 * Hand2Voice — Sign to Text screen
 * ==================================
 * Opens the front camera, sends a frame every 900 ms to the Python backend,
 * and displays the detected ISL sign as text in real time.
 *
 * Backend URL:  set EXPO_PUBLIC_SIGN_API_URL in your .env
 *               e.g. EXPO_PUBLIC_SIGN_API_URL=http://192.168.1.10:8000
 *               (replace with your laptop's local IP address)
 */

import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// ─── types ────────────────────────────────────────────────────────────────────

interface PredictResponse {
  label: string;
  confidence: number;
  hand_detected: boolean;
}

// ─── constants ────────────────────────────────────────────────────────────────

const POLL_MS         = 900;   // how often we send a frame (ms)
const MIN_CONFIDENCE  = 0.65;  // ignore predictions below this threshold

// ─── component ────────────────────────────────────────────────────────────────

export default function SignToText() {
  const router                            = useRouter();
  const [permission, requestPermission]   = useCameraPermissions();
  const cameraRef                         = useRef<CameraView | null>(null);

  // detection state
  const [isDetecting,   setIsDetecting]   = useState(false);
  const [isBusy,        setIsBusy]        = useState(false);
  const [prediction,    setPrediction]    = useState('');
  const [confidence,    setConfidence]    = useState(0);
  const [handDetected,  setHandDetected]  = useState(false);
  const [sentence,      setSentence]      = useState<string[]>([]);
  const [facing,        setFacing]        = useState<'front' | 'back'>('front');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Read API URL from env (set in .env file at project root)
  const apiUrl = useMemo(
    () => process.env.EXPO_PUBLIC_SIGN_API_URL ?? 'http://10.0.2.2:8000',
    [],
  );

  // ── cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => () => stopDetection(), []);

  // ── stop detection ───────────────────────────────────────────────────────
  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
    setIsBusy(false);
    setHandDetected(false);
  }, []);

  // ── send one frame to server ─────────────────────────────────────────────
  const sendFrame = useCallback(async () => {
    if (isBusy || !cameraRef.current || !permission?.granted) return;
    setIsBusy(true);

    try {
      const photo = await (cameraRef.current as any).takePictureAsync?.({
        base64:          true,
        quality:         0.25,   // low quality = faster upload
        skipProcessing:  true,
      });

      if (!photo?.base64) return;

      const res = await fetch(`${apiUrl.replace(/\/$/, '')}/predict`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ image_base64: photo.base64 }),
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
      // Silently ignore network errors — keeps last prediction visible
    } finally {
      setIsBusy(false);
    }
  }, [apiUrl, isBusy, permission?.granted]);

  // ── start detection ──────────────────────────────────────────────────────
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

  // ── add current prediction to sentence ──────────────────────────────────
  const addWord = useCallback(() => {
    if (prediction) setSentence(prev => [...prev, prediction]);
  }, [prediction]);

  const clearSentence = useCallback(() => setSentence([]), []);

  // ── camera flip ──────────────────────────────────────────────────────────
  const flipCamera = useCallback(
    () => setFacing(f => (f === 'front' ? 'back' : 'front')),
    [],
  );

  // ─── render ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => { stopDetection(); router.back(); }}
          hitSlop={12}
        >
          <Text style={styles.iconBtnText}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Sign → Text</Text>

        <Pressable style={styles.iconBtn} onPress={flipCamera} hitSlop={12}>
          <Text style={styles.iconBtnText}>⇄</Text>
        </Pressable>
      </View>

      {/* ── Camera ── */}
      <View style={styles.cameraBox}>
        {!permission ? (
          <View style={styles.center}>
            <ActivityIndicator color="#fff" />
          </View>

        ) : !permission.granted ? (
          <View style={styles.center}>
            <Text style={styles.permText}>Camera permission needed</Text>
            <Pressable style={styles.permBtn} onPress={() => requestPermission()}>
              <Text style={styles.permBtnText}>Allow camera</Text>
            </Pressable>
          </View>

        ) : (
          <CameraView
            ref={r => { cameraRef.current = r; }}
            style={StyleSheet.absoluteFill}
            facing={facing}
          />
        )}

        {/* Hand-detected indicator dot */}
        <View style={[styles.dot, { backgroundColor: handDetected ? '#22c55e' : '#ef4444' }]} />

        {/* Busy spinner overlay */}
        {isBusy && (
          <View style={styles.busyOverlay}>
            <ActivityIndicator color="#fff" size="small" />
          </View>
        )}
      </View>

      {/* ── Prediction card ── */}
      <View style={styles.predictionCard}>
        {prediction ? (
          <>
            <Text style={styles.predictionSign}>{prediction}</Text>
            <Text style={styles.predictionConf}>{Math.round(confidence * 100)}% confident</Text>
          </>
        ) : (
          <Text style={styles.predictionHint}>
            {isDetecting
              ? handDetected
                ? 'Reading sign…'
                : 'Show your hand to the camera'
              : 'Press Start to begin detection'}
          </Text>
        )}
      </View>

      {/* ── Sentence builder ── */}
      <View style={styles.sentenceRow}>
        <Text style={styles.sentenceText} numberOfLines={2}>
          {sentence.length > 0 ? sentence.join(' ') : 'Built sentence appears here'}
        </Text>
        {sentence.length > 0 && (
          <Pressable onPress={clearSentence} hitSlop={8}>
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* ── Controls ── */}
      <View style={styles.controls}>

        {/* Start / Stop */}
        {!isDetecting ? (
          <Pressable
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => void startDetection()}
            disabled={!permission?.granted}
          >
            <Text style={styles.btnText}>▶  Start</Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.btn, styles.btnDanger]} onPress={stopDetection}>
            <Text style={styles.btnText}>■  Stop</Text>
          </Pressable>
        )}

        {/* Add word to sentence */}
        <Pressable
          style={[styles.btn, styles.btnSecondary, !prediction && styles.btnDisabled]}
          onPress={addWord}
          disabled={!prediction}
        >
          <Text style={styles.btnText}>+ Add word</Text>
        </Pressable>

      </View>

    </SafeAreaView>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const BLUE = '#13a4ec';

const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },
  iconBtn: {
    width: 40,
    alignItems: 'center',
  },
  iconBtnText: {
    fontSize: 22,
    color: BLUE,
  },

  // camera
  cameraBox: {
    width: '100%',
    height: 340,
    backgroundColor: '#111',
    position: 'relative',
    overflow: 'hidden',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  busyOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 12,
  },
  permText: {
    color: '#ccc',
    marginBottom: 12,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  permBtn: {
    backgroundColor: BLUE,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
  },
  permBtnText: {
    color: '#fff',
    fontWeight: '600',
  },

  // prediction
  predictionCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#e0f4ff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minHeight: 90,
    justifyContent: 'center',
  },
  predictionSign: {
    fontSize: 40,
    fontWeight: '800',
    color: '#0369a1',
    letterSpacing: 1,
  },
  predictionConf: {
    marginTop: 4,
    fontSize: 13,
    color: '#0ea5e9',
  },
  predictionHint: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },

  // sentence
  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sentenceText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  clearText: {
    fontSize: 16,
    color: '#9ca3af',
    paddingLeft: 8,
  },

  // controls
  controls: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary:   { backgroundColor: BLUE },
  btnDanger:    { backgroundColor: '#ef4444' },
  btnSecondary: { backgroundColor: '#0284c7' },
  btnDisabled:  { opacity: 0.4 },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
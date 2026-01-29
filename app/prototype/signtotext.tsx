import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { useResizePlugin } from 'vision-camera-resize-plugin';

// Sign language labels - adjust based on your model
const LABELS = [
  'Hello', 'Thank you', 'Yes', 'No', 'Please', 'Sorry', 'Help', 'Water', 'Food', 'Bathroom',
  'Good morning', 'Good night', 'How are you', 'I love you', 'More', 'Done', 'Stop'
];

export default function SignToText() {
  const router = useRouter();
  const [prediction, setPrediction] = useState('');
  const device = useCameraDevice('front');
  const resizePlugin = useResizePlugin();
  const lastPredictionTime = useRef({ value: 0 });
  const currentPrediction = useRef({ value: '' });

  // Initialize model (adjust path as needed)
  // Replace with your actual model path
  const model = useTensorflowModel(
    // Example: require('../../assets/model.tflite')
    // Or: { url: 'https://your-server.com/model.tflite' }
    { url: '' }, // Placeholder - update with your model path
    'default'
  );

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    
    if (model.state !== 'loaded' || !model.model) return;
    
    const now = Date.now();
    // Throttle predictions to avoid overwhelming the UI
    if (now - lastPredictionTime.current.value < 500) return;
    lastPredictionTime.current.value = now;

    try {
      // Resize frame to 128x128 as expected by the model
      const resized = resizePlugin.resize(frame, {
        scale: {
          width: 128,
          height: 128,
        },
        pixelFormat: 'rgb',
        dataType: 'float32',
      });

      // Run Inference
      const output = model.model.runSync([resized] as any[]);

      // Assuming output is a list of probabilities
      const probabilities = output[0];

      if (probabilities) {
        let maxIndex = 0;
        let maxVal = -1;
        const probs = probabilities as any;
        for (let i = 0; i < probs.length; i++) {
          const val = Number(probs[i]);
          if (val > maxVal) {
            maxVal = val;
            maxIndex = i;
          }
        }

        if (maxIndex < LABELS.length) {
          currentPrediction.current.value = LABELS[maxIndex];
          Worklets.createRunOnJS(setPrediction)(LABELS[maxIndex]);
        }
      }
    } catch (e) {
      console.error("Inference error:", e);
    }
  }, [model]);

  if (device == null) return <View style={styles.center}><Text>No Device Found</Text></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7f8' }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/prototype/translation Mode')}
        >
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign Language Translation</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.cameraContainer}>
        <Camera
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.predictionBubble}>
          <Text style={styles.predictionLabel}>Detected:</Text>
          <Text style={styles.predictionText}>{prediction || 'No sign detected'}</Text>
        </View>

        <View style={styles.controls}>
          <Pressable
            style={styles.stopButton}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Stop</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  backButton: { width: 40, alignItems: 'flex-start' },
  headerTitle: { flex: 1, textAlign: 'center', fontWeight: '700' },
  cameraContainer: { width: '100%', height: 400, backgroundColor: '#000', position: 'relative' },
  overlay: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 8 },
  overlayText: { color: '#fff' },
  footer: { padding: 12, alignItems: 'center' },
  predictionBubble: { backgroundColor: '#e6f6ff', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20, width: '80%' },
  predictionLabel: { color: '#0ea5e9', fontSize: 14 },
  predictionText: { color: '#0ea5e9', fontSize: 32, fontWeight: 'bold' },
  controls: { flexDirection: 'row', gap: 8, width: '100%' },
  stopButton: { flex: 1, height: 48, borderRadius: 999, backgroundColor: '#13a4ec', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' }
});

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';


export default function SignToText() {
  const router = useRouter();
  const [prediction, setPrediction] = useState('');
  const device = useCameraDevice('front');



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

import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, Text, TouchableOpacity, View } from 'react-native';

export default function SignToText() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const startCamera = () => {
    if (!permission?.granted) {
      Alert.alert('Camera Permission', 'Camera permission is required to use this feature.');
      return;
    }
    setIsCameraActive(true);
  };

  const stopCamera = () => {
    setIsCameraActive(false);
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7f8' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
        <TouchableOpacity 
          style={{ width: 40, alignItems: 'flex-start' }}
          onPress={() => router.push('/prototype/translation Mode')}
        >
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: '700' }}>Sign Language Translation</Text>
        <View style={{ width: 48 }} />
      </View>
      <View style={{ width: '100%', height: 220, backgroundColor: '#000', position: 'relative' }}>
        {isCameraActive && permission?.granted ? (
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing={facing}
          >
            <View style={{ 
              position: 'absolute', 
              top: 10, 
              right: 10, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              borderRadius: 20, 
              padding: 8 
            }}>
              <TouchableOpacity onPress={toggleCameraFacing}>
                <Text style={{ color: 'white', fontSize: 12 }}>Flip</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        ) : (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#f0f0f0' 
          }}>
            <TouchableOpacity 
              onPress={startCamera}
              style={{ 
                backgroundColor: '#13a4ec', 
                paddingHorizontal: 20, 
                paddingVertical: 10, 
                borderRadius: 20 
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>
                {permission?.granted ? 'Start Camera' : 'Grant Camera Permission'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={{ padding: 12 }}>
        <View style={{ backgroundColor: '#e6f6ff', padding: 8, borderRadius: 999, alignSelf: 'center', marginBottom: 8 }}>
          <Text style={{ color: '#0ea5e9' }}>Translating...</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable 
            style={{ flex: 1, height: 48, borderRadius: 999, backgroundColor: '#13a4ec', alignItems: 'center', justifyContent: 'center' }}
            onPress={stopCamera}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Stop</Text>
          </Pressable>
          <Pressable 
            style={{ flex: 1, height: 48, borderRadius: 999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => router.push('/prototype/settings')}
          >
            <Text>Settings</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

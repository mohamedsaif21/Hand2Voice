import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TextToSign() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: '#f6f7f8' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
        <TouchableOpacity 
          style={{ width: 40, alignItems: 'flex-start' }}
          onPress={() => router.push('/prototype/translation Mode')}
        >
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: '700' }}>Text to Sign</Text>
        <View style={{ width: 48 }} />
      </View>
      <TextInput placeholder="Enter text to convert" style={{ height: 120, backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 12 }} multiline />
      <Pressable style={{ height: 48, backgroundColor: '#13a4ec', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Convert</Text>
      </Pressable>
    </View>
  );
}

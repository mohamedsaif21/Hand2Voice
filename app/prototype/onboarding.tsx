import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export default function Onboarding() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7f8', justifyContent: 'space-between' }}>
     
      <View style={{ flex: 1 }}>
        <Image
          source={require('../../assets/images/Hand2voice.png')}
          style={{ width: '100%', height: 360 }}
          resizeMode="cover"
        />
      </View>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 8 }}>Speak Freely, Sign Fluently</Text>
        <Text style={{ fontSize: 16, color: '#475569', marginBottom: 16 }}>Break down communication barriers with real-time translation between spoken and sign languages.</Text>
        <Pressable 
          style={{ height: 56, backgroundColor: '#13a4ec', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}
          onPress={() => router.push('/prototype/translation Mode')}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Get Started</Text>
        </Pressable>
        <Pressable style={{ height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 0 }}>
          <Text style={{ color: '#0ea5e9', fontWeight: '700' }}>Learn More</Text>
        </Pressable>
      </View>
    </View>
  );
}
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';

export default function SignToText() {
  const router = useRouter();
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
      <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACaTaWIFoG0DSvA6ZLxjNJDhHbR9BpklLk94wZpbsrYibsd265nCAEC_d9YG32Kymnjl-HcyP1ituOLcqYY0wZqXs-xKA94YoxsYXf3KXRfYjeFxjAYupLGC9S8XH9z3L50pQqfxoql_I-KmBs-T3DIl5TdhnCjovsLjpdT4ykhW-6N5PgL2ctzLzi62gu2ew-aEFu-7whea8wE75SHDvEKm13RXmiLAdaonpg2uUJRTcyJcY_lk26OWRdSDfVGj2mUaB1G2vfsUw' }} style={{ width: '100%', height: 220 }} />
      <View style={{ padding: 12 }}>
        <View style={{ backgroundColor: '#e6f6ff', padding: 8, borderRadius: 999, alignSelf: 'center', marginBottom: 8 }}>
          <Text style={{ color: '#0ea5e9' }}>Translating...</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable style={{ flex: 1, height: 48, borderRadius: 999, backgroundColor: '#13a4ec', alignItems: 'center', justifyContent: 'center' }}>
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

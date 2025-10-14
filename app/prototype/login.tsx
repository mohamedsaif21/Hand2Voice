import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f6f7f8', justifyContent: 'center' }}>
      <View style={{ maxWidth: 360, alignSelf: 'center', width: '100%' }}>
        <Text style={{ fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8, color: '#0f172a' }}>Welcome to SignSpeak</Text>
        <Text style={{ textAlign: 'center', color: '#64748b', marginBottom: 16 }}>Your bridge to seamless communication. Sign in or create an account to start translating.</Text>
        <TextInput placeholder="Email" style={{ height: 56, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, marginBottom: 12 }} />
        <TextInput placeholder="Password" secureTextEntry style={{ height: 56, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, marginBottom: 12 }} />
        <Pressable 
          style={{ height: 56, backgroundColor: '#13a4ec', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => router.push('/prototype/onboarding')}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Sign In</Text>
        </Pressable>
  <Text style={{ textAlign: 'center', marginTop: 12, color: '#64748b' }}>Don't have an account? <TouchableOpacity onPress={() => router.push('/prototype/onboarding')}><Text style={{ color: '#0ea5e9' }}>Sign Up</Text></TouchableOpacity></Text>
      </View>
    </View>
  );
}

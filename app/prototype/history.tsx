import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function History() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f6f7f8' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity 
          style={{ width: 40, alignItems: 'flex-start' }}
          onPress={() => router.push('/prototype/translation Mode')}
        >
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: '700' }}>History</Text>
        <View style={{ width: 40 }} />
      </View>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>History</Text>
    </View>
  );
}

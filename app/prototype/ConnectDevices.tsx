import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

interface Device {
  id: string;
  name: string;
  status: string;
  icon: string;
  type: 'ar' | 'bluetooth';
}

const DeviceItem: React.FC<{ device: Device; onPress: () => void; isDark: boolean; colors: any }> = ({ device, onPress, isDark, colors }) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? colors.cardDark : colors.cardLight,
      borderRadius: 8,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? colors.borderDark : colors.borderLight,
      marginBottom: 12,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
        <Text style={{ fontSize: 24 }}>{device.type === 'ar' ? '👓' : '🔵'}</Text>
        <View>
          <Text style={{
            fontSize: 16,
            fontWeight: '500',
            color: isDark ? colors.foregroundDark : colors.foregroundLight,
          }}>{device.name}</Text>
          <Text style={{
            fontSize: 14,
            color: isDark ? colors.subtleDark : colors.subtleLight,
          }}>{device.status}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onPress} style={{
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
      }}>
        <Text style={{
          color: '#ffffff',
          fontSize: 14,
          fontWeight: '600',
        }}>Pair</Text>
      </TouchableOpacity>
    </View>
  );
};

const ConnectDevices = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [isSearching] = useState(true);

  const colors = {
    primary: '#13a4ec',
    backgroundLight: '#f6f7f8',
    backgroundDark: '#101c22',
    foregroundLight: '#111827',
    foregroundDark: '#f9fafb',
    cardLight: '#ffffff',
    cardDark: '#1f2937',
    subtleLight: '#6b7280',
    subtleDark: '#9ca3af',
    borderLight: '#e5e7eb',
    borderDark: '#374151',
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight,
    },
    header: {
      backgroundColor: isDark ? colors.cardDark : colors.cardLight,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? colors.borderDark : colors.borderLight,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? colors.foregroundDark : colors.foregroundLight,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    heroSection: {
      backgroundColor: isDark ? colors.cardDark : colors.cardLight,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? colors.borderDark : colors.borderLight,
      width: '100%',
      aspectRatio: 16 / 9,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      overflow: 'hidden',
    },
    heroIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    heroText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? colors.foregroundDark : colors.foregroundLight,
      textAlign: 'center',
    },
    statusCard: {
      backgroundColor: isDark ? colors.cardDark : colors.cardLight,
      borderRadius: 8,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? colors.borderDark : colors.borderLight,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    statusIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '600',
      color: isDark ? colors.subtleDark : colors.subtleLight,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    statusValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? colors.foregroundDark : colors.foregroundLight,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
      color: isDark ? colors.foregroundDark : colors.foregroundLight,
    },
    helpSection: {
      marginTop: 24,
      borderTopWidth: 1,
      borderTopColor: isDark ? colors.borderDark : colors.borderLight,
      paddingTop: 16,
    },
    helpItem: {
      backgroundColor: isDark ? colors.cardDark : colors.cardLight,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: isDark ? colors.borderDark : colors.borderLight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    helpItemText: {
      fontSize: 14,
      color: isDark ? colors.foregroundDark : colors.foregroundLight,
      fontWeight: '500',
    },
  });

  const availableDevices: Device[] = [
    { id: '1', name: 'VisionPro AR - 1029', status: 'Ready to pair', icon: '👓', type: 'ar' },
    { id: '2', name: 'SignConnect G2', status: 'Bluetooth LE', icon: '🔵', type: 'bluetooth' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connect Devices</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Video
            source={require('../../assets/video/glass.mp4')}
            shouldPlay
            isMuted
            isLooping={true}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            style={StyleSheet.absoluteFillObject}
            onError={(error) => console.log('Video error:', error)}
          />
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconContainer}>
            <Text style={{ fontSize: 24 }}>📡</Text>
          </View>
          <View>
            <Text style={styles.statusText}>Status</Text>
            <Text style={styles.statusValue}>{isSearching ? 'Searching...' : 'Idle'}</Text>
          </View>
        </View>

        {/* Available Devices */}
        <Text style={styles.sectionTitle}>Available Devices ({availableDevices.length})</Text>
        {availableDevices.map((device) => (
          <DeviceItem 
            key={device.id}
            device={device}
            isDark={isDark}
            colors={colors}
            onPress={() => {/* Handle pairing */}}
          />
        ))}

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.sectionTitle}>Help & Troubleshooting</Text>
          <TouchableOpacity style={styles.helpItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 20 }}>❓</Text>
              <Text style={styles.helpItemText}>Can&apos;t see my device?</Text>
            </View>
            <Text style={{ fontSize: 20 }}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 20 }}>📖</Text>
              <Text style={styles.helpItemText}>Setup Guide</Text>
            </View>
            <Text style={{ fontSize: 20 }}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConnectDevices;
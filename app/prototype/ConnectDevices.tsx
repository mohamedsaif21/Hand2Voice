import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PALETTE, RADIUS, SHADOWS } from '../theme';

interface DeviceItem {
  id: string;
  name: string;
  type: 'glasses' | 'glove' | 'beacon';
  status: 'connected' | 'ready' | 'nearby';
  battery: number;
  signalStrength: number; // percentage
  latency: string;
}

const INITIAL_DEVICES: DeviceItem[] = [
  {
    id: '1',
    name: 'VisionPro AR - 1029',
    type: 'glasses',
    status: 'ready',
    battery: 86,
    signalStrength: 95,
    latency: '12 ms',
  },
  {
    id: '2',
    name: 'SignConnect Haptic G2',
    type: 'glove',
    status: 'ready',
    battery: 92,
    signalStrength: 82,
    latency: '18 ms',
  },
  {
    id: '3',
    name: 'AuraLink Smart Glass V3',
    type: 'glasses',
    status: 'nearby',
    battery: 64,
    signalStrength: 60,
    latency: '24 ms',
  },
];

export default function ConnectDevicesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  const [devices, setDevices] = useState<DeviceItem[]>(INITIAL_DEVICES);
  const [isScanning, setIsScanning] = useState(false);

  const toggleConnect = (id: string) => {
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === id) {
          const isConnected = dev.status === 'connected';
          return { ...dev, status: isConnected ? 'ready' : 'connected' };
        }
        return dev;
      }),
    );
  };

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      Alert.alert('Scan Complete', 'All active Bluetooth Low Energy AR devices refreshed.');
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Connect Devices</Text>
          <Text style={[styles.headerSub, { color: theme.textTertiary }]}>AR Glasses & Wearables Bridge</Text>
        </View>

        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
          onPress={handleRescan}
        >
          {isScanning ? (
            <ActivityIndicator size="small" color={PALETTE.primary} />
          ) : (
            <Ionicons name="refresh" size={18} color={PALETTE.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hardware Video Showcase */}
        <View style={[styles.heroCard, { backgroundColor: '#000' }, SHADOWS.md]}>
          <Video
            source={require('../../assets/video/glass.mp4')}
            shouldPlay
            isMuted
            isLooping
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadge}>
              <View style={[styles.pulseDot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.heroBadgeText}>AR OPTICAL ENGINE READY</Text>
            </View>
            <View style={styles.heroBottomText}>
              <Text style={styles.heroTitle}>SignLink Smart Eyewear</Text>
              <Text style={styles.heroSub}>Subtitles & gesture captions projected directly into your field of view.</Text>
            </View>
          </View>
        </View>

        {/* Discovery Radar Status */}
        <View style={[styles.statusCard, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <View style={[styles.radarIconBox, { backgroundColor: 'rgba(14, 165, 233, 0.12)' }]}>
            <MaterialCommunityIcons name="radar" size={26} color={PALETTE.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.radarHeader}>
              <Text style={[styles.radarTitle, { color: theme.textPrimary }]}>Bluetooth LE Discovery</Text>
              <Text style={[styles.radarFreq, { color: PALETTE.primary }]}>2.4 GHz Ultra-low</Text>
            </View>
            <Text style={[styles.radarSub, { color: theme.textTertiary }]}>
              {isScanning ? 'Scanning nearby frequency channels...' : 'Listening for wearable peripheral beacons...'}
            </Text>
          </View>
        </View>

        {/* Available Devices List */}
        <View style={styles.devicesSection}>
          <View style={styles.sectionTitleRow}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Available Hardware ({devices.length})
            </Text>
            <TouchableOpacity onPress={handleRescan}>
              <Text style={[styles.rescanText, { color: PALETTE.primary }]}>Rescan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.devicesList}>
            {devices.map((device) => {
              const isConnected = device.status === 'connected';

              return (
                <View
                  key={device.id}
                  style={[
                    styles.deviceCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: isConnected ? '#10B981' : theme.border,
                    },
                    isConnected && { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : '#F0FDF4' },
                    SHADOWS.sm,
                  ]}
                >
                  <View style={styles.deviceCardTop}>
                    <View style={styles.deviceInfoLeft}>
                      <View
                        style={[
                          styles.deviceTypeIcon,
                          {
                            backgroundColor: isConnected
                              ? 'rgba(16, 185, 129, 0.16)'
                              : isDark
                              ? '#1E293B'
                              : '#F1F5F9',
                          },
                        ]}
                      >
                        <Ionicons
                          name={device.type === 'glasses' ? 'glasses-outline' : 'hand-left-outline'}
                          size={22}
                          color={isConnected ? '#10B981' : PALETTE.primary}
                        />
                      </View>
                      <View style={{ flex: 1, marginRight: 6 }}>
                        <Text numberOfLines={1} style={[styles.deviceName, { color: theme.textPrimary }]}>{device.name}</Text>
                        <View style={styles.telemetryRow}>
                          <Text numberOfLines={1} style={[styles.telemetryText, { color: theme.textTertiary }]}>
                            🔋 {device.battery}% • 📶 {device.signalStrength}% • ⚡ {device.latency}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.pairBtn,
                        {
                          backgroundColor: isConnected ? '#10B981' : PALETTE.primary,
                        },
                      ]}
                      onPress={() => toggleConnect(device.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.pairBtnText}>{isConnected ? 'Connected' : 'Pair Device'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Features & Help Section */}
        <View style={[styles.guideBox, { backgroundColor: theme.card, borderColor: theme.border }, SHADOWS.sm]}>
          <Text style={[styles.guideTitle, { color: theme.textPrimary }]}>Device Setup & FAQ</Text>

          <View style={styles.faqItem}>
            <Ionicons name="bluetooth" size={18} color={PALETTE.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.faqQ, { color: theme.textPrimary }]}>How do I turn on pairing mode?</Text>
              <Text style={[styles.faqA, { color: theme.textTertiary }]}>
                Hold the power button on the right frame temple for 3 seconds until the blue LED begins pulsing.
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

          <View style={styles.faqItem}>
            <Ionicons name="sparkles" size={18} color="#8B5CF6" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.faqQ, { color: theme.textPrimary }]}>Heads-up Subtitle Projection</Text>
              <Text style={[styles.faqA, { color: theme.textTertiary }]}>
                Once connected, signs recognized by the camera will stream live directly into your lens HUD.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  headerSub: { fontSize: 11, fontWeight: '600' },
  scrollContent: { padding: 16, paddingBottom: 40, gap: 16 },
  heroCard: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    justifyContent: 'space-between',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  pulseDot: { width: 6, height: 6, borderRadius: 3 },
  heroBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
  heroBottomText: { gap: 4 },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, lineHeight: 16 },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: 12,
  },
  radarIconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radarTitle: { fontSize: 14, fontWeight: '700' },
  radarFreq: { fontSize: 11, fontWeight: '700' },
  radarSub: { fontSize: 12, marginTop: 2 },
  devicesSection: { gap: 10 },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  rescanText: { fontSize: 13, fontWeight: '700' },
  devicesList: { gap: 10 },
  deviceCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 16,
  },
  deviceCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  deviceInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  deviceTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceName: { fontSize: 15, fontWeight: '700' },
  telemetryRow: { marginTop: 2 },
  telemetryText: { fontSize: 11, fontWeight: '500' },
  pairBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  pairBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  guideBox: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  guideTitle: { fontSize: 15, fontWeight: '800' },
  faqItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  faqQ: { fontSize: 13, fontWeight: '700' },
  faqA: { fontSize: 12, marginTop: 2, lineHeight: 17 },
  divider: { height: 1, width: '100%' },
});
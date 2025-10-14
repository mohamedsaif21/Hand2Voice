import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

// Icon components - you'll need to install react-native-vector-icons or similar
// For this example, I'm using placeholder View components
const Icon = ({ name, size = 24, color = '#000' }: { name: string; size?: number; color?: string }) => (
  <View style={{ width: size, height: size, backgroundColor: color, borderRadius: (size ?? 24) / 2 }} />
);

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isDark = colorScheme === 'dark';

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
    backButton: {
      padding: 8,
    },
    content: {
      flex: 1,
    },
    profileSection: {
      alignItems: 'center',
      paddingVertical: 32,
      gap: 16,
    },
    avatar: {
      width: 128,
      height: 128,
      borderRadius: 64,
    },
    profileName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? colors.foregroundDark : colors.foregroundLight,
    },
    profileJoined: {
      fontSize: 14,
      color: isDark ? colors.subtleDark : colors.subtleLight,
    },
    section: {
      marginBottom: 24,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      paddingHorizontal: 4,
      color: isDark ? colors.foregroundDark : colors.foregroundLight,
    },
    card: {
      backgroundColor: isDark ? colors.cardDark : colors.cardLight,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? colors.borderDark : colors.borderLight,
      overflow: 'hidden',
    },
    cardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    cardItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? colors.borderDark : colors.borderLight,
    },
    cardItemLeft: {
      flex: 1,
      gap: 4,
    },
    cardItemTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? colors.foregroundDark : colors.foregroundLight,
    },
    cardItemSubtitle: {
      fontSize: 14,
      color: isDark ? colors.subtleDark : colors.subtleLight,
    },
    cardItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    cardItemRightText: {
      fontSize: 14,
      color: isDark ? colors.subtleDark : colors.subtleLight,
    },
    footer: {
      backgroundColor: isDark ? colors.cardDark : colors.cardLight,
      borderTopWidth: 1,
      borderTopColor: isDark ? colors.borderDark : colors.borderLight,
      paddingHorizontal: 16,
    },
    footerNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      height: 80,
    },
    footerButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    footerButtonText: {
      fontSize: 12,
      fontWeight: '500',
      marginTop: 4,
    },
    footerButtonActive: {
      color: colors.primary,
    },
    footerButtonInactive: {
      color: isDark ? colors.subtleDark : colors.subtleLight,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/prototype/translation Mode')}
        >
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfA5bLxb8HqN-UJZsS81AlLoMHSWyuKZ1EQvZzB4GFZU2Ju0OPxGpdYBBP8JsuG6yL9r-tqBJ0QJnP1By0CM22vIVH9Z7srSk1UMnHLhR7x2p4vvBEzstYi-cmxwQR8gsuZ2BaNZ62XQimxYX7Hs1iPdZ12ykSXsm6KPOtAnwYVw45V8urHydmolxunaGRn7_5TShQNXMpApEfCloxD4rnCWGqgE0sBLq2hDqrxOquwHwWoCVo4T3J3XYD5oGPYr8I5xbmOrsrsQI' }}
            style={styles.avatar}
          />
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.profileName}>Hand2voice Team</Text>
            <Text style={styles.profileJoined}>Joined in 2022</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <View style={[styles.cardItem, styles.cardItemBorder]}>
              <View style={styles.cardItemLeft}>
                <Text style={styles.cardItemTitle}>Email</Text>
                <Text style={styles.cardItemSubtitle}>hand2voice@gmail.com</Text>
              </View>
              <TouchableOpacity>
                <Text style={{ fontSize: 20 }}>✏️</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardItem}>
              <View style={styles.cardItemLeft}>
                <Text style={styles.cardItemTitle}>Password</Text>
                
              </View>
              <TouchableOpacity>
                <Text style={{ fontSize: 20 }}>✏️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.cardItem}
              onPress={() => router.push('/prototype/history')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 }}>
                <Text style={{ fontSize: 24, color: colors.primary }}>📊</Text>
                <Text style={styles.cardItemTitle}>Translation History</Text>
              </View>
              <Text style={{ fontSize: 20 }}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <View style={[styles.cardItem, styles.cardItemBorder]}>
              <Text style={[styles.cardItemTitle, { flex: 1 }]}>Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
            <TouchableOpacity 
              style={[styles.cardItem, styles.cardItemBorder]}
            >
              <Text style={[styles.cardItemTitle, { flex: 1 }]}>Privacy</Text>
              <Text style={{ fontSize: 20, color: isDark ? colors.subtleDark : colors.subtleLight }}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cardItem}
            >
              <Text style={[styles.cardItemTitle, { flex: 1 }]}>Language</Text>
              <View style={styles.cardItemRight}>
                <Text style={styles.cardItemRightText}>English</Text>
                <Text style={{ fontSize: 20, color: isDark ? colors.subtleDark : colors.subtleLight }}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <View style={styles.footerNav}>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => router.push('/prototype/translation Mode')}
          >
            <Text style={{ fontSize: 24 }}>🏠</Text>
            <Text style={[styles.footerButtonText, styles.footerButtonInactive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => router.push('/prototype/signdetails')}
          >
            <Text style={{ fontSize: 24 }}>🎓</Text>
            <Text style={[styles.footerButtonText, styles.footerButtonInactive]}>Learn</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => router.push('/prototype/settings')}
          >
            <Text style={{ fontSize: 24 }}>⚙️</Text>
            <Text style={[styles.footerButtonText, styles.footerButtonInactive]}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Text style={{ fontSize: 24 }}>👤</Text>
            <Text style={[styles.footerButtonText, styles.footerButtonActive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
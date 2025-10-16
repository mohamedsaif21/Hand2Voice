import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ImageBackground, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function TranslationModeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isDark = colorScheme === 'dark';

  const colors = {
    primary: '#13a4ec',
    backgroundLight: '#f6f7f8',
    backgroundDark: '#101c22',
    white: '#ffffff',
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: isDark ? colors.backgroundDark : colors.backgroundLight },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
    backButton: { width: 40 },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: isDark ? colors.backgroundLight : colors.backgroundDark },
    profileButton: { width: 40, alignItems: 'flex-end' },
    content: { flex: 1, paddingHorizontal: 16 },
    card: { backgroundColor: isDark ? 'rgba(16, 28, 34, 0.5)' : colors.backgroundLight, borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
    imageContainer: { position: 'relative', width: '100%', aspectRatio: 16 / 10 },
    cardImage: { width: '100%', height: '100%' },
    gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%' },
    cardContent: { padding: 20 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: isDark ? colors.backgroundLight : colors.backgroundDark },
    cardDescription: { fontSize: 14, lineHeight: 20, color: isDark ? 'rgba(246, 247, 248, 0.6)' : 'rgba(16, 28, 34, 0.6)', marginBottom: 16 },
    primaryButton: { width: '100%', height: 48, backgroundColor: colors.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
    secondaryButton: { width: '100%', height: 48, backgroundColor: isDark ? 'rgba(19,164,236,0.3)' : 'rgba(19,164,236,0.2)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    secondaryButtonText: { color: colors.primary, fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
    footer: {
      backgroundColor: isDark ? 'rgba(16,28,34,0.9)' : '#fff',
      borderTopWidth: 1,
      borderTopColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(16,28,34,0.06)',
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    footerNav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: 72,
      width: '100%',
    },
    footerButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      minWidth: 80,
    },
    footerButtonCenter: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
      minWidth: 80,
    },
    footerIcon: { fontSize: 24 },
    footerIconCenter: { fontSize: 36, marginTop: -8 },
    footerLabel: { fontSize: 12, marginTop: 4, color: isDark ? 'rgba(246,247,248,0.7)' : 'rgba(16,28,34,0.7)' },
    footerLabelActive: { fontSize: 12, marginTop: 4, color: colors.primary, fontWeight: '700' },
  });

  return (
    <>
      {/* 👇 ADD THIS TO CONTROL HEADER */}
      <Stack.Screen
        // Option A: hide the Expo Router header completely
        // options={{ headerShown: false }}

        // Option B: show a clean title
        options={{ title: 'Translation Mode' }}
      />

      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/prototype/onboarding')}
        >
          <Text style={{ fontSize: 24, color: isDark ? colors.backgroundLight : colors.backgroundDark }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Translation Mode</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/prototype/profile')}
        >
          <Text style={{ fontSize: 28 }}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <ImageBackground source={require('../../assets/images/Sign to Text.jpg')} style={styles.cardImage} resizeMode="cover">
              <View style={[styles.gradient, { backgroundColor: 'rgba(16,28,34,0.7)' }]} />
            </ImageBackground>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Sign to Text</Text>
            <Text style={styles.cardDescription}>Translate sign language into text or spoken language in real-time.</Text>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/prototype/signtotext')}
            >
              <Text style={styles.primaryButtonText}>Select Mode</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { marginBottom: 100 }]}> 
          <View style={styles.imageContainer}>
            <ImageBackground source={require('../../assets/images/Text to Speech.jpg')} style={styles.cardImage} resizeMode="cover">
              <View style={[styles.gradient, { backgroundColor: 'rgba(16,28,34,0.7)' }]} />
            </ImageBackground>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Text to Speech</Text>
            <Text style={styles.cardDescription}>Listen to spoken audio generated from your text.</Text>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/prototype/texttovoice')}
            >
              <Text style={styles.secondaryButtonText}>Select Mode</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { marginBottom: 100 }]}> 
          <View style={styles.imageContainer}>
            <ImageBackground source={require('../../assets/images/Text to Sign.jpg')} style={styles.cardImage} resizeMode="cover">
              <View style={[styles.gradient, { backgroundColor: 'rgba(16,28,34,0.7)' }]} />
            </ImageBackground>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Text to Sign</Text>
            <Text style={styles.cardDescription}>Convert written text into sign language animations for visual communication.</Text>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/prototype/texttosign')}
            >
              <Text style={styles.secondaryButtonText}>Select Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer Navigation - FIXED */}
      <View style={styles.footer}>
        <View style={styles.footerNav}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => router.push('/prototype/translation Mode')}
          >
            <Text style={styles.footerIcon}>🏠</Text>
            <Text style={styles.footerLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerButtonCenter}
            onPress={() => router.push('/prototype/signdetails')}
          >
            {/* flatten style for web-safe prop */}
            <Text style={StyleSheet.flatten([styles.footerIconCenter, { color: colors.primary }])}>🎓</Text>
            <Text style={styles.footerLabelActive}>Learn</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => router.push('/prototype/settings')}
          >
            <Text style={styles.footerIcon}>⚙️</Text>
            <Text style={styles.footerLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
    </>
  );
}
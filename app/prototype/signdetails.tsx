import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import {
  Dimensions,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// --- Color and Font Definitions (from your tailwind.config.js) ---
const COLORS = {
  primary: '#13a4ec',
  backgroundLight: '#f6f7f8',
  backgroundDark: '#101c22',
  black: '#000000',
  white: '#ffffff',
  zinc50: '#fafafa',
  zinc100: '#f4f4f5',
  zinc200: '#e4e4e7',
  zinc400: '#a1a1aa',
  zinc500: '#71717a',
  zinc600: '#52525b',
  zinc800: '#27272a',
  zinc900: '#18181b',
};

const FONT = {
  display: 'System', // Replace with 'Lexend' if loaded
  medium: '600' as const,
  bold: '700' as const,
  extraBold: '900' as const,
};

// Utility to convert hex color to rgba string (safe for web)
const hexToRgba = (hex: string, alpha: number) => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return 'transparent';
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Get screen width for calculating aspect ratio
const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * (9 / 16); // aspect-video = 16/9

// Custom Stylesheet mirroring Tailwind structure
const styles = StyleSheet.create({
  // Global / Body
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  darkModeContainer: {
    backgroundColor: COLORS.backgroundDark,
  },
  textLight: {
    color: COLORS.zinc900,
  },
  textDark: {
    color: COLORS.zinc100,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    // RN doesn't have native backdrop-blur, but we can approximate the sticky effect
    backgroundColor: COLORS.backgroundLight,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  darkModeHeader: {
    backgroundColor: COLORS.backgroundDark,
    // Dark mode specific border/shadow approximation
    borderBottomWidth: 1,
    borderBottomColor: COLORS.zinc800,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18, // text-lg
    fontWeight: FONT.bold,
  },
  placeholderSpacing: {
    width: 32, // w-8
  },

  // Main Content: Video
  videoContainer: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: COLORS.zinc900,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // bg-black/20
  },
  playButton: {
    height: 64, // size-16
    width: 64, // size-16
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // bg-black/50
    // Simplified backdrop-blur for RN
  },
  playIcon: {
    fontSize: 32,
    color: COLORS.white,
  },

  // Content Details Section
  detailsSection: {
    padding: 24, // p-6
    paddingBottom: 0,
    gap: 24, // space-y-6
  },
  signTitle: {
    fontSize: 30, // text-3xl
    fontWeight: FONT.bold,
  },
  signDescription: {
    marginTop: 8, // mt-2
    color: COLORS.zinc600,
  },
  darkModeSignDescription: {
    color: COLORS.zinc400,
  },
  sectionHeading: {
    fontSize: 20, // text-xl
    fontWeight: FONT.bold,
  },

  // Pronunciation
  pronunciationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pronunciationSpeakerButton: {
    padding: 8, // p-2
    borderRadius: 9999,
    backgroundColor: hexToRgba(COLORS.primary, 0.2), // primary/20
    color: COLORS.primary,
  },
  pronunciationBox: {
    backgroundColor: COLORS.backgroundLight,
    padding: 16, // p-4
    borderRadius: 8, // rounded-lg
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Shadow approximation
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  darkModePronunciationBox: {
    backgroundColor: COLORS.backgroundDark,
    // Dark mode specific shadow approximation
    ...Platform.select({
      ios: {
        shadowColor: COLORS.white,
        shadowOpacity: 0.2,
      },
    }),
  },
  ipaText: {
    fontSize: 16, // text-lg
    fontWeight: FONT.medium,
    color: COLORS.zinc800,
  },
  darkModeIpaText: {
    color: COLORS.zinc200,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // space-x-2
  },
  actionButtonBase: {
    padding: 8,
    borderRadius: 9999,
    // no text color for View style; icon colors are set on the icon components
  },
  darkModeActionButtonBase: {
    // no text color for View style; icon colors are set on the icon components
  },
  primaryActionButton: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
  },

  // Common Phrases
  phraseList: {
    gap: 12, // space-y-3
  },
  phraseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // gap-4
    backgroundColor: COLORS.backgroundLight,
    padding: 16,
    borderRadius: 8,
    // Shadow styles are the same as pronunciationBox
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  darkModePhraseItem: {
    backgroundColor: COLORS.backgroundDark,
    // Dark mode specific shadow approximation
    ...Platform.select({
      ios: {
        shadowColor: COLORS.white,
        shadowOpacity: 0.2,
      },
    }),
  },
  phraseText: {
    flex: 1,
    color: COLORS.zinc800,
  },
  darkModePhraseText: {
    color: COLORS.zinc200,
  },
  phraseForwardButton: {
    padding: 8,
    marginRight: -8, // -mr-2
    color: COLORS.zinc500,
  },
  darkModePhraseForwardButton: {
    color: COLORS.zinc400,
  },

  // Alphabet Button
  alphabetButtonWrapper: {
    paddingHorizontal: 24, // Matches detailsSection padding
    paddingBottom: 24,
    paddingTop: 8, // pt-2
  },
  alphabetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 12, // gap-3
    paddingVertical: 16, // py-4
    paddingHorizontal: 24, // px-6
    backgroundColor: COLORS.primary,
    borderRadius: 12, // rounded-xl
    // Shadow approximation
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  alphabetButtonText: {
    fontSize: 18, // text-lg
    fontWeight: FONT.bold,
    color: COLORS.white,
  },

  // Footer
  footer: {
    // RN doesn't have native backdrop-blur
    backgroundColor: COLORS.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.zinc200,
    paddingVertical: 8, // Adjusted from p-2 to match visual style better
  },
  darkModeFooter: {
    backgroundColor: COLORS.backgroundDark,
    borderTopColor: COLORS.zinc800,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4, // gap-1
    padding: 8, // p-2
    width: 80, // w-20
  },
  navText: {
    fontSize: 10, // text-xs
    fontWeight: FONT.medium,
  },
  navIcon: {
    fontSize: 24,
  },
  // Inactive
  navInactive: {
    color: COLORS.zinc500,
  },
  darkModeNavInactive: {
    color: COLORS.zinc400,
  },
  // Active
  navActive: {
    color: COLORS.primary,
    backgroundColor: hexToRgba(COLORS.primary, 0.1), // primary/10
    borderRadius: 8, // rounded-lg
  },
  navActiveText: {
    fontWeight: FONT.bold,
  },
});

// --- Settings Item Component (reusable) ---
const PhraseItem = ({ text, isDarkMode }: { text: string; isDarkMode: boolean }) => {
  const itemStyle = [styles.phraseItem, isDarkMode && styles.darkModePhraseItem];
  const textStyle = [styles.phraseText, isDarkMode && styles.darkModePhraseText];
  const buttonStyle = [
    styles.phraseForwardButton,
    isDarkMode && styles.darkModePhraseForwardButton,
  ];

  return (
    <View style={itemStyle}>
      <Text style={textStyle}>{text}</Text>
      <TouchableOpacity onPress={() => console.log(`Practice phrase: ${text}`)}>
        {/* flatten the style array for the icon to avoid passing arrays to react-native-web DOM styles */}
        <MaterialIcons name="chevron-right" size={24} style={StyleSheet.flatten(buttonStyle) as any} />
      </TouchableOpacity>
    </View>
  );
};

// --- Main Component ---
const SignDetailsScreen = ({ isDarkMode = true }) => {
  const router = useRouter();
  const containerStyle: StyleProp<ViewStyle> = [styles.container, isDarkMode && styles.darkModeContainer];
  const headerStyle: StyleProp<ViewStyle> = [styles.header, isDarkMode && styles.darkModeHeader];
  const titleStyle: StyleProp<TextStyle> = [styles.headerTitle, isDarkMode ? styles.textDark : styles.textLight];
  const signTitleStyle: StyleProp<TextStyle> = [styles.signTitle, isDarkMode ? styles.textDark : { color: COLORS.zinc50 }];
  const descStyle: StyleProp<TextStyle> = [styles.signDescription, isDarkMode && styles.darkModeSignDescription];
  const headingStyle: StyleProp<TextStyle> = [styles.sectionHeading, isDarkMode ? styles.textDark : styles.textLight];
  const ipaTextStyle: StyleProp<TextStyle> = [styles.ipaText, isDarkMode && styles.darkModeIpaText];
  const boxStyle: StyleProp<ViewStyle> = [styles.pronunciationBox, isDarkMode && styles.darkModePronunciationBox];

  const footerStyle: StyleProp<ViewStyle> = [styles.footer, isDarkMode && styles.darkModeFooter];
  const navInactiveStyle: StyleProp<TextStyle> = [styles.navInactive, isDarkMode && styles.darkModeNavInactive];

  // Pre-flatten icon styles to avoid passing arrays into icon components (react-native-web)
  const homeIconStyle = StyleSheet.flatten([styles.navIcon, navInactiveStyle]) as any;
  const learnIconStyle = StyleSheet.flatten([styles.navIcon, { color: COLORS.primary }]) as any;
  const profileIconStyle = StyleSheet.flatten([styles.navIcon, navInactiveStyle]) as any;
  const settingsIconStyle = StyleSheet.flatten([styles.navIcon, navInactiveStyle]) as any;

  return (
    <SafeAreaView style={containerStyle}>
      {/* Header */}
      <View style={headerStyle}>
         
        <Text style={titleStyle}>   Sign Details</Text>
        <View style={styles.placeholderSpacing} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Video Player */}
        <View style={styles.videoContainer}>
          <ImageBackground
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbAhL133U1gSgjVhl3DtUSK2y94wqpYC-w0Z3Bd3oLQq1BLbqTBMOBYqMiI4swwFemfu5aULX3dCNufxtlKY_3K1YxQyLwNO-bFufNtJvTp2ce9MtNKMcYtNVI8DkitjWHXuA3ImiJ8RnVtdZdthqTzDJQOQO0D1W_pxX5O5IHSbB358IWxM3vlPpoSMxoDf2e0BnS1I8GAecGeL-rkSMSop-VpQQR0XF293ilXd048fFR0ztcloMGzrgzsX3IVwrv3aIVxiI0R7s' }}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            <View style={styles.videoOverlay}>
              <TouchableOpacity style={styles.playButton} onPress={() => console.log('Play Video')}>
                {/* Play Icon (Replaced SVG) */}
                <MaterialIcons name="play-arrow" size={32} style={styles.playIcon} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Content Details */}
        <View style={styles.detailsSection}>
          <View>
            <Text style={signTitleStyle}>Hello</Text>
            <Text style={descStyle}>
              A common greeting used to initiate conversation or acknowledge someone's presence.
            </Text>
          </View>

          {/* Pronunciation */}
          <View style={{ gap: 16 }}>
            <View style={styles.pronunciationRow}>
              <Text style={headingStyle}>Pronunciation</Text>
              <TouchableOpacity
                style={styles.pronunciationSpeakerButton}
                onPress={() => console.log('Play full word audio')}
              >
                {/* Speaker Icon (Replaced SVG with Ionicons) */}
                <Ionicons name="volume-medium" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View style={boxStyle}>
              <Text style={ipaTextStyle}>/həˈloʊ/</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButtonBase, isDarkMode && styles.darkModeActionButtonBase]}
                  onPress={() => console.log('Delete/Review pronunciation')}
                >
                  {/* Review/X Icon (Replaced SVG with MaterialIcons) */}
                  <MaterialIcons name="undo" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButtonBase, styles.primaryActionButton]}
                  onPress={() => console.log('Mark correct/done')}
                >
                  {/* Checkmark/Done Icon (Replaced SVG with MaterialIcons) */}
                  <MaterialIcons name="check" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Common Phrases */}
          <View style={{ gap: 16 }}>
            <Text style={headingStyle}>Common Phrases</Text>
            <View style={styles.phraseList}>
              <PhraseItem text="Hello, how are you?" isDarkMode={isDarkMode} />
              <PhraseItem text="Hello, nice to meet you." isDarkMode={isDarkMode} />
            </View>
          </View>

          {/* Sign Language Alphabet Button */}
          <View style={styles.alphabetButtonWrapper}>
            <TouchableOpacity
              style={styles.alphabetButton}
              onPress={() => router.push('/prototype/alphabet')}
            >
              {/* Hand/Alphabet Icon (Replaced SVG with a custom approximation) */}
              <MaterialCommunityIcons name="sign-language" size={24} color={COLORS.white} />
              <Text style={styles.alphabetButtonText}>
                Sign Language Alphabets
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer / Navigation Bar */}
      <View style={footerStyle}>
        <View style={styles.nav}>
          {/* Home */}
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/prototype/translation Mode')}
          >
            <MaterialIcons name="home" style={homeIconStyle} />
            <Text style={[styles.navText, navInactiveStyle]}>Home</Text>
          </TouchableOpacity>

          {/* Learn (Active) */}
          <TouchableOpacity style={[styles.navItem, styles.navActive]}>
            <MaterialIcons name="school" style={learnIconStyle} />
            <Text style={[styles.navText, styles.navActiveText]}>Learn</Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/prototype/profile')}
          >
            <MaterialIcons name="person" style={profileIconStyle} />
            <Text style={[styles.navText, navInactiveStyle]}>Profile</Text>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => router.push('/prototype/settings')}
          >
            <MaterialIcons name="settings" style={settingsIconStyle} />
            <Text style={[styles.navText, navInactiveStyle]}>Settings</Text>
          </TouchableOpacity>
        </View>
        {/* RN handles safe area padding naturally, so no need for h-safe-area-bottom div */}
      </View>
    </SafeAreaView>
  );
};

export default SignDetailsScreen;
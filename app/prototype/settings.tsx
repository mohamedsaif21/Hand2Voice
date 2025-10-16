import { MaterialIcons } from '@expo/vector-icons'; // You'll need to install this package
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

// Screen height for min-height calculation, though RN handles this differently
const { height } = Dimensions.get('window');

// --- Color and Font Definitions (from your tailwind.config.js) ---
const COLORS = {
  primary: '#13a4ec',
  backgroundLight: '#f6f7f8',
  backgroundDark: '#101c22',
  black: '#000000',
  white: '#ffffff',
};

// Note: You would typically load custom fonts like Lexend and Noto Sans
// using an asset loader like 'expo-font'. For simplicity, we use system defaults.
const FONT = {
  display: 'System', // Replace with 'Lexend' if loaded
  // explicitly type as string literal weights so TS accepts them where TextStyle.fontWeight is expected
  medium: ('600' as unknown) as '600',
  bold: ('700' as unknown) as '700',
  extraBold: ('900' as unknown) as '900',
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

// Custom Stylesheet mirroring Tailwind structure
const styles = StyleSheet.create({
  // Global / Body
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    minHeight: height, // Optional, typically flex: 1 handles full screen
  },
  darkModeContainer: {
    backgroundColor: COLORS.backgroundDark,
  },
  // Header
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderBottomWidth: 0, // No default border
    ...Platform.select({
      // Shadow for sticky effect (if needed)
      ios: {
        shadowColor: 'black',
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
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: FONT.bold,
    color: COLORS.black,
    paddingRight: 40, // To offset the back button
  },
  darkModeHeaderTitle: {
    color: COLORS.white,
  },
  iconButton: {
    height: 40,
    width: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: COLORS.black,
  },
  darkModeIcon: {
    color: COLORS.white,
  },
  // Main Content
  main: {
    padding: 16,
    paddingBottom: 80, // Space for footer
    flexGrow: 1,
  },
  sectionSpacing: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: FONT.bold,
    color: COLORS.black,
    marginBottom: 16,
  },
  darkModeSectionTitle: {
    color: COLORS.white,
  },
  settingsItemContainer: {
    marginBottom: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8, // 'DEFAULT' is 0.5rem
    backgroundColor: COLORS.white,
    padding: 16,
  },
  darkModeSettingsItem: {
    backgroundColor: hexToRgba(COLORS.primary, 0.1), // primary/10 opacity
  },
  settingsTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  settingsTitle: {
    fontWeight: FONT.medium,
    color: COLORS.black,
  },
  darkModeSettingsTitle: {
    color: COLORS.white,
  },
  settingsDescription: {
    fontSize: 12,
    color: hexToRgba(COLORS.black, 0.6), // black/60 opacity
  },
  darkModeSettingsDescription: {
    color: hexToRgba(COLORS.white, 0.6), // white/60 opacity
  },
  settingsValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsValueText: {
    fontSize: 14,
    fontWeight: FONT.medium,
    color: COLORS.primary,
  },
  chevronIcon: {
    color: hexToRgba(COLORS.black, 0.6),
  },
  darkModeChevronIcon: {
    color: hexToRgba(COLORS.white, 0.6),
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: hexToRgba(COLORS.black, 0.1), // black/10
    paddingTop: 8,
    paddingBottom: 12,
  },
  darkModeFooter: {
    backgroundColor: COLORS.backgroundDark,
    borderTopColor: hexToRgba(COLORS.white, 0.1), // white/10
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  darkModeNavItem: {
    // kept intentionally empty for view-level dark adjustments; text/icon colors handled separately
  },
  navText: {
    fontSize: 10,
    fontWeight: FONT.medium,
    color: hexToRgba(COLORS.black, 0.6),
  },
  navIcon: {
    fontSize: 24, // default icon size
    color: hexToRgba(COLORS.black, 0.6),
  },
  darkModeNavText: {
    color: hexToRgba(COLORS.white, 0.6),
  },
  darkModeNavIcon: {
    color: hexToRgba(COLORS.white, 0.6),
  },
  // Active Nav Item
  activeNavItem: {
    backgroundColor: hexToRgba(COLORS.primary, 0.2), // primary/20
    borderRadius: 9999,
    padding: 8,
  },
  darkModeActiveNavItem: {
    backgroundColor: hexToRgba(COLORS.primary, 0.3), // primary/30
  },
  activeNavText: {
    fontSize: 10,
    fontWeight: FONT.bold,
    color: COLORS.primary,
  },
  activeNavIcon: {
    color: COLORS.primary,
    fontWeight: FONT.bold,
  },
});

// --- Settings Item Component (reusable) ---
type SettingsItemProps = {
  title: string;
  description: string;
  value?: string;
  isDarkMode?: boolean;
};

const SettingsItem: React.FC<SettingsItemProps> = ({ title, description, value, isDarkMode }) => {
  const itemStyle = [styles.settingsItem, isDarkMode && styles.darkModeSettingsItem];
  const titleStyle = [styles.settingsTitle, isDarkMode && styles.darkModeSettingsTitle];
  const descStyle = [
    styles.settingsDescription,
    isDarkMode && styles.darkModeSettingsDescription,
  ];
  const chevronStyle = [styles.chevronIcon, isDarkMode && styles.darkModeChevronIcon];

  return (
    <TouchableOpacity
      style={styles.settingsItemContainer}
      onPress={() => console.log(`Navigating to ${title}`)} // Placeholder for navigation
    >
      <View style={itemStyle}>
        <View style={styles.settingsTextContainer}>
          <Text style={titleStyle}>{title}</Text>
          <Text style={descStyle}>{description}</Text>
        </View>
        <View style={styles.settingsValueRow}>
          {value && <Text style={styles.settingsValueText}>{value}</Text>}
          <MaterialIcons name="chevron-right" size={24} style={chevronStyle} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- Main Component ---
type SettingsScreenProps = {
  isDarkMode?: boolean;
};

const SignLanguageAppSettings: React.FC<SettingsScreenProps> = ({ isDarkMode = true }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = isDarkMode || colorScheme === 'dark';
  
  const containerStyle = [styles.container, isDark && styles.darkModeContainer];
  const headerStyle = [styles.header, isDarkMode && styles.darkModeHeader];
  const headerTitleStyle = [styles.headerTitle, isDarkMode && styles.darkModeHeaderTitle];
  const backIconStyle = [styles.icon, isDarkMode && styles.darkModeIcon];
  const sectionTitleStyle = [styles.sectionTitle, isDarkMode && styles.darkModeSectionTitle];
  const footerStyle = [styles.footer, isDarkMode && styles.darkModeFooter];

  // Utility to handle navigation/action
  const navigateBack = () => {};

  // Pre-flatten nav icon/text styles for web
  const homeIconStyle = StyleSheet.flatten([styles.navIcon, isDarkMode && styles.darkModeNavIcon]);
  const homeTextStyle = StyleSheet.flatten([styles.navText, isDarkMode && styles.darkModeNavText]);
  const learnIconStyle = StyleSheet.flatten([styles.navIcon, isDarkMode && styles.darkModeNavIcon]);
  const learnTextStyle = StyleSheet.flatten([styles.navText, isDarkMode && styles.darkModeNavText]);
  const profileIconStyle = StyleSheet.flatten([styles.navIcon, isDarkMode && styles.darkModeNavIcon]);
  const profileTextStyle = StyleSheet.flatten([styles.navText, isDarkMode && styles.darkModeNavText]);
  const helpIconStyle = StyleSheet.flatten([styles.navIcon, isDarkMode && styles.darkModeNavIcon]);
  const helpTextStyle = StyleSheet.flatten([styles.navText, isDarkMode && styles.darkModeNavText]);

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={headerStyle}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => router.push('/prototype/translation Mode')}
            >
              <MaterialIcons name="arrow-back" size={24} style={backIconStyle} />
            </TouchableOpacity>
          <Text style={headerTitleStyle}>Settings</Text>
        </View>

        {/* Main Content */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.main}>
            {/* Accessibility Section */}
            <View style={styles.sectionSpacing}>
              <Text style={sectionTitleStyle}>Accessibility</Text>
              <SettingsItem
                title="Text Size"
                description="Adjust text size for better readability"
                value="Medium"
                isDarkMode={isDarkMode}
              />
              <SettingsItem
                title="Color Contrast"
                description="Enhance contrast for improved visibility"
                value="Normal"
                isDarkMode={isDarkMode}
              />
              <SettingsItem
                title="Animation Speed"
                description="Control animation speed for smoother interactions"
                value="Normal"
                isDarkMode={isDarkMode}
              />
            </View>

            {/* Privacy Section */}
            <View style={styles.sectionSpacing}>
              <Text style={sectionTitleStyle}>Privacy</Text>
              <SettingsItem
                title="Data Management"
                description="Manage your data and privacy settings"
                isDarkMode={isDarkMode}
              />
              <SettingsItem
                title="Privacy Policy"
                description="Review and update our privacy policy"
                isDarkMode={isDarkMode}
              />
            </View>

            {/* Other Section */}
            <View style={styles.sectionSpacing}>
              <Text style={sectionTitleStyle}>Other</Text>
              <SettingsItem
                title="Help & Support"
                description="Get help and support"
                isDarkMode={isDarkMode}
              />
              <SettingsItem
                title="About"
                description="Learn more about the app"
                isDarkMode={isDarkMode}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer / Navigation Bar */}
        <View style={footerStyle}>
          <View style={styles.nav}>
            <TouchableOpacity
              style={[styles.navItem, isDarkMode && styles.darkModeNavItem]}
              onPress={() => router.push('/prototype/translation Mode')}
            >
              <MaterialIcons name="home" size={24} style={homeIconStyle} />
              <Text style={homeTextStyle}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.navItem, isDarkMode && styles.darkModeNavItem]}
              onPress={() => router.push('/prototype/signdetails')}
            >
              <MaterialIcons name="school" size={24} style={learnIconStyle} />
              <Text style={learnTextStyle}>Learn</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.navItem, isDarkMode && styles.darkModeNavItem]}
              onPress={() => router.push('/prototype/profile')}
            >
              <MaterialIcons name="person" size={24} style={profileIconStyle} />
              <Text style={profileTextStyle}>Profile</Text>
            </TouchableOpacity>

            {/* Active Item: Settings */}
            <TouchableOpacity
              style={[styles.navItem, styles.activeNavItem, isDarkMode && styles.darkModeActiveNavItem]}
            >
              <MaterialIcons name="settings" size={24} style={styles.activeNavIcon} />
              <Text style={styles.activeNavText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignLanguageAppSettings;
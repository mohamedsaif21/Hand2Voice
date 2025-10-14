import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SignLanguageAlphabet() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const alphabetData = [
    { letter: 'A', image: require('../../assets/alphabet/A.jpg') },
    { letter: 'B', image: require('../../assets/alphabet/B.jpg') },
    { letter: 'C', image: require('../../assets/alphabet/C.jpg') },
    { letter: 'D', image: require('../../assets/alphabet/D.jpg') },
    { letter: 'E', image: require('../../assets/alphabet/E.jpg') },
    { letter: 'F', image: require('../../assets/alphabet/F.jpg') },
    { letter: 'G', image: require('../../assets/alphabet/G.jpg') },
    { letter: 'H', image: require('../../assets/alphabet/H.jpg') },
    { letter: 'I', image: require('../../assets/alphabet/I.jpg') },
    { letter: 'J', image: require('../../assets/alphabet/J.jpg') },
    { letter: 'K', image: require('../../assets/alphabet/K.jpg') },
    { letter: 'L', image: require('../../assets/alphabet/L.jpg') },
    { letter: 'M', image: require('../../assets/alphabet/M.jpg') },
    { letter: 'N', image: require('../../assets/alphabet/N.jpg') },
    { letter: 'O', image: require('../../assets/alphabet/O.jpg') },
    { letter: 'P', image: require('../../assets/alphabet/P.jpg') },
    { letter: 'Q', image: require('../../assets/alphabet/Q.jpg') },
    { letter: 'R', image: require('../../assets/alphabet/R.jpg') },
    { letter: 'S', image: require('../../assets/alphabet/S.jpg') },
    { letter: 'T', image: require('../../assets/alphabet/T.jpg') },
    { letter: 'U', image: require('../../assets/alphabet/U.jpg') },
    { letter: 'V', image: require('../../assets/alphabet/V.jpg') },
    { letter: 'W', image: require('../../assets/alphabet/W.jpg') },
    { letter: 'X', image: require('../../assets/alphabet/X.jpg') },
    { letter: 'Y', image: require('../../assets/alphabet/Y.jpg') },
    { letter: 'Z', image: require('../../assets/alphabet/Z.jpg') },
  ];

  const containerStyle = [styles.container, isDark && styles.darkContainer];
  const headerStyle = [styles.header, isDark && styles.darkHeader];
  const headerTitleStyle = [styles.headerTitle, isDark && styles.darkText];
  const pageTitleStyle = [styles.pageTitle, isDark && styles.darkText];
  const letterTextStyle = [styles.letterText, isDark && styles.darkText];
  const bottomNavStyle = [styles.bottomNav, isDark && styles.darkBottomNav];

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={headerStyle}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push('/prototype/signdetails')}
        >
          <Text style={[styles.backIcon, isDark && styles.darkText]}>←</Text>
        </TouchableOpacity>
        <Text style={headerTitleStyle}>Sign Language Alphabet</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={pageTitleStyle}>Learn the Alphabet</Text>
        
        <View style={styles.gridContainer}>
          {alphabetData.map((item) => (
            <TouchableOpacity
              key={item.letter}
              style={[styles.alphabetItem, isDark && styles.darkAlphabetItem]}
              onPress={() => console.log(`Pressed: ${item.letter}`)}
            >
              <View style={[styles.emojiContainer, isDark && styles.darkEmojiContainer]}>
                <Image source={item.image} style={styles.emojiImage} resizeMode="cover" />
              </View>
              <Text style={letterTextStyle}>{item.letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={bottomNavStyle}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/prototype/translation Mode')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, isDark && styles.darkNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, styles.activeNavItem]}
          onPress={() => router.push('/prototype/signdetails')}
        >
          <Text style={[styles.navIcon, styles.activeNavIcon]}>🎓</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/prototype/profile')}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navText, isDark && styles.darkNavText]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/prototype/settings')}
        >
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={[styles.navText, isDark && styles.darkNavText]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  darkContainer: { backgroundColor: '#101c22' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  darkHeader: { borderBottomColor: '#374151' },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { fontSize: 24, color: '#1e293b' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 40 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#0f172a', marginTop: 24, marginBottom: 32, textAlign: 'center' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  alphabetItem: { width: (width - 48) / 3, alignItems: 'center', marginBottom: 24, padding: 8 },
  darkAlphabetItem: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8 },
  emojiContainer: { width: 80, height: 80, borderRadius: 40, marginBottom: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  darkEmojiContainer: { backgroundColor: '#1f2937' },
  emojiText: { fontSize: 32 },
  emojiImage: { width: 80, height: 80, borderRadius: 40 },
  letterText: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  darkText: { color: '#f9fafb' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#f6f7f8', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingVertical: 12 },
  darkBottomNav: { backgroundColor: '#101c22', borderTopColor: '#374151' },
  navItem: { alignItems: 'center', flex: 1 },
  activeNavItem: { backgroundColor: 'rgba(19,164,236,0.1)', borderRadius: 8, marginHorizontal: 4 },
  navIcon: { fontSize: 24, marginBottom: 4 },
  activeNavIcon: { color: '#13a4ec' },
  navText: { fontSize: 12, color: '#64748b' },
  darkNavText: { color: '#9ca3af' },
  activeNavText: { fontSize: 12, fontWeight: 'bold', color: '#13a4ec' },
});
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TextToVoice() {
  const router = useRouter();

  const [textInput, setTextInput] = useState('');
  const [currentLang, setCurrentLang] = useState<'ta' | 'hi' | 'ml'>('ta');
  const [translatedText, setTranslatedText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showTranslateBtn, setShowTranslateBtn] = useState(false);
  const [showGenerateBtn, setShowGenerateBtn] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const examplePhrases = {
    ta: [
      'வணக்கம், எப்படி இருக்கிறாய்?',
      'ரயில் நிலையம் எங்கே இருக்கிறது?',
      'எனக்கு பசிக்கிறது.',
      'இது எவ்வளவு?',
      'கழிவறை எங்கே?',
      'எனக்கு தண்ணீர் வேண்டும்.',
    ],
    hi: [
      'नमस्ते, आप कैसे हैं?',
      'ट्रेन स्टेशन कहाँ है?',
      'मुझे भूख लगी है।',
      'यह कितने का है?',
      'शौचालय कहाँ है?',
      'मुझे पानी चाहिए।',
    ],
    ml: [
      'നമസ്കാരം, സുഖമാണോ?',
      'റെയിൽവേ സ്റ്റേഷൻ എവിടെയാണ്?',
      'എനിക്ക് വിശക്കുന്നു.',
      'ഇതിന് എത്ര രൂപയാണ്?',
      'ടോയ്‌ലെറ്റ് എവിടെയാണ്?',
      'എനിക്ക് വെള്ളം വേണം.',
    ],
  };

  const translations: Record<'ta' | 'hi' | 'ml', Record<string, string>> = {
    ta: {
      hello: 'வணக்கம்',
      hi: 'வணக்கம்',
      'thank you': 'நன்றி',
      thanks: 'நன்றி',
      'how are you': 'நீங்கள் எப்படி இருக்கிறீர்கள்?',
      'good morning': 'காலை வணக்கம்',
      'where is the train station': 'ரயில் நிலையம் எங்கே இருக்கிறது?',
      'i am hungry': 'எனக்கு பசிக்கிறது.',
      'how much is this': 'இது எவ்வளவு?',
      'where is the bathroom': 'கழிவறை எங்கே?',
      'i need water': 'எனக்கு தண்ணீர் வேண்டும்.',
      'see you later': 'பிறகு பார்க்கலாம்.',
    },
    hi: {
      hello: 'नमस्ते',
      hi: 'नमस्ते',
      'thank you': 'धन्यवाद',
      thanks: 'धन्यवाद',
      'how are you': 'आप कैसे हैं?',
      'good morning': 'शुभ प्रभात',
      'where is the train station': 'ट्रेन स्टेशन कहाँ है?',
      'i am hungry': 'मुझे भूख लगी है।',
      'how much is this': 'यह कितने का है?',
      'where is the bathroom': 'शौचालय कहाँ है?',
      'i need water': 'मुझे पानी चाहिए।',
      'see you later': 'फिर मिलेंगे.',
    },
    ml: {
      hello: 'നമസ്കാരം',
      hi: 'നമസ്കാരം',
      'thank you': 'നന്ദി',
      thanks: 'നന്ദി',
      'how are you': 'സുഖമാണോ?',
      'good morning': 'സുപ്രഭാതം',
      'where is the train station': 'റെയിൽവേ സ്റ്റേഷൻ എവിടെയാണ്?',
      'i am hungry': 'എനിക്ക് വിശക്കുന്നു.',
      'how much is this': 'ഇതിന് എത്ര രൂപയാണ്?',
      'where is the bathroom': 'ടോയ്‌ലെറ്റ് എവിടെയാണ്?',
      'i need water': 'എനിക്ക് വെള്ളം വേണം.',
      'see you later': 'പിന്നീട് കാണാം.',
    },
  };

  // Helpers
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[\u2018\u2019`']/g, "'") // normalize quotes
      .replace(/[.,!?;:()\[\]"]+/g, ' ') // remove punctuation
      .replace(/\s+/g, ' ')
      .trim();

  const ttsLangMap: Record<string, string> = {
    // backend expects simple codes used in the Flask server (ta, hi, ml)
    ta: 'ta',
    hi: 'hi',
    ml: 'ml',
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const analyzeText = () => {
    const text = textInput.trim();
    if (!text) {
      setStatus('Please enter some text to analyze');
      setIsError(true);
      return;
    }
    setOriginalText(text);
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    const chars = text.length;
    const sentences = text
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0);

    setShowAnalysis(true);
    setShowLanguageSelector(true);
    setShowTranslateBtn(true);

    setStatus('Text analyzed successfully. Please select a language for translation.');
    setIsError(false);
  };

  const selectLanguage = (lang: 'ta' | 'hi' | 'ml') => {
    setCurrentLang(lang);
    if (translatedText) {
      setTranslatedText('');
      setShowGenerateBtn(false);
    }
  };

  const translateText = () => {
    if (!originalText) {
      setStatus('Please analyze text first');
      setIsError(true);
      return;
    }
    setIsTranslating(true);
    setStatus('Translating text...');
    setIsError(false);

    setTimeout(() => {
      const lower = normalize(originalText);
      let translated = '';
      // Exact match first
      if (translations[currentLang][lower]) {
        translated = translations[currentLang][lower];
      } else {
        // Phrase match using word-boundary to avoid partial matches
        let foundMatch = false;
        const phrases = Object.keys(translations[currentLang]).sort((a, b) => b.length - a.length);
        for (const phrase of phrases) {
          const normPhrase = normalize(phrase);
          const re = new RegExp('\\\b' + normPhrase.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b');
          if (re.test(lower)) {
            translated = translations[currentLang][phrase];
            foundMatch = true;
            break;
          }
        }

        // Fallback: word-by-word mapping
        if (!foundMatch) {
          const words = lower.split(' ');
          const mapped = words
            .map((w) => translations[currentLang][w] || w)
            .join(' ');
          // If mapping changed something, use it, otherwise use original text
          translated = mapped !== lower ? mapped : originalText;
        }
      }
      setTranslatedText(translated);
      setShowGenerateBtn(true);
      setStatus('Text translated (preview). The server will generate audio.');
      setIsTranslating(false);
    }, 400);
  };

  const generateAudio = async () => {
    if (!originalText) {
      setStatus('Please analyze text first');
      setIsError(true);
      return;
    }
    setIsGenerating(true);
    setStatus('Generating audio...');
    setIsError(false);
    try {
      // Determine endpoint based on platform/environment
      // Strategy:
      // 1. On web use window.location.hostname
      // 2. If available, prefer Expo debuggerHost (it contains the dev machine IP in many setups)
      // 3. Fall back to emulator/simulator shortcuts (10.0.2.2 for Android emulator, localhost for iOS simulator)
      // 4. Last-resort fallback is a placeholder that the developer should replace with their LAN IP
      const fallbackHost = 'REPLACE_WITH_YOUR_LAN_IP';

      const extractHostFromDebugger = (dbg?: string) => {
        if (!dbg) return undefined;
        // debuggerHost often looks like "192.168.1.10:19000" or "localhost:19000"
        return dbg.split(':')[0];
      };

      let host: string | undefined;
      try {
        if (Platform.OS === 'web') {
          // window may be undefined in some hosting environments, guard it
          host = typeof window !== 'undefined' && window.location && window.location.hostname ? window.location.hostname : undefined;
        }

        // Try Expo Constants debuggerHost (works when running through Expo devtools)
        const dbg = (Constants.manifest && (Constants.manifest as any).debuggerHost) || (Constants.expoConfig && (Constants.expoConfig as any).extra && (Constants.expoConfig as any).extra.debuggerHost);
        const dbgHost = extractHostFromDebugger(dbg as string | undefined);
        if (!host && dbgHost) host = dbgHost;

        if (!host) {
          host = Platform.select({ android: '10.0.2.2', ios: 'localhost', default: fallbackHost }) as string;
        }
      } catch (e) {
        host = Platform.select({ android: '10.0.2.2', ios: 'localhost', default: fallbackHost }) as string;
      }

      console.log('Using host:', host);

      // Use backend-generated audio (disable local test files)
      const useLocalTestFile = false;
      
      // Set up audio mode first
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      
      if (useLocalTestFile) {
        // Use pre-generated test files for quick testing
        // We need to use static requires for each language since dynamic requires aren't supported
        let audioSource;
        if (currentLang === 'ta') {
          audioSource = require('../../text to voices/test_output/output_ta.mp3');
          console.log('Loading Tamil test audio file');
        } else if (currentLang === 'hi') {
          audioSource = require('../../text to voices/test_output/output_hi.mp3');
          console.log('Loading Hindi test audio file');
        } else if (currentLang === 'ml') {
          audioSource = require('../../text to voices/test_output/output_ml.mp3');
          console.log('Loading Malayalam test audio file');
        }
        
        console.log('Creating audio from local file for language:', currentLang);
        try {
          const { sound: newSound } = await Audio.Sound.createAsync(
            audioSource,
            { shouldPlay: true },
            (status) => console.log('Audio playback status:', status)
          );
          console.log('Audio created successfully');
          setSound(newSound);
          setStatus('Playing test audio file...');
      } catch (error: any) {
          console.error('Error playing local audio file:', error);
          setStatus('Error playing audio: ' + error.message);
          setIsError(true);
        }
      } else {
        // Ensure the URL is built correctly
  const textToUse = translatedText || originalText; // Use the translated text if available

  // Choose TTS language code expected by backend (if backend expects different codes, adjust map)
  const langCodeForBackend = (ttsLangMap as any)[currentLang] || currentLang;

  const streamUrl = `http://${host}:5000/generate_audio_mp3?text=${encodeURIComponent(textToUse)}&lang_code=${encodeURIComponent(langCodeForBackend)}`;
      console.log('Attempting to fetch audio from:', streamUrl);
      
      if (Platform.OS === 'web') {
        console.log('Using web audio playback method; doing a preflight fetch to validate the audio URL');
        try {
          const resp = await fetch(streamUrl, { method: 'GET', mode: 'cors' });
          if (!resp.ok) {
            const body = await resp.text().catch(() => '<no-body>');
            throw new Error(`Server responded with ${resp.status} ${resp.statusText}. Response body: ${body}`);
          }

          const contentType = resp.headers.get('content-type') || '';
          if (!contentType.includes('audio') && !contentType.includes('mpeg') && !contentType.includes('mp3')) {
            const body = await resp.text().catch(() => '<no-body>');
            throw new Error(`Unexpected content-type: ${contentType}. Body: ${body}`);
          }

          // If preflight succeeds, hand the URL to expo-av
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: streamUrl },
            { shouldPlay: true }
          );
          setSound(newSound);
        } catch (webErr: any) {
          console.error('Web audio preflight or playback error:', webErr);
          throw webErr;
        }
      } else {
        // Mobile/Simulator logic
        const baseDir = (FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory || null;

        if (!baseDir) {
          // Some environments (custom runtimes / restricted sandboxes) may not expose a writable FileSystem.
          // Instead of throwing, fall back to streaming the remote URL directly. expo-av can play remote URIs.
          console.warn('No writable FileSystem directory available; falling back to streaming the remote audio URL.');
          setStatus('No writable local directory; streaming audio from server...');
          try {
            const { sound: newSound } = await Audio.Sound.createAsync(
              { uri: streamUrl },
              { shouldPlay: true },
              (status) => console.log('Playback status:', status)
            );
            setSound(newSound);
            console.log('Streaming playback started');
          } catch (streamErr) {
            console.error('Streaming playback error:', streamErr);
            throw streamErr;
          }
        } else {
          const localUri = `${baseDir}tts_${currentLang}_${Date.now()}.mp3`;
          console.log('Downloading to:', localUri);
          
          try {
            const download = await FileSystem.downloadAsync(streamUrl, localUri);
            console.log('Download result:', download);
            
            if (download.status !== 200) {
              throw new Error(`Download failed with status: ${download.status}`);
            }
            
            // Check if file exists and has content
            const fileInfo = await FileSystem.getInfoAsync(localUri);
            console.log('File info:', fileInfo);
            
            if (!fileInfo.exists || fileInfo.size === 0) {
              throw new Error('Downloaded file is empty or does not exist');
            }
            
            console.log('Creating sound object from:', localUri);
            const { sound: newSound } = await Audio.Sound.createAsync(
              { uri: localUri },
              { shouldPlay: true },
              (status) => console.log('Playback status:', status)
            );
            setSound(newSound);
            console.log('Sound created successfully');
          } catch (downloadError) {
            console.error('Download or playback error:', downloadError);
            throw downloadError;
          }
        }
      }
        
        setStatus('Audio generated successfully! Playing...');
      }
    } catch (error: any) {
      // Common causes:
      // - Backend not running or unreachable over LAN
      // - Using HTTP on Android without proper network config
      // - Wrong IP/host value
      console.error('TTS Error:', error);
      
      const errorMessage = error.message || 'Unknown error';
      const hint = Platform.OS === 'android'
        ? 'If on Android emulator, ensure host is 10.0.2.2. On a physical device, use your machine\'s LAN IP.'
        : 'If on iOS simulator, localhost works; on a physical device, use your machine\'s LAN IP.';
      
      setStatus(`Network error: ${errorMessage}. ${hint}`);
      setIsError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectExample = (phrase: string) => {
    setTextInput(phrase);
    setShowExamples(false);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Text to Speech' }} />
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/prototype/translation Mode')}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Text to Speech</Text>
        <View style={styles.headerSpacer} />
      </View>

        <ScrollView style={{ flex: 1 }}>
      <View style={styles.content}>
            <View style={styles.stepIndicator}>
              <View style={[styles.step, styles.stepActive]}>
                <Text style={[styles.stepText, styles.stepTextActive]}>1. Enter Text</Text>
              </View>
              <View style={[styles.step, showLanguageSelector && styles.stepActive]}>
                <Text style={[styles.stepText, showLanguageSelector && styles.stepTextActive]}>2. Select Language</Text>
              </View>
              <View style={[styles.step, showGenerateBtn && styles.stepActive]}>
                <Text style={[styles.stepText, showGenerateBtn && styles.stepTextActive]}>3. Generate Audio</Text>
              </View>
            </View>

        <TextInput
              placeholder="Enter text to analyze, translate and convert to speech"
          multiline
              value={textInput}
              onChangeText={setTextInput}
          style={styles.input}
        />

            <TouchableOpacity style={styles.exampleToggle} onPress={() => setShowExamples(!showExamples)}>
              <Text style={styles.exampleToggleText}>{showExamples ? 'Hide' : 'Show'} example phrases</Text>
            </TouchableOpacity>

            {showExamples && (
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Example Phrases</Text>
                <ScrollView style={styles.examplesList}>
                  <Text style={styles.langHeader}>Tamil:</Text>
                  {examplePhrases.ta.map((p, i) => (
                    <TouchableOpacity key={`ta-${i}`} style={styles.exampleItem} onPress={() => selectExample(p)}>
                      <Text>{p}</Text>
                    </TouchableOpacity>
                  ))}
                  <Text style={styles.langHeader}>Hindi:</Text>
                  {examplePhrases.hi.map((p, i) => (
                    <TouchableOpacity key={`hi-${i}`} style={styles.exampleItem} onPress={() => selectExample(p)}>
                      <Text>{p}</Text>
                    </TouchableOpacity>
                  ))}
                  <Text style={styles.langHeader}>Malayalam:</Text>
                  {examplePhrases.ml.map((p, i) => (
                    <TouchableOpacity key={`ml-${i}`} style={styles.exampleItem} onPress={() => selectExample(p)}>
                      <Text>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {showAnalysis && (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisTitle}>Text Analysis</Text>
                {/* Minimal metrics retained for future expansion */}
              </View>
            )}

            <TouchableOpacity style={styles.primaryButton} onPress={analyzeText}>
              <Text style={styles.primaryButtonText}>Analyze Text</Text>
        </TouchableOpacity>

            {showLanguageSelector && (
              <View style={styles.languageSelector}>
                {(['ta', 'hi', 'ml'] as const).map((code) => (
                  <TouchableOpacity
                    key={code}
                    style={[styles.languageBtn, currentLang === code && styles.languageBtnActive]}
                    onPress={() => selectLanguage(code)}
                  >
                    <Text style={[styles.languageBtnText, currentLang === code && styles.languageBtnTextActive]}>
                      {code === 'ta' ? 'Tamil' : code === 'hi' ? 'Hindi' : 'Malayalam'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {translatedText !== '' && (
              <View style={styles.translatedTextContainer}>
                <Text style={styles.translatedText}>{translatedText}</Text>
              </View>
            )}

            {showTranslateBtn && (
              <TouchableOpacity style={styles.translateBtn} onPress={translateText} disabled={isTranslating}>
                {isTranslating ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Translate</Text>}
              </TouchableOpacity>
            )}

            {showGenerateBtn && (
              <TouchableOpacity style={styles.generateBtn} onPress={generateAudio} disabled={isGenerating}>
                {isGenerating ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Generate & Play</Text>}
          </TouchableOpacity>
        )}

            {status !== '' && (
              <Text style={[styles.status, isError && styles.statusError]}>{status}</Text>
        )}
      </View>
        </ScrollView>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff' },
  headerButton: { width: 40, alignItems: 'flex-start' },
  headerIcon: { fontSize: 24 },
  headerTitle: { flex: 1, textAlign: 'center', fontWeight: '700', fontSize: 18 },
  headerSpacer: { width: 40 },
  content: { flex: 1, padding: 16 },
  input: { minHeight: 120, backgroundColor: '#fff', borderRadius: 12, padding: 16, fontSize: 16, textAlignVertical: 'top', borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 12, alignSelf: 'stretch' },
  primaryButton: { height: 50, backgroundColor: '#13a4ec', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.6 },
  exampleToggle: { alignSelf: 'flex-end', marginBottom: 8 },
  exampleToggleText: { color: '#13a4ec', textDecorationLine: 'underline' },
  examplesContainer: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12 },
  examplesTitle: { fontWeight: '700', marginBottom: 8 },
  examplesList: { maxHeight: 150 },
  langHeader: { fontWeight: '700', marginTop: 8, marginBottom: 4 },
  exampleItem: { padding: 6, borderBottomWidth: 1, borderBottomColor: '#eee' },
  analysisContainer: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12 },
  analysisTitle: { fontWeight: '700', marginBottom: 8, color: '#333' },
  languageSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  languageBtn: { padding: 10, borderRadius: 20, backgroundColor: '#e0e0e0', flex: 1, marginHorizontal: 5 },
  languageBtnActive: { backgroundColor: '#4a90e2' },
  languageBtnText: { textAlign: 'center', fontWeight: '500', color: '#333' },
  languageBtnTextActive: { color: '#fff' },
  translatedTextContainer: { padding: 12, backgroundColor: '#f0f8ff', borderWidth: 1, borderColor: '#b8daff', borderRadius: 10, minHeight: 60, marginBottom: 12 },
  translatedText: { fontSize: 16 },
  translateBtn: { height: 50, backgroundColor: '#4CAF50', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  generateBtn: { height: 50, backgroundColor: '#4CAF50', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  stepIndicator: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  step: { backgroundColor: '#e0e0e0', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 15, flex: 1, marginHorizontal: 5 },
  stepActive: { backgroundColor: '#4a90e2' },
  stepText: { fontSize: 12, color: '#666', textAlign: 'center' },
  stepTextActive: { color: '#fff' },
  status: { marginTop: 12, textAlign: 'center', color: '#666', marginBottom: 12 },
  statusError: { color: '#e53935' },
});

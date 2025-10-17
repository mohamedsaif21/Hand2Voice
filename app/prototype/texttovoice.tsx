import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TextToVoice() {
  const router = useRouter();

  const [textInput, setTextInput] = useState('');
  // default target language set to Tamil for translation/tts
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

  // Only English example phrases are shown for quick testing
  const examplePhrases = {
    en: [
      'Hello, how are you?',
      'Where is the train station?',
      'I am hungry.',
      'How much does this cost?',
      'Where is the bathroom?',
      'I need water.',
      'Thank you very much.',
      'Can you help me?',
      'What time is it?',
      'I love this place.',
    ],
  };

  const translations: Record<'en' | 'ta' | 'hi' | 'ml', Record<string, string>> = {
    en: {
      hello: 'Hello',
      hi: 'Hi',
      'thank you': 'Thank you',
      thanks: 'Thanks',
      'how are you': 'How are you?',
      'good morning': 'Good morning',
      'good evening': 'Good evening',
      'good night': 'Good night',
      'see you later': 'See you later',
      'nice to meet you': 'Nice to meet you',
      water: 'Water',
      food: 'Food',
      help: 'Help',
      yes: 'Yes',
      no: 'No',
      please: 'Please',
      sorry: 'Sorry',
      excuse: 'Excuse me',
      bathroom: 'Bathroom',
      station: 'Station',
      hungry: 'Hungry',
      tired: 'Tired',
      happy: 'Happy',
      sad: 'Sad',
      love: 'Love',
      time: 'Time',
      cost: 'Cost',
      price: 'Price',
      where: 'Where',
      what: 'What',
      when: 'When',
      how: 'How',
      why: 'Why',
    },
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

  // Test connectivity to the API server
  const testConnectivity = async () => {
    const host = '10.98.146.16';
    const port = '5000';
    const apiPath = '/generate_audio_mp3';
    const apiUrl = `http://${host}:${port}${apiPath}?text=வணக்கம்&lang_code=ta`;
    
    console.log('Testing connectivity to:', apiUrl);
    
    try {
      // First, try a simple connectivity test with GET request
      const testResponse = await fetch(apiUrl, {
        method: 'GET',
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      console.log('Connectivity test response status:', testResponse.status);
      return true;
    } catch (error: any) {
      console.error('Connectivity test failed:', error);
      return false;
    }
  };

  const generateAudio = async () => {
    if (!originalText) {
      setStatus('Please analyze text first');
      setIsError(true);
      return;
    }
    setIsGenerating(true);
    setStatus('Testing connectivity...');
    setIsError(false);
    
    try {
      // Use the correct LAN address and port for the TTS API
      const host = '10.98.146.16';
      const port = '5000';
      const apiPath = '/generate_audio_mp3';

      console.log('Using API endpoint:', `http://${host}:${port}${apiPath}`);
      
      // Test connectivity first
      const isConnected = await testConnectivity();
      if (!isConnected) {
        throw new Error('Cannot connect to the API server. Please check if the server is running on 10.98.146.16:5000');
      }
      
      setStatus('Connected! Generating audio...');

      // Set up audio mode first
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      // NOTE: The project originally included code to require local test MP3s.
      // Those `require(...)` calls are static and Metro will try to resolve them at bundle time.
      // If those files are not present, Metro fails with "Unable to resolve module ... output_en.mp3".
      // To avoid bundling errors we don't include static requires here; use the server flow below
      // or add validated assets to the project and import them from a stable assets directory.

        // Ensure the URL is built correctly
  const textToUse = translatedText || originalText; // Use the translated text if available

  // Choose TTS language code expected by backend (if backend expects different codes, adjust map)
  const langCodeForBackend = (ttsLangMap as any)[currentLang] || currentLang;

  // Use the correct API endpoint format with GET request and query parameters
  const apiUrl = `http://${host}:${port}${apiPath}?text=${encodeURIComponent(textToUse)}&lang_code=${encodeURIComponent(langCodeForBackend)}`;
      console.log('Attempting to fetch audio from:', apiUrl);
      
      if (Platform.OS === 'web') {
        console.log('Using web audio playback method; sending GET request to generate audio');
        try {
          const resp = await fetch(apiUrl, { 
            method: 'GET', 
            mode: 'cors'
          });
          if (!resp.ok) {
            const body = await resp.text().catch(() => '<no-body>');
            throw new Error(`Server responded with ${resp.status} ${resp.statusText}. Response body: ${body}`);
          }

          const contentType = resp.headers.get('content-type') || '';
          if (!contentType.includes('audio') && !contentType.includes('mpeg') && !contentType.includes('mp3')) {
            const body = await resp.text().catch(() => '<no-body>');
            throw new Error(`Unexpected content-type: ${contentType}. Body: ${body}`);
          }

          // Get the audio blob from the response
          const blob = await resp.blob();
          const audioUrl = URL.createObjectURL(blob);
          
          // Create sound from blob URL
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: audioUrl },
            { shouldPlay: true }
          );
          setSound(newSound);
        } catch (webErr: any) {
          console.error('Web audio generation or playback error:', webErr);
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
            // For mobile without FileSystem, we need to use a different approach
            // Since we can't directly stream GET response, we'll use the blob approach
            const resp = await fetch(apiUrl, { 
              method: 'GET'
            });
            
            if (!resp.ok) {
              throw new Error(`Server responded with ${resp.status} ${resp.statusText}`);
            }
            
            const blob = await resp.blob();
            const audioUrl = URL.createObjectURL(blob);
            
            const { sound: newSound } = await Audio.Sound.createAsync(
              { uri: audioUrl },
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
            // First, make the GET request to generate audio
            const resp = await fetch(apiUrl, { 
              method: 'GET'
            });
            
            if (!resp.ok) {
              throw new Error(`Server responded with ${resp.status} ${resp.statusText}`);
            }
            
            // Get the audio blob and save it to local file
            const blob = await resp.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Convert to base64 string for file writing
            const base64String = btoa(String.fromCharCode(...uint8Array));
            
            // Write the audio data to local file
            await FileSystem.writeAsStringAsync(localUri, base64String, {
              encoding: 'base64' as any,
            });
            
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
    } catch (error: any) {
      // Common causes:
      // - Backend not running or unreachable over LAN
      // - Using HTTP on Android without proper network config
      // - Wrong IP/host value
      console.error('TTS Error:', error);
      
      const errorMessage = error.message || 'Unknown error';
      const hint = `Trying to connect to: http://10.98.146.16:5000/generate_audio_mp3. Check if the TTS server is running on port 5000.`;
      
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

  function speak(text: string, lang: 'en'|'ta'|'hi'|'ml') {
    // try short code first; adjust if device needs region codes
    const langCode = lang;
    Speech.speak(text, { language: langCode });
  }

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
                  <Text style={styles.langHeader}>English:</Text>
                  {examplePhrases.en.map((p, i) => (
                    <TouchableOpacity key={`en-${i}`} style={styles.exampleItem} onPress={() => selectExample(p)}>
                      <Text>{p}</Text>
                    </TouchableOpacity>
                  ))}
                  {/* Only English examples shown for quick testing */}
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

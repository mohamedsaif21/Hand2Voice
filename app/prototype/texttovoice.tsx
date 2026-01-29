import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Stack, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TextToVoice() {
  const router = useRouter();

  // WARNING: For production, move API keys to secure storage or server
  const GOOGLE_API_KEY = 'AIzaSyCVMssVg4WqrrIvb84fBPJ4hxZYb_7Xa-A';

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
    const textToUse = (translatedText || originalText || textInput || '').trim();
    if (!textToUse) {
      setStatus('Please enter or analyze some text first');
      setIsError(true);
      return;
    }
    if (!GOOGLE_API_KEY) {
      setStatus('Missing Google API key');
      setIsError(true);
      return;
    }

    setIsGenerating(true);
    setStatus('Generating audio with Gemini TTS...');
    setIsError(false);

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Google Cloud Text-to-Speech v1 REST API
      const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(GOOGLE_API_KEY)}`;

      // Map currentLang to BCP-47 language code
      const languageCode = currentLang === 'ta' ? 'ta-IN' : currentLang === 'hi' ? 'hi-IN' : 'ml-IN';
      // Using only languageCode lets Google pick a default voice for that locale
      const payload = {
        input: { text: textToUse },
        voice: { languageCode },
        audioConfig: { audioEncoding: 'MP3' },
      } as const;

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '<no-body>');
        throw new Error(`Google TTS error ${resp.status}: ${errText}`);
      }

      const json = await resp.json();
      const base64Audio: string | undefined = json?.audioContent;
      if (!base64Audio) throw new Error('Google TTS did not return audioContent');

      const dir = (FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory || '';
      if (!dir) {
        throw new Error('No writable directory available');
      }

      const localUri = `${dir}gcloud_tts_${Date.now()}.mp3`;
      await FileSystem.writeAsStringAsync(localUri, base64Audio, { encoding: (FileSystem as any).EncodingType?.Base64 || 'base64' as any });

      const info = await FileSystem.getInfoAsync(localUri);
      if (!info.exists || (info.size ?? 0) === 0) {
        throw new Error('Saved audio file is empty or missing');
      }

      if (sound) {
        try { await sound.stopAsync(); await sound.unloadAsync(); } catch {}
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: localUri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setStatus('Playing Google TTS (auto voice)');
      setIsError(false);
    } catch (err: any) {
      console.error('Google TTS error:', err);
      setStatus('Google TTS error: ' + (err?.message || String(err)));
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

  // Device TTS helper: plays the translated text (or original text) using expo-speech
  const speakText = () => {
    const textToSpeak = translatedText || originalText || textInput;
    if (!textToSpeak || textToSpeak.trim().length === 0) {
      setStatus('Please enter some text first');
      setIsError(true);
      return;
    }

    // map currentLang to a language code; backend uses short codes (ta, hi, ml)
    const langCode = currentLang === 'ta' ? 'ta' : currentLang === 'hi' ? 'hi' : 'ml';

    try {
      Speech.speak(textToSpeak, { language: langCode, pitch: 1.0, rate: 1.0 });
      setStatus('Playing via device TTS...');
      setIsError(false);
    } catch (err: any) {
      console.error('Device TTS error:', err);
      setStatus('Device TTS error: ' + (err?.message || String(err)));
      setIsError(true);
    }
  };

  const stopSpeech = () => {
    try {
      Speech.stop();
      setStatus('Stopped device speech');
    } catch (err: any) {
      console.error('Stop speech error:', err);
    }
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

            {/* Device TTS controls */}
            <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.generateBtn, { flex: 1, marginRight: 8 }]} onPress={speakText}>
                <Text style={styles.primaryButtonText}>🔊 Play (Device TTS)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.generateBtn, { width: 90, paddingHorizontal: 8 }]} onPress={stopSpeech}>
                <Text style={styles.primaryButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>

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

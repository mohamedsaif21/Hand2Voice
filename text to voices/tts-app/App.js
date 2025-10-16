import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

// Updated to use localhost for the Flask server
const SERVER_URL = 'http://localhost:5000/generate_audio';

const LANGUAGES = [
  { code: 'ta', name: 'Tamil' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ml', name: 'Malayalam' },
];

// Example phrases for each language
const EXAMPLE_PHRASES = {
  ta: [
    "வணக்கம், எப்படி இருக்கிறாய்?", // Hello, how are you?
    "ரயில் நிலையம் எங்கே இருக்கிறது?", // Where is the train station?
    "எனக்கு பசிக்கிறது.", // I am hungry.
    "இது எவ்வளவு?", // How much is this?
    "கழிவறை எங்கே?", // Where is the bathroom?
    "எனக்கு தண்ணீர் வேண்டும்.", // I need water.
    "பிறகு பார்க்கலாம்." // See you later.
  ],
  hi: [
    "नमस्ते, आप कैसे हैं?", // Hello, how are you?
    "ट्रेन स्टेशन कहाँ है?", // Where is the train station?
    "मुझे भूख लगी है।", // I am hungry.
    "यह कितने का है?", // How much is this?
    "शौचालय कहाँ है?", // Where is the toilet?
    "मुझे पानी चाहिए।", // I need water.
    "फिर मिलेंगे।" // See you later.
  ],
  ml: [
    "നമസ്കാരം, സുഖമാണോ?", // Hello, how are you?
    "റെയിൽവേ സ്റ്റേഷൻ എവിടെയാണ്?", // Where is the railway station?
    "എനിക്ക് വിശക്കുന്നു.", // I am hungry.
    "ഇതിന് എത്ര രൂപയാണ്?", // How much is this price?
    "ടോയ്‌ലെറ്റ് എവിടെയാണ്?", // Where is the toilet?
    "എനിക്ക് വെള്ളം വേണം.", // I need water.
    "പിന്നീട് കാണാം." // See you later.
  ]
};

// Translation mappings for common phrases
const TRANSLATIONS = {
  ta: {
    "hello": "வணக்கம்",
    "hi": "வணக்கம்",
    "thank you": "நன்றி",
    "thanks": "நன்றி",
    "how are you": "நீங்கள் எப்படி இருக்கிறீர்கள்?",
    "good morning": "காலை வணக்கம்",
    "where is the train station": "ரயில் நிலையம் எங்கே இருக்கிறது?",
    "i am hungry": "எனக்கு பசிக்கிறது.",
    "how much is this": "இது எவ்வளவு?",
    "where is the bathroom": "கழிவறை எங்கே?",
    "i need water": "எனக்கு தண்ணீர் வேண்டும்.",
    "see you later": "பிறகு பார்க்கலாம்."
  },
  hi: {
    "hello": "नमस्ते",
    "hi": "नमस्ते",
    "thank you": "धन्यवाद",
    "thanks": "धन्यवाद",
    "how are you": "आप कैसे हैं?",
    "good morning": "शुभ प्रभात",
    "where is the train station": "ट्रेन स्टेशन कहाँ है?",
    "i am hungry": "मुझे भूख लगी है।",
    "how much is this": "यह कितने का है?",
    "where is the bathroom": "शौचालय कहाँ है?",
    "i need water": "मुझे पानी चाहिए।",
    "see you later": "फिर मिलेंगे।"
  },
  ml: {
    "hello": "നമസ്കാരം",
    "hi": "നമസ്കാരം",
    "thank you": "നന്ദി",
    "thanks": "നന്ദി",
    "how are you": "സുഖമാണോ?",
    "good morning": "സുപ്രഭാതം",
    "where is the train station": "റെയിൽവേ സ്റ്റേഷൻ എവിടെയാണ്?",
    "i am hungry": "എനിക്ക് വിശക്കുന്നു.",
    "how much is this": "ഇതിന് എത്ര രൂപയാണ്?",
    "where is the bathroom": "ടോയ്‌ലെറ്റ് എവിടെയാണ്?",
    "i need water": "എനിക്ക് വെള്ളം വേണം.",
    "see you later": "പിന്നീട് കാണാം."
  }
};

export default function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [langCode, setLangCode] = useState(LANGUAGES[0].code);
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showExamples, setShowExamples] = useState(false);
  const [textAnalysis, setTextAnalysis] = useState({
    wordCount: 0,
    charCount: 0,
    sentenceCount: 0,
    detectedLanguage: 'Unknown'
  });

  // Function to analyze text
  const analyzeText = () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze');
      return false;
    }

    // Perform text analysis
    const words = inputText.split(/\s+/).filter(word => word.length > 0);
    const chars = inputText.length;
    const sentences = inputText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    
    // Simple language detection (just for demo)
    let detectedLang = 'English';
    if (/[\u0B80-\u0BFF]/.test(inputText)) {
      detectedLang = 'Tamil';
    } else if (/[\u0900-\u097F]/.test(inputText)) {
      detectedLang = 'Hindi';
    } else if (/[\u0D00-\u0D7F]/.test(inputText)) {
      detectedLang = 'Malayalam';
    }

    setTextAnalysis({
      wordCount: words.length,
      charCount: chars,
      sentenceCount: sentences.length,
      detectedLanguage: detectedLang
    });

    setCurrentStep(2);
    return true;
  };

  // Function to translate text
  const translateText = () => {
    if (!inputText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate translation based on language and content
      const text = inputText.toLowerCase().trim();
      let translated = '';
      
      // Check if the text exactly matches any of our known phrases
      if (TRANSLATIONS[langCode][text]) {
        translated = TRANSLATIONS[langCode][text];
      } else {
        // Check if the text contains any of our known phrases
        let foundMatch = false;
        
        // Sort phrases by length (descending) to match longer phrases first
        const phrases = Object.keys(TRANSLATIONS[langCode]).sort((a, b) => b.length - a.length);
        
        for (const phrase of phrases) {
          if (text.includes(phrase)) {
            translated = TRANSLATIONS[langCode][phrase];
            foundMatch = true;
            break;
          }
        }
        
        // If no match found, use a generic translation
        if (!foundMatch) {
          translated = inputText;
        }
      }
      
      setTranslatedText(translated);
      setCurrentStep(3);
    } catch (err) {
      setError(`Translation error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to call the Python API and play the audio
  const generateAndPlay = async () => {
    if (!translatedText) {
      setError('Please translate text first');
      return;
    }
    
    if (loading) return; // Prevent double-clicking
    setLoading(true);
    setError(null);

    // 1. Unload previous sound object
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    
    try {
      console.log('Sending request to:', SERVER_URL);
      console.log('With data:', { text: translatedText, lang_code: langCode });
      
      // 2. Send the request to your Python/Flask server
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: translatedText,
          lang_code: langCode 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with status: ${response.status}, message: ${errorText}`);
      }

      // 3. Get the audio blob from the response
      const blob = await response.blob();
      console.log('Received audio blob:', blob.type, blob.size);
      
      // Create a URL for the blob
      const audioUrl = URL.createObjectURL(blob);
      
      // 4. Load and play the audio using the blob URL
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      
      // 5. Handle playback completion
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          // Audio finished playing
          console.log('Audio playback completed');
          // Release the blob URL when done
          URL.revokeObjectURL(audioUrl);
        }
      });
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Audio generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to select a language
  const selectLanguage = (code) => {
    setLangCode(code);
    // Reset translated text when language changes
    setTranslatedText('');
  };

  // Function to select an example phrase
  const selectExamplePhrase = (phrase) => {
    setInputText(phrase);
    setShowExamples(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Multilingual Text-to-Speech</Text>
        
        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <TouchableOpacity 
            style={[styles.step, currentStep >= 1 && styles.activeStep]}
            onPress={() => setCurrentStep(1)}
          >
            <Text style={[styles.stepText, currentStep >= 1 && styles.activeStepText]}>1. Enter Text</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.step, currentStep >= 2 && styles.activeStep]}
            onPress={() => currentStep >= 2 && setCurrentStep(2)}
          >
            <Text style={[styles.stepText, currentStep >= 2 && styles.activeStepText]}>2. Select Language</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.step, currentStep >= 3 && styles.activeStep]}
            onPress={() => currentStep >= 3 && setCurrentStep(3)}
          >
            <Text style={[styles.stepText, currentStep >= 3 && styles.activeStepText]}>3. Generate Audio</Text>
          </TouchableOpacity>
        </View>
        
        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Enter text to analyze, translate and convert to speech"
        />
        
        {/* Example Phrases Button */}
        <TouchableOpacity
          style={styles.examplesButton}
          onPress={() => setShowExamples(!showExamples)}
        >
          <Text style={styles.examplesButtonText}>
            {showExamples ? 'Hide example phrases' : 'Show example phrases'}
          </Text>
        </TouchableOpacity>
        
        {/* Example Phrases */}
        {showExamples && (
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Example Phrases:</Text>
            
            <View>
              <Text style={styles.languageHeader}>Tamil:</Text>
              {EXAMPLE_PHRASES.ta.map((phrase, index) => (
                <TouchableOpacity 
                  key={`ta-${index}`}
                  style={styles.exampleItem}
                  onPress={() => selectExamplePhrase(phrase)}
                >
                  <Text>{phrase}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View>
              <Text style={styles.languageHeader}>Hindi:</Text>
              {EXAMPLE_PHRASES.hi.map((phrase, index) => (
                <TouchableOpacity 
                  key={`hi-${index}`}
                  style={styles.exampleItem}
                  onPress={() => selectExamplePhrase(phrase)}
                >
                  <Text>{phrase}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View>
              <Text style={styles.languageHeader}>Malayalam:</Text>
              {EXAMPLE_PHRASES.ml.map((phrase, index) => (
                <TouchableOpacity 
                  key={`ml-${index}`}
                  style={styles.exampleItem}
                  onPress={() => selectExamplePhrase(phrase)}
                >
                  <Text>{phrase}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {/* Analyze Button */}
        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={analyzeText}
        >
          <Text style={styles.buttonText}>Analyze Text</Text>
        </TouchableOpacity>
        
        {/* Text Analysis */}
        {currentStep >= 2 && (
          <View style={styles.analysisContainer}>
            <Text style={styles.analysisTitle}>Text Analysis:</Text>
            <View>
              <Text style={styles.analysisItem}>Words: <Text style={styles.analysisValue}>{textAnalysis.wordCount}</Text></Text>
            </View>
            <View>
              <Text style={styles.analysisItem}>Characters: <Text style={styles.analysisValue}>{textAnalysis.charCount}</Text></Text>
            </View>
            <View>
              <Text style={styles.analysisItem}>Sentences: <Text style={styles.analysisValue}>{textAnalysis.sentenceCount}</Text></Text>
            </View>
            <View>
              <Text style={styles.analysisItem}>Language detected: <Text style={styles.analysisValue}>{textAnalysis.detectedLanguage}</Text></Text>
            </View>
          </View>
        )}
        
        {/* Language Selection */}
        {currentStep >= 2 && (
          <View style={styles.languageContainer}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  langCode === lang.code && styles.selectedLanguage,
                ]}
                onPress={() => selectLanguage(lang.code)}
              >
                <Text 
                  style={[
                    styles.languageText,
                    langCode === lang.code && styles.selectedLanguageText,
                  ]}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Translate Button */}
        {currentStep >= 2 && (
          <TouchableOpacity
            style={styles.translateButton}
            onPress={translateText}
            disabled={loading}
          >
            {loading && currentStep === 2 ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Translate</Text>
            )}
          </TouchableOpacity>
        )}
        
        {/* Translated Text */}
        {translatedText && (
          <View style={styles.translatedTextContainer}>
            <Text style={styles.translatedText}>{translatedText}</Text>
          </View>
        )}
        
        {/* Generate Button */}
        {currentStep >= 3 && (
          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateAndPlay}
            disabled={loading || !translatedText}
          >
            {loading && currentStep === 3 ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Generate & Play</Text>
            )}
          </TouchableOpacity>
        )}
        
        {/* Error Message */}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  // Step indicator styles
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  step: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#007bff',
  },
  stepText: {
    fontSize: 14,
    color: '#555',
  },
  activeStepText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Language selection styles
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    minWidth: 100,
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#4a90e2',
  },
  languageText: {
    fontWeight: '500',
    color: '#333',
  },
  selectedLanguageText: {
    color: '#fff',
  },
  // Text input styles
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  // Button styles
  analyzeButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  translateButton: {
    backgroundColor: '#17a2b8',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Example phrases styles
  examplesButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  examplesButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  examplesContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  languageHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#555',
  },
  exampleItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 5,
  },
  // Analysis styles
  analysisContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  analysisItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  analysisValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  // Translated text styles
  translatedTextContainer: {
    backgroundColor: '#e8f4f8',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#b8daff',
    marginBottom: 20,
  },
  translatedText: {
    fontSize: 16,
    color: '#333',
  },
  // Error message styles
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  instructionsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  instructionsText: {
    marginBottom: 5,
    color: '#555',
  },
});
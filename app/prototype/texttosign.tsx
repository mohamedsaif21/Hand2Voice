import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type SignPhrase = { id: number; text: string; video: number };

const SIGN_PHRASES: SignPhrase[] = [
  { id: 1, text: 'Good morning', video: require('../../assets/video/good-morning.mp4') },
  { id: 2, text: 'Thank you', video: require('../../assets/video/thank-you.mp4') },
  { id: 3, text: 'Hello', video: require('../../assets/video/hello.mp4') },
  { id: 4, text: 'Can you help me', video: require('../../assets/video/can-you-help-me.mp4') },
  { id: 5, text: 'I need help', video: require('../../assets/video/i-need-help.mp4') },
  { id: 6, text: 'I love this', video: require('../../assets/video/i-love-this.mp4') },
  { id: 8, text: 'I understand', video: require('../../assets/video/i-understand.mp4') },
  { id: 9, text: 'Let\'s go', video: require('../../assets/video/lets-go.mp4.mp4') },
];

export default function TextToSign() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const videoRef = React.useRef<Video | null>(null);

  const handlePhraseSelect = (phrase: SignPhrase) => {
    setInputText(phrase.text);
    setSelectedVideo(phrase.video);
    // Auto-play video when phrase is selected
    videoRef.current?.playAsync();
  };

  const handleConvert = () => {
    const matchedPhrase = SIGN_PHRASES.find(
      (phrase) => phrase.text.toLowerCase() === inputText.toLowerCase()
    );
    if (matchedPhrase) {
      setSelectedVideo(matchedPhrase.video);
      videoRef.current?.playAsync();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7f8' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff' }}>
        <TouchableOpacity 
          style={{ width: 40, alignItems: 'flex-start' }}
          onPress={() => router.push('/prototype/translation Mode')}
        >
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: '700', fontSize: 18 }}>Text to Sign</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Phrase Selector */}
        <View style={{ padding: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' }}>
            Quick Phrases
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            {SIGN_PHRASES.map((phrase) => (
              <TouchableOpacity
                key={phrase.id}
                onPress={() => handlePhraseSelect(phrase)}
                style={{
                  backgroundColor: inputText === phrase.text ? '#13a4ec' : '#fff',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: inputText === phrase.text ? '#13a4ec' : '#e0e0e0',
                }}
              >
                <Text style={{
                  color: inputText === phrase.text ? '#fff' : '#333',
                  fontWeight: '600',
                  fontSize: 13,
                }}>
                  {phrase.text}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Text Input */}
        <View style={{ paddingHorizontal: 12 }}>
          <TextInput 
            placeholder="Enter text to convert or select a phrase above" 
            value={inputText}
            onChangeText={setInputText}
            style={{ 
              minHeight: 100, 
              backgroundColor: '#fff', 
              borderRadius: 12, 
              padding: 16, 
              fontSize: 16,
              textAlignVertical: 'top',
              borderWidth: 1,
              borderColor: '#e0e0e0',
            }} 
            multiline 
          />
        </View>

        {/* Convert Button */}
        <View style={{ paddingHorizontal: 12, marginTop: 12 }}>
          <Pressable 
            onPress={handleConvert}
            style={{ 
              height: 50, 
              backgroundColor: '#13a4ec', 
              borderRadius: 12, 
              alignItems: 'center', 
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Convert to Sign Language</Text>
          </Pressable>
        </View>

        {/* Video Player */}
        {selectedVideo && (
          <View style={{ 
            paddingHorizontal: 12, 
            marginTop: 20,
            marginBottom: 20,
          }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              marginBottom: 12, 
              color: '#333',
              textAlign: 'center',
            }}>
              Sign Language Translation
            </Text>
            <View style={{
              backgroundColor: '#000',
              borderRadius: 12,
              overflow: 'hidden',
              aspectRatio: 16/9,
            }}>
              <Video
                ref={videoRef}
                source={selectedVideo}
                style={{ width: '100%', height: '100%' }}
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay={true}
                useNativeControls
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
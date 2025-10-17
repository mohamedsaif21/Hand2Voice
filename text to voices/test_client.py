import requests
import os
import time

# Server URL
SERVER_URL = "http://10.98.146.16:5000/generate_audio_mp3"

# Test data for different languages
test_data = [
    # Tamil phrases
    {"lang_code": "ta", "text": "வணக்கம், எப்படி இருக்கிறாய்?", "description": "Tamil: Hello, how are you?"},
    {"lang_code": "ta", "text": "ரயில் நிலையம் எங்கே இருக்கிறது?", "description": "Tamil: Where is the train station?"},
    {"lang_code": "ta", "text": "எனக்கு பசிக்கிறது.", "description": "Tamil: I am hungry."},
    {"lang_code": "ta", "text": "இது எவ்வளவு?", "description": "Tamil: How much is this?"},
    {"lang_code": "ta", "text": "கழிவறை எங்கே?", "description": "Tamil: Where is the bathroom?"},
    {"lang_code": "ta", "text": "எனக்கு தண்ணீர் வேண்டும்.", "description": "Tamil: I need water."},
    {"lang_code": "ta", "text": "நான் உன்னை காதலிக்கிறேன்.", "description": "Tamil: I love you."},
    {"lang_code": "ta", "text": "இடதுபுறம் திரும்புங்கள்.", "description": "Tamil: Turn left."},
    {"lang_code": "ta", "text": "நீங்கள் ஆங்கிலம் பேசுவீர்களா?", "description": "Tamil: Do you speak English?"},
    {"lang_code": "ta", "text": "இந்த முகவரிக்கு செல்லுங்கள்.", "description": "Tamil: Go to this address."},
    {"lang_code": "ta", "text": "பிறகு பார்க்கலாம்.", "description": "Tamil: g pro."},
    
    # Hindi phrases
    {"lang_code": "hi", "text": "नमस्ते, आप कैसे हैं?", "description": "Hindi: Hello, how are you?"},
    {"lang_code": "hi", "text": "ट्रेन स्टेशन कहाँ है?", "description": "Hindi: Where is the train station?"},
    {"lang_code": "hi", "text": "मुझे भूख लगी है।", "description": "Hindi: I am hungry."},
    {"lang_code": "hi", "text": "यह कितने का है?", "description": "Hindi: How much is this?"},
    {"lang_code": "hi", "text": "शौचालय कहाँ है?", "description": "Hindi: Where is the toilet?"},
    {"lang_code": "hi", "text": "मुझे पानी चाहिए।", "description": "Hindi: I need water."},
    {"lang_code": "hi", "text": "मैं तुमसे प्यार करता हूँ।", "description": "Hindi: I love you (M)."},
    {"lang_code": "hi", "text": "बाईं ओर मुड़ें।", "description": "Hindi: Turn left."},
    {"lang_code": "hi", "text": "क्या आप अंग्रेज़ी बोलते हैं?", "description": "Hindi: Do you speak English?"},
    {"lang_code": "hi", "text": "इस पते पर जाइए।", "description": "Hindi: Go to this address."},
    {"lang_code": "hi", "text": "बाद में मिलते हैं।", "description": "Hindi: See you later."},
    
    # Malayalam phrases
    {"lang_code": "ml", "text": "നമസ്കാരം, സുഖമാണോ?", "description": "Malayalam: Hello, how are you?"},
    {"lang_code": "ml", "text": "റെയിൽവേ സ്റ്റേഷൻ എവിടെയാണ്?", "description": "Malayalam: Where is the railway station?"},
    {"lang_code": "ml", "text": "എനിക്ക് വിശക്കുന്നു.", "description": "Malayalam: I am hungry."},
    {"lang_code": "ml", "text": "ഇതിന് എത്ര രൂപയാണ്?", "description": "Malayalam: How much is this price?"},
    {"lang_code": "ml", "text": "ടോയ്‌ലെറ്റ് എവിടെയാണ്?", "description": "Malayalam: Where is the toilet?"},
    {"lang_code": "ml", "text": "എനിക്ക് വെള്ളം വേണം.", "description": "Malayalam: I need water."},
    {"lang_code": "ml", "text": "ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു.", "description": "Malayalam: I love you."},
    {"lang_code": "ml", "text": "ഇടത്തോട്ട് തിരിയുക.", "description": "Malayalam: Turn left."},
    {"lang_code": "ml", "text": "നിങ്ങൾ ഇംഗ്ലീഷ് സംസാരിക്കുമോ?", "description": "Malayalam: Do you speak English?"},
    {"lang_code": "ml", "text": "ഈ വിലാസത്തിൽ പോകുക.", "description": "Malayalam: Go to this address."},
    {"lang_code": "ml", "text": "പിന്നീട് കാണാം.", "description": "Malayalam: See you later."}
]

# Create output directory
os.makedirs("test_output", exist_ok=True)

# Test each language
for test in test_data:
    print(f"\nTesting {test['description']}")
    
    try:
        # Send request to server
        print(f"Sending request for {test['lang_code']}...")
        response = requests.post(
            SERVER_URL,
            json={"text": test['text'], "lang_code": test['lang_code']}
        )
        
        if response.status_code == 200:
            # Save the audio file
            output_file = f"test_output/output_{test['lang_code']}.mp3"
            with open(output_file, "wb") as f:
                f.write(response.content)
            
            print(f"✅ Success! Audio saved to {output_file}")
        else:
            print(f"❌ Error: Server returned status code {response.status_code}")
            print(f"Response: {response.text}")
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Wait a bit between requests
    time.sleep(1)

print("\nTesting completed!")
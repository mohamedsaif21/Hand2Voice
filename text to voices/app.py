# -*- coding: utf-8 -*-

import os
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from gtts import gTTS

app = Flask(__name__)
CORS(app)

# Ensure temp folder exists
os.makedirs("temp_audio", exist_ok=True)

# Simple phrase translations for EN->ta/hi/ml
TRANSLATIONS = {
    "ta": {
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
        "see you later": "பிறகு பார்க்கலாம்.",
    },
    "hi": {
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
        "see you later": "बाद में मिलते हैं।",
    },
    "ml": {
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
        "see you later": "പിന്നീട് കാണാം.",
    },
}

def translate_to_target(text: str, target_lang: str) -> str:
    if not text:
        return text
    lower = text.lower().strip()
    mapping = TRANSLATIONS.get(target_lang, {})
    if lower in mapping:
        return mapping[lower]
    # partial match from longest to shortest
    for phrase in sorted(mapping.keys(), key=len, reverse=True):
        if phrase in lower:
            return mapping[phrase]
    return text

@app.route('/health', methods=['GET'])
def health() -> tuple:
    return jsonify({"status": "ok"}), 200

@app.route('/generate_audio_mp3', methods=['GET'])
def generate_audio_mp3():
    try:
        text = request.args.get('text')
        lang_code = request.args.get('lang_code')  # 'ta', 'hi', 'ml'
        if not text or not lang_code:
            return jsonify({"error": "Missing 'text' or 'lang_code'"}), 400

        # Translate server-side
        tts_text = translate_to_target(text, lang_code)

        # Generate MP3 using gTTS
        mp3_path = os.path.join("temp_audio", f"output_{lang_code}.mp3")
        tts_obj = gTTS(text=tts_text, lang=lang_code)
        tts_obj.save(mp3_path)

        response = send_file(mp3_path, mimetype="audio/mpeg", as_attachment=False)
        response.headers["X-Translated-Text"] = tts_text
        return response
    except Exception as e:
        print(f"Error generating MP3 audio: {e}")
        return jsonify({"error": f"Failed to generate audio: {str(e)}"}), 500

if __name__ == '__main__':
    # Bind on all interfaces so emulator/devices can reach it over LAN
    app.run(host='0.0.0.0', port=5000, debug=True)

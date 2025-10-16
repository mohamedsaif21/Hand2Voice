import os
from gtts import gTTS
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create a folder for temporary audio files
os.makedirs("temp_audio", exist_ok=True)

@app.route('/generate_audio', methods=['POST'])
def generate_audio():
    data = request.json
    text = data.get('text')
    lang_code = data.get('lang_code')  # 'ta', 'hi', or 'ml'
    
    if not text or not lang_code:
        return jsonify({"error": "Missing 'text' or 'lang_code'"}), 400

    output_path = f"temp_audio/output_{lang_code}.mp3"

    try:
        # Generate speech using gTTS
        tts = gTTS(text=text, lang=lang_code, slow=False)
        tts.save(output_path)
        
        # Return the audio file
        return send_file(
            output_path,
            mimetype="audio/mpeg",
            as_attachment=False  # Allows media player to stream
        )

    except Exception as e:
        print(f"Error generating audio: {e}")
        return jsonify({"error": f"Failed to generate audio: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    # Run the server
    print("Starting TTS server on http://0.0.0.0:5000")
    print("Supported languages: Tamil (ta), Hindi (hi), Malayalam (ml)")
    app.run(host='0.0.0.0', port=5000, debug=True)
# Multilingual Text-to-Speech App

This project connects a Python-based Text-to-Speech (TTS) engine (Coqui TTS) to a mobile app built with React Native Expo. The architecture consists of a Flask backend server that handles the TTS generation and a React Native Expo frontend that allows users to input text and play the generated audio.

## Project Structure

```
text-to-voices/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── temp_audio/            # Generated audio files (created at runtime)
└── tts-app/               # React Native Expo frontend
    ├── App.js             # Main app component
    ├── app.json           # Expo configuration
    ├── package.json       # Node.js dependencies
    └── assets/            # App assets
```

## Setup Instructions

### 1. Backend Setup (Python/Flask/Coqui TTS)

1. Install Python (version 3.9-3.11 recommended)

2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```bash
   python app.py
   ```
   The server will run on `http://0.0.0.0:5000`

### 2. Frontend Setup (React Native Expo)

1. Install Node.js and npm if not already installed

2. Navigate to the tts-app directory:
   ```bash
   cd tts-app
   ```

3. Install the Expo CLI globally (if not already installed):
   ```bash
   npm install -g expo-cli
   ```

4. Install the project dependencies:
   ```bash
   npm install
   ```

5. **Important**: Update the SERVER_URL in App.js with your machine's local IP address:
   ```javascript
   // In App.js, replace with your actual IP address
   const SERVER_URL = 'http://YOUR_LOCAL_IP_ADDRESS:5000/generate_audio';
   ```

6. Start the Expo development server:
   ```bash
   npm start
   ```

7. Use the Expo Go app on your mobile device to scan the QR code and run the app

## Usage

1. Select a language (Tamil, Hindi, or Malayalam)
2. Enter or edit the text in the selected language
3. Press "Generate & Play" to convert the text to speech
4. The audio will play automatically once generated

## Supported Languages

- Tamil (ta)
- Hindi (hi)
- Malayalam (ml)

## Troubleshooting

- If you encounter CORS issues, ensure the Flask server has CORS enabled (already included in the code)
- If the app cannot connect to the server, verify that:
  - The Flask server is running
  - You've updated the SERVER_URL with the correct IP address
  - Your mobile device is on the same network as the server
  - No firewall is blocking the connection

## Notes on TTS Models

The backend uses Coqui TTS's multilingual model. If you encounter issues with language support, you may need to modify the MODEL_NAME in app.py to use a different model that better supports Tamil, Hindi, and Malayalam.

## Browser-Based Speech Synthesis (Optional)

For quick testing, you can use the browser's built-in speech synthesis:

```javascript
if ('speechSynthesis' in window) {
  const utter = new SpeechSynthesisUtterance(translatedText);
  utter.lang = 'ta' // or 'hi' / 'ml' as supported
  window.speechSynthesis.speak(utter);
}
```

This uses the browser's native speech synthesis capabilities. Note that quality and language support may vary.
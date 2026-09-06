# Hand2Voice

<p align="center">
  <img src="assets/images/Hand2Voice.png" alt="Hand2Voice logo" width="140" />
</p>

<p align="center"><strong>Accessible communication tools for Indian Sign Language (ISL).</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/status-prototype-F59E0B" alt="Prototype" />
  <img src="https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-2563EB" alt="Platforms" />
  <img src="https://img.shields.io/badge/framework-Expo%2054-000020" alt="Expo 54" />
  <img src="https://img.shields.io/badge/backend-FastAPI-009688" alt="FastAPI" />
</p>

Hand2Voice is an Expo and React Native application that explores two-way communication between Indian Sign Language, text, and speech. The project includes an optional local computer-vision API for recognizing ISL fingerspelling and a set of learning and communication screens.

> This repository is an active prototype. The current recognition model focuses on alphabet signs and should not be treated as a complete ISL translation system.

## Features

- **Sign to Text:** Captures camera frames and sends them to the recognition API for alphabet predictions.
- **Text to Speech:** Speaks text in English, Hindi, Tamil, or Malayalam using Expo Speech.
- **Text to Sign:** Presents sign-language visuals for supported content.
- **Alphabet learning:** Browse A-Z sign references and practice individual letters.
- **Mobile experience:** Camera permissions, sentence building, speech playback, camera switching, and light/dark themes are handled in the client.

## Screenshots

<table>
  <tr>
    <td align="center"><strong>Onboarding</strong></td>
    <td align="center"><strong>Sign to Text</strong></td>
    <td align="center"><strong>Text to Sign</strong></td>
    <td align="center"><strong>Text to Speech</strong></td>
  </tr>
  <tr>
    <td><img src="assets/images/page%201.jpeg" alt="Onboarding screen" width="220" /></td>
    <td><img src="assets/images/Sign%20to%20Text.jpg" alt="Sign to Text screen" width="220" /></td>
    <td><img src="assets/images/Text%20to%20Sign.jpg" alt="Text to Sign screen" width="220" /></td>
    <td><img src="assets/images/Text%20to%20Speech.jpg" alt="Text to Speech screen" width="220" /></td>
  </tr>
</table>

## Architecture

```text
Expo / React Native app
  ├─ Camera capture and permissions
  ├─ Sign, text, voice, and learning screens
  └─ POST /predict ──> FastAPI recognition service
                           ├─ MediaPipe hand landmarks
                           └─ joblib alphabet classifier
```

The app uses `expo-speech` for speech synthesis. The recognition API loads `backend/alphabet_model.joblib` and `backend/data/letters_labels.json`, extracts 63 normalized hand-landmark features, and returns an alphabet prediction with confidence.

## Repository Layout

```text
app/                  Expo Router screens and shared UI
  components/         Navigation and screen components
  prototype/          Sign, text, voice, profile, and learning screens
  theme/              Shared color, spacing, and shadow tokens
assets/               Images, alphabet references, and video assets
backend/              FastAPI service, model, labels, and dataset scripts
android/              Native Android project generated for Expo
app.json              Expo application configuration
package.json          JavaScript dependencies and development scripts
```

## Requirements

- Node.js 18 or newer
- npm
- Python 3.10 or newer for the recognition API
- Android Studio and an Android emulator, or a physical device, for camera testing
- Xcode on macOS for iOS builds

## Run the mobile app

From the repository root:

```bash
npm install
npm start
```

Then choose a target from the Expo development server. The available scripts are:

```bash
npm run android   # Build and run the Android project
npm run ios       # Build and run the iOS project (macOS only)
npm run web       # Run the web target
npm run lint      # Check the TypeScript and Expo codebase
```

## Run the recognition API

Create and activate a virtual environment, then install the backend dependencies:

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1        # Windows PowerShell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt joblib
python server.py
```

The API listens on `http://localhost:8000`. Verify it with:

```text
http://localhost:8000/health
```

For the Android emulator, the mobile app defaults to `http://10.0.2.2:8000`. For a physical device, set the local machine's LAN address before starting Expo:

```powershell
$env:EXPO_PUBLIC_SIGN_API_URL = "http://192.168.1.10:8000"
npm start
```

The device and computer must be connected to the same network, and the API port must be reachable through the local firewall.

## API Reference

### `GET /health`

Returns service and model status:

```json
{
  "status": "ok",
  "model_loaded": true,
  "classes": 26
}
```

### `POST /predict`

Accepts a base64-encoded image, with or without a data-URL prefix:

```json
{
  "image_base64": "<base64 image data>"
}
```

The response includes `label`, `confidence`, `hand_detected`, and `message`. A request without a detectable hand returns `hand_detected: false` rather than a letter prediction.

## Development Notes

- The app currently recognizes alphabet gestures, not continuous words or full sentences automatically.
- The camera screen only adds predictions at or above its confidence threshold.
- Keep model preprocessing in sync with `backend/prepare_dataset.py` when retraining.
- Do not commit secrets, local environment files, or device-specific API URLs.

## Contributing

1. Create a focused branch for your change.
2. Run `npm run lint` and any relevant backend tests.
3. Update the documentation when behavior, setup, or API responses change.
4. Open a pull request with a clear description and testing notes.

## License and Dataset Attribution

Review the license files in `backend/` and the upstream dataset terms before redistributing model files or dataset images. The backend dataset documentation and citation are available in [backend/README.md](backend/README.md).

---

Built by the Hand2Voice team.

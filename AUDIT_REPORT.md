# Hand2Voice — Full Audit Report (Phases 6–15)

## Phase 6 — Backend audit

Files actually present in `backend/`: `server.py`, `train_model.py`, `collect_data.py`, `model.h5` (0 bytes), `labels.json` (empty), `requirements.txt`, `README.md` (RealSign dataset readme), `Dataset/`.

Pipeline as *intended* vs *actual*:

| Stage | File | Exists | Works now? |
|---|---|---|---|
| DATA COLLECTION | `collect_data.py` | ✅ | ✅ runs with webcam+MediaPipe, but **no data recorded yet** (no `dataset/` with `.npy`) |
| DATASET | `backend/Dataset/…` | ✅ | ❌ It is the **RealSign static A–Z image dataset**, not landmark sequences |
| PREPROCESSING | — (inline in train_model) | ❌ | ❌ N/A |
| TRAINING | `train_model.py` | ✅ | ❌ exits early: no `dataset/` folder of `.npy` |
| MODEL | `model.h5` | ❌ 0 bytes | ❌ |
| INFERENCE | — | ❌ | ❌ no inference code anywhere |
| FASTAPI | `server.py` | ✅ | ⚠️ runs (`/health` ok), but `/predict` is a stub |

**Backend verdict: the script skeleton is clean and consistent, but nothing has been executed end-to-end.**

`server.py` details:
- `/predict` only base64-validates input (server.py:31), then:
  - if model/labels missing → `{"label":"model_not_trained"}`
  - else → `{"label":"unknown"}`
- No model load, no MediaPipe hand detection, no landmark extraction, no sequence, no classification, no confidence. No CORS headers (blocks web testing), no error logging.

## Phase 7 — Dataset audit

`backend/Dataset/` **is the RealSign Indian Sign Language dataset** (letters only):

```
Dataset/
├── Letters/A.jpg … Z.jpg       # 26 reference images
├── Training/A…Z/               # ~700 JPGs per class  (H,I=699; rest 700)
├── Testing/A…Z/                # 200 JPGs per class   (all 200)
└── Validation/A…Z/             # 100 JPGs per class   (K=75, J/Q/U/Y=101)
```

Answers:
1. **What kind?** Static grayscale-ish letter JPGs of ISL fingerspelled alphabet (A–Z), 26 classes. RealSign by Boggaram et al. (CC0).
2. **Can the current model use it?** No. `train_model.py` expects `(30, 63)` landmark sequences; this is single images (e.g. 128×128×3).
3. **Needs preprocessing?** Yes — resize+normalize for a CNN, OR run each image through MediaPipe to get landmarks first.
4. **Static images or temporal sequences?** Static images only. There are **no videos / no sequences** anywhere in the repo.
5. **Compatible with existing LSTM?** No.
6. **Conversion required?** Either (a) write a new CNN trainer over 128×128 images (feasible, dataset is ready and well split), or (b) extract single-frame MediaPipe landmarks (63-d) from each image → per-frame classifier. Word-level signs (Hello, Thank-you) would still need a **new recorded sequence dataset** via `collect_data.py`.

## Phase 8 — Model compatibility

`train_model.py` expects:
- Input: `(N, 30, 63)` — 30 frames × 63 features (21 landmarks × xyz).
- Normalization done at collection: wrist origin + scale by max norm (collect_data.py:67-70).
- Labels: folders under `dataset/` (16 sign words in `SIGNS_TO_COLLECT`), one-hot order from `labels.json`.

Actual dataset: static images, no landmarks, no sequences.

**Compatibility breaks at exactly one point: dataset → preprocessing.** The scripts match each other; the data does not match the scripts.

## Phase 9 — Text → Sign audit

Mapping (hardcoded in `app/prototype/texttosign.tsx`, all files verified to exist):

| Input text | Category | Video file |
|---|---|---|
| Good morning | Greetings | `assets/video/good-morning.mp4` |
| Thank you | Greetings | `assets/video/thank-you.mp4` |
| Hello | Greetings | `assets/video/hello.mp4` |
| Can you help me | Emergency | `assets/video/can-you-help-me.mp4` |
| I need help | Emergency | `assets/video/i-need-help.mp4` |
| I love this | Feelings | `assets/video/i-love-this.mp4` |
| I understand | Daily | `assets/video/i-understand.mp4` |
| Let's go | Daily | `assets/video/lets-go.mp4.mp4` |

(`assets/video/glass.mp4` is only used on the Connect Devices page.)

- Supported phrases: exactly the 8 above.
- Text normalization: lowercase + trim only (texttosign.tsx:124).
- Phrase matching: exact match first, then substring fallback.
- Multi-word / multiple-sign playback: **not supported** — one text → one video.
- Next/previous controls: **not present**.
- Replay: yes via video controls + `playAsync`.
- Loop & speed: yes (loop toggle 0.75/1.0/1.25).
- Unsupported text: silently does nothing (no error message) → poor UX.

**To make it a complete prototype feature:** add a visible "no match" state, an explicit next/previous phrase stepper, and multi-word segmentation (chain multiple sign videos when multi-word text is entered).

## Phase 10 — Text → Voice

- Implementation: **`expo-speech`** (on-device OS TTS), language via `bcp47` (ta-IN/hi-IN/ml-IN/en-IN) (texttovoice.tsx:140).
- "Translation": a **hardcoded 8-phrase dictionary** `TRANSLATION_MAP` (4 languages) (texttovoice.tsx:53). Nothing else translates; unknown text is spoken in English regardless of selected language.
- No Google/Gemini API, no API keys, **no exposed credentials anywhere** (verified by grep across `.ts/.tsx/.py/.json`).
- Fallback TTS: none beyond the dictionary → repeated English.
- Error handling: `onError/onStopped/onDone` reset playing state (good).

## Phase 11 — History

`history.tsx` is **mock/stub**: `INITIAL_HISTORY` hardcoded (history.tsx:29), in-memory `useState`, nothing persists; nothing besides the page itself writes to it. Simplest prototype fix (no Firebase): **AsyncStorage** (or expo-file-system JSON) — store last N {type, source, translated, timestamp} on sign-to-text and text-to-voice actions.

## Phase 12 — Firebase

- `firebase-admin@^13.5.0` is in `package.json` but **`firebase-admin` is a server-side SDK** and is **never imported** in app/ code.
- **No Firebase config, no auth, no Firestore, no storage initialization exists anywhere** (grep found nothing).
- Verdict: Firebase is effectively not integrated. For the prototype, **postpone it** — replace with local storage for history and a local/soft auth for login. Remove or ignore `firebase-admin` afterwards.

## Phase 13 — Environment & security

- `.env`: single var `EXPO_PUBLIC_SIGN_API_URL=http://192.168.1.42:8000`. No secrets/API keys present.
- Frontend default fallback: `http://10.0.2.2:8000` (signtotext.tsx:56) — the Android-emulator loopback.
- No `localhost` in committed code for the API beyond fallback; the hardcoded LAN IP is environment-specific.

Works on:
- **PC**: ✅ if FastAPI runs locally and frontend uses `http://localhost:8000` (web) — but server has no CORS headers, so browser requests will be blocked until CORS is added.
- **Android emulator**: ✅ `http://10.0.2.2:8000` reaches host.
- **Physical Android phone**: needs the PC's LAN IP (`192.168.1.42` present in `.env`) ⚠️ and firewall port 8000 open; the server binds `0.0.0.0` ✅.

Note `Signtotext` sends **base64 photos** over HTTP — contains user imagery. Over a LAN it's acceptable for a prototype; flag HTTPS for anything remote.

## Phase 14 — Dependency audit

`package.json`: Expo **SDK 54**, React Native **0.81.4**, React 19.1.0, expo-router ~6.0.11, expo-camera ~17, expo-av ~16, expo-speech ~14.

**Unused / unnecessary** (not imported anywhere in `app/`):
- `firebase-admin` (server SDK, unused)
- `react-native-vision-camera`, `vision-camera-resize-plugin`, `react-native-worklets-core`, `react-native-worklets` (app uses `expo-camera` instead)
- `@react-navigation/*` (app uses `expo-router`)
- `expo-file-system`, `expo-haptics`, `expo-image`, `expo-symbols`, `expo-system-ui`, `expo-web-browser` (not currently imported; `expo-file-system` may be useful for history later)

**Used**: expo, expo-router, expo-camera, expo-av, expo-speech, expo-linear-gradient, expo-font (via vector-icons), react-native-safe-area-context, expo-splash-screen, expo-status-bar, expo-constants, expo-linking, @expo/vector-icons, react, react-native, react-native-web.

No version conflicts observed. `metro.config.js` registers `.tflite` but no tflite model exists → dead config for now.

Backend Python (installed on this machine): fastapi 0.110, uvicorn 0.27, numpy 1.26, opencv 4.13 (and headless), pillow, pydantic. **TensorFlow and MediaPipe are NOT installed** → `collect_data.py` / `train_model.py` cannot run yet.

## Phase 15 — Problems found (severity)

CRITICAL
1. `/predict` is a stub — SIGN → TEXT is dead (server.py:25-38).
2. `model.h5` is 0 bytes / no trained model; `labels.json` empty.
3. No landmark-sequence dataset exists → LSTM trainer has no data.
4. Stated architecture (LSTM on sequences) vs actual data (static letter images) are incompatible.

HIGH
5. Dataset-only path not reflected in train script (needs CNN trainer over A–Z images).
6. `firebase-admin` installed but Firebase never configured (README claims auth/storage).
7. Text→Sign silently fails on unsupported phrases.
8. History is mock data with no persistence.
9. No CORS on FastAPI → web fallback can't call it.
10. `translation Mode.tsx` filename space — fragile routing.

MEDIUM
11. Login/profile/settings/ConnectDevices are decorative; may mislead graders into thinking features exist.
12. Text→Voice claims "Gemini TTS / Neural" but uses device TTS + an 8-phrase dictionary.
13. README and app.json reference missing assets (`hand2voice-banner.png`, `favicon.png`, case `Hand2voice.png` vs `Hand2Voice.png`), and README describes a different old structure.
14. `lets-go.mp4.mp4` double extension.
15. Translation Hub shows fake streaks/stats ("15 of 20", "3 days") that imply real tracking.

LOW
16. Unused deps bloat bundle (~vision-camera stack, @react-navigation, firebase-admin, ScreenHeader dead component).
17. `RealSign-Indian-Sign-Language-Dataset/` empty folder.
18. No `console.log` issues (none found); no hardcoded secrets; no TODO/FIXME markers in app code.

**No exposed API keys or secrets were found.**
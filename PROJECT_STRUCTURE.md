# Hand2Voice — Real Project Structure (Phase 2)

Discovered directly from the filesystem on 2026-09-05. No files invented.

```
Hand2Voice/
├── .expo/                          # Auto-generated Expo dev cache (ignored, safe to delete)
├── .vscode/                        # Editor settings
├── android/                        # Pre-generated native Android project (Gradle)
├── app/                            # Active Expo Router app
│   ├── _layout.tsx                 # Root Stack navigator — registers every route
│   ├── index.tsx                   # Redirects / → /prototype/onboarding
│   ├── components/
│   │   ├── AppBottomNav.tsx        # Shared 5-tab bottom navigation (mobile only pattern)
│   │   └── ScreenHeader.tsx        # Shared header component — NOT imported anywhere
│   ├── prototype/                  # All feature screens
│   │   ├── onboarding.tsx          # 3-slide onboarding
│   │   ├── translation Mode.tsx    # Home / translation hub (filename has SPACE)
│   │   ├── signtotext.tsx          # Camera AI screen
│   │   ├── signtotext.web.tsx      # Web/simulator variant of same route
│   │   ├── texttosign.tsx          # Video phrase player
│   │   ├── texttovoice.tsx         # TTS studio
│   │   ├── alphabet.tsx            # A–Z letter learning grid
│   │   ├── signdetails.tsx         # "Sign Dictionary" detail page (Hello only)
│   │   ├── login.tsx               # Sign-in/up UI (no auth)
│   │   ├── history.tsx             # Translation history (mock data)
│   │   ├── profile.tsx             # Profile UI (mock)
│   │   ├── settings.tsx            # Settings UI (mock)
│   │   └── ConnectDevices.tsx      # AR device pairing UI (mock)
│   └── theme/
│       └── index.ts                # PALETTE / RADIUS / SHADOWS design tokens
├── app-example/                    # Default Expo starter template (ignored in .gitignore)
├── assets/
│   ├── alphabet/A.jpg … Z.jpg      # 26 ISL letter reference images (used by alphabet.tsx)
│   ├── images/                     # Logos, onboarding pages, mode-card banners
│   └── video/                      # 9 ISL phrase videos (used by text→sign, signdetails, ConnectDevices)
├── backend/                        # Python backend
│   ├── Dataset/
│   │   ├── Letters/A.jpg … Z.jpg   # 26 letter reference images (copy source)
│   │   ├── Training/A–Z/           # ≈700 static JPGs per class
│   │   ├── Testing/A–Z/            # 200 static JPGs per class
│   │   └── Validation/A–Z/         # ≈100 static JPGs per class (K has 75)
│   ├── collect_data.py             # Webcam landmark-sequence recorder (needs MediaPipe + webcam)
│   ├── train_model.py              # LSTM trainer expecting dataset/<label>/*.npy
│   ├── server.py                   # FastAPI app — STUB, returns {"label":"unknown"}
│   ├── model.h5                    # 0 bytes — EMPTY, no trained model
│   ├── labels.json                 # EMPTY (0 lines)
│   ├── requirements.txt            # Pinned Python deps
│   └── README.md                   # RealSign dataset README (downloaded with dataset)
├── RealSign-Indian-Sign-Language-Dataset/  # EMPTY folder (0 files)
├── .env                            # EXPO_PUBLIC_SIGN_API_URL=http://192.168.1.42:8000
├── .gitignore
├── .gitattributes
├── app.json                        # Expo config (Expo SDK 54)
├── eslint.config.js                # Lint config
├── expo-env.d.ts                   # Generated Expo types
├── metro.config.js                 # Metro (adds .tflite to assetExts)
├── package.json                    # JS deps
├── package-lock.json
├── prompt.txt                      # This project plan
├── README.md                       # Marketing-style README (mentions files that don't exist)
└── tsconfig.json
```

---

## File-by-file assessment

### `app/` — Active frontend code
| Path | Contains | Status / Notes |
|---|---|---|
| `app/_layout.tsx` | Root `<Stack>` registering all 12 routes | **Active** — main navigator |
| `app/index.tsx` | `<Redirect href="/prototype/onboarding" />` | **Active** — entry redirect |
| `app/components/AppBottomNav.tsx` | 5-tab nav (Translate/Learn/History/Profile/Settings) | **Active** — used on home, alphabet, signdetails, history, profile, settings |
| `app/components/ScreenHeader.tsx` | Reusable header | **Unused** — no screen imports it (dead code) |
| `app/theme/index.ts` | Colors / radii / shadows | **Active** — imported by every screen |
| `app/prototype/onboarding.tsx` | 3 onboarding slides | **Active**, UI-only |
| `app/prototype/translation Mode.tsx` | Translation Hub home | **Active**, UI-only (space in filename) |
| `app/prototype/signtotext.tsx` | Camera → POST `/predict` | **Active** but non-functional end-to-end (see audit) |
| `app/prototype/signtotext.web.tsx` | Mock simulator for web | **Active** on web builds, fully mock |
| `app/prototype/texttosign.tsx` | Phrase → video player | **Active**, works locally with bundled videos |
| `app/prototype/texttovoice.tsx` | expo-speech TTS + 4-language dictionary | **Active**, works locally |
| `app/prototype/alphabet.tsx` | A–Z grid + modal | **Active**, works (26 images exist) |
| `app/prototype/signdetails.tsx` | "Sign Dictionary" (Hello only) | **Active**, static/hardcoded |
| `app/prototype/login.tsx` | Fake login form | **Active**, UI-only |
| `app/prototype/history.tsx` | History list (mock) | **Active**, mock data only |
| `app/prototype/profile.tsx` | Profile (mock) | **Active**, UI-only |
| `app/prototype/settings.tsx` | Settings (mock) | **Active**, UI-only |
| `app/prototype/ConnectDevices.tsx` | AR glasses pairing (mock) | **Active**, UI-only |

### `assets/`
| Path | Status |
|---|---|
| `alphabet/A–Z.jpg` | Used by `alphabet.tsx` + `signdetails.tsx` — **all exist** |
| `video/*.mp4` (9 files) | Used by `texttosign.tsx` (8), `signdetails.tsx` (hello.mp4), `ConnectDevices.tsx` (glass.mp4) — **all exist** |
| `images/` | 10 files; `Hand2Voice.png`, `Sign to Text.jpg`, `Text to Sign.jpg`, `Text to Speech.jpg`, `page 1–4.jpeg`, `Logo H2V.png`. **Missing** files referenced in app.json (case `Hand2voice.png` differs) and README (`hand2voice-banner.png`, `signtotext.png`, `favicon.png`) |

### `backend/`
| Path | Contains | Status |
|---|---|---|
| `server.py` | FastAPI `/health` + `/predict` | **Stub** — no model load, no MediaPipe, always returns `{"label":"unknown"}` |
| `collect_data.py` | MediaPipe landmark sequence recorder for 16 word signs | **Unused** so far — lands in `dataset/`, produces `.npy` |
| `train_model.py` | LSTM(30,63) trainer | **Unused** so far — expects `dataset/<label>/*.npy` |
| `model.h5` | 0 bytes | **Broken/empty** — server returns `model_not_trained` |
| `labels.json` | 0 lines | **Empty** |
| `Dataset/` | RealSign static image dataset A–Z | **Present but unrelated to the LSTM pipeline** |
| `README.md` | RealSign dataset readme (not the backend readme) | Misplaced |
| `requirements.txt` | fastapi, uvicorn, mediapipe, opencv, numpy, tensorflow, pillow | Matches intended pipeline |

### Root config
| Path | Status |
|---|---|
| `.env` | 1 var: `EXPO_PUBLIC_SIGN_API_URL=http://192.168.1.42:8000` — hardcoded PC LAN IP |
| `app.json` | SDK 54, package `com.anonymous.Hand2Voice`, camera permission configured |
| `metro.config.js` | Adds `.tflite` asset support (no tflite used yet) |
| `tsconfig.json` | Strict, path alias `@/*`, excludes `app-example` |
| `eslint.config.js` | expo flat config |
| `README.md` | Marketing copy; describes a different/older structure (firebaseConfig.js, model_conversion/, text to voices/, SignLanguageDetectionUsingML/) — **out of date** |
| `RealSign-Indian-Sign-Language-Dataset/` | Empty dir — leftover, can be removed |

## Highlights
1. `app-example/` is the untouched Expo starter template (gitignored) — safe to delete.
2. `ScreenHeader.tsx` is dead code.
3. `behind the scenes`: the ML pipeline exists only as *scripts* — no recorded sequences, no trained model, no real inference.
4. The static A–Z image dataset is **fully independent** from the LSTM scripts (which want `.npy` sequences).
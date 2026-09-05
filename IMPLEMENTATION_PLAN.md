# Hand2Voice — Implementation Plan (Phases 16–19)

## Phase 16 — Target architecture (simplest correct design)

```
                HAND2VOICE
                    |
        ┌───────────┴───────────┐
        |                       |
   SIGN → TEXT              TEXT → SIGN
        |                       |
     CAMERA                  TEXT INPUT
        |                       |
    Photo (900ms)          Phrase matcher
        |                       |
      FastAPI                 ISL videos
        |                       |
     MediaPipe (21×3)       (8 bundled mp4s)
        |                       |
    Normalize 63-d
        |
   Classifier (MLP)
        |
 {label, confidence,
  hand_detected}
        |
   Letter / word chip
        |
  Sentence → Speech
```

No over-engineering: keep the existing single FastAPI endpoint, reuse the existing `PredictResponse` contract the frontend already expects.

## Key data-driven decision

The repo contains **a ready, split, static A–Z image dataset** (RealSign, 26 classes) and **NO temporal data**. The existing LSTM scripts expect `.npy` sequences that don't exist.

Practical prototype:
- **SIGN → TEXT v1 = ISL ALPHABET (A–Z) recognition** built on the RealSign dataset via **single-frame MediaPipe landmarks → small MLP classifier**. Light, CPU-trainable in seconds.
- Word-level signs (HELLO, THANK YOU, …) via the LSTM pipeline are **deferred to Stage 10** — they require real sequence recording (`collect_data.py`) which cannot be conjured, and shouldn't block the prototype.
- **TEXT → SIGN is already 80% working** (8 videos) → just polish (Stage 11).

## Phase 17 — Recommended prototype vocabulary (honest)

SIGN → TEXT v1 (fully supported today):
- ISL **letters A–Z** (26 classes) from RealSign dataset.

SIGN → TEXT v2 (after collecting new data): HELLO, THANK YOU, YES, NO, PLEASE, SORRY, HELP, WATER, FOOD, HOME, GOOD, BAD, I, YOU, NAME, FRIEND (the 16 in `SIGNS_TO_COLLECT`).

TEXT → SIGN (video library, already present): Good morning, Thank you, Hello, Can you help me, I need help, I love this, I understand, Let's go.

We will **not** claim full ISL translation anywhere.

---

## Stage 1 — Environment verification
- **Inspect only.** Proven: Python 3.10.6, fastapi/uvicorn/numpy/opencv/pillow installed. ❌ `mediapipe`, `tensorflow`, `scikit-learn` missing.
- **Do**: `pip install mediapipe scikit-learn joblib` (no TF needed for the alphabet MLP; keeps install light).
- **Verify**: `python -c "import mediapipe, sklearn, joblib, cv2, numpy; print('ok')"`.
- Expected: prints `ok`.
- Testing: run the import; open a webcam frame through MediaPipe hands later.
- **DoD**: imports succeed; record installed versions in `backend/requirements.txt`.

## Stage 2 — Dataset preparation
- **Files to create**: `backend/prepare_dataset.py`
- **Files modified**: `backend/requirements.txt` (add mediapipe, scikit-learn, joblib)
- **Files NOT to touch**: `backend/Dataset/**` (raw data stays read-only), `server.py` until Stage 6.
- **Do**: walk `backend/Dataset/Training|Validation|Testing/<A–Z>/*.jpg`, detect the hand with MediaPipe, extract normalized 63-d landmarks (wrist-origin + max-norm — reuse `collect_data.py` logic), skip files with no hand.
- **Output**: `backend/data/train_X.npy, train_y.npy, val_X.npy, val_y.npy, test_X.npy, test_y.npy` + `backend/data/letters_labels.json`.
- **Command**: `python prepare_dataset.py`
- **Testing**: print per-class counts + total; expect ≈26 classes, ≈700/100/200 splits (minus skipped no-hand images).
- **DoD**: `.npy` files exist, shapes `(N,63)`, labels match A–Z.

## Stage 3 — Model training
- **Files to create**: `backend/train_letters.py`
- **Do**: `sklearn.neural_network.MLPClassifier(hidden_layer_sizes=(128,64), early_stopping=True, max_iter=300)` trained on train_X/y, scored on val.
- **Output**: `backend/letters_model.joblib` + `letters_labels.json`.
- **Command**: `python train_letters.py`
- **Expected**: val accuracy ≥ ~85% (RealSign is easy for letters; aim high).
- **DoD**: model file saved; val accuracy printed.

## Stage 4 — Model evaluation
- **Files to create**: `backend/evaluate_letters.py`
- **Do**: predict on the untouched Testing split; print accuracy + per-letter confusion summary.
- **Command**: `python evaluate_letters.py`
- **Target**: ≥ 90% test accuracy for the alphabet.
- **DoD**: test-set metrics reported; any weak letters (e.g., M/N, U/V) logged for later augmentation.

## Stage 5 — FastAPI inference
- **Files to modify**: `backend/server.py`
- **Do**:
  - Load `letters_model.joblib` + labels at startup.
  - `/predict`: validate base64 → decode → `cv2.imdecode` → MediaPipe → 63-d normalize → `model.predict_proba` → top label + confidence + `hand_detected` flag with `HTTPException(400)` on invalid/empty.
  - Add **CORS middleware** (`allow_origins=["*"]` for dev).
  - Keep `{"label":"model_not_trained"}` behavior only when model file absent.
- **Files NOT to touch**: train_model.py / collect_data.py / labels.json (old LSTM artifacts stay until Stage 10).
- **Command**: `python server.py` (binds 0.0.0.0:8000).
- **Testing**: `curl -X POST localhost:8000/predict -H "Content-Type: application/json" -d '{"image_base64":"<b64 of a letter jpg>"}'` → expect `{"label":"A","confidence":0.9x,"hand_detected":true}`.
- **DoD**: real predictions with confidence; `/health` still ok; CORS present.

## Stage 6 — API test (incl. physical device)
- **Do**: test from a phone on the same LAN using `http://192.168.1.42:8000/predict`; confirm firewall allows 8000.
- **Files**: none.
- **DoD**: phone POST returns a confident letter.

## Stage 7 — Expo camera integration
- **Files to modify**: `app/prototype/signtotext.tsx` (+ keep `signtotext.web.tsx` for simulator).
- **Do**: predictions flow now works because response shape matches; update `.env` → `http://192.168.1.42:8000` for phone, `http://10.0.2.2:8000` for emulator. Add visible connection/error state (fail loudly instead of silent catch, signtotext.tsx:103).
- **Files NOT to touch**: other screens.
- **Testing**: `npx expo start` → Android device/emulator → hold up letters → see label + %.
- **DoD**: SIGN→TEXT shows live A–Z letters with confidence ≥ threshold.

## Stage 8 — Prediction stabilization
- **Files to modify**: `app/prototype/signtotext.tsx`
- **Do**: letter debounce — require the same letter N frames in a row before accepting; flash feedback; optionally haptics (expo-haptics already installed). Add "uppercase spelling" mode for the sentence builder so letters concatenate into words.
- **DoD**: jitter between M↔N/U↔V suppressed; stable display.

## Stage 9 — Sentence builder
- **Files to modify**: `app/prototype/signtotext.tsx`
- **Do**: when model outputs letters → append to spelling; a long-press/pause finalizes the word; speak + save to history. Keep existing chip edit/clear.
- **DoD**: user can spell and speak a short word.

## Stage 10 — Sign → Text → Voice (+ future word signs)
- **Files to modify**: `app/prototype/signtotext.tsx` (auto-speak flag from settings).
- **Optional/deferred**: word-level LSTM — requires running `collect_data.py` to record sequences, then `train_model.py`. **Do not attempt until alphabet path is proven.** If attempted, expected output is `dataset/<sign>/*.npy` + `model.h5`.
- **DoD**: recognized text can be spoken via expo-speech automatically.

## Stage 11 — Text → Sign polish
- **Files to modify**: `app/prototype/texttosign.tsx`; create shared phrase registry (e.g., `app/data/phrases.ts`) to reuse in history + hub.
- **Do**: (1) fix `lets-go.mp4.mp4` → `lets-go.mp4`; (2) next/prev stepper in player; (3) visible "No video for '<text>' — try these:" fallback with suggested chips; (4) multi-word chaining (two videos in sequence).
- **DoD**: typing any of the 8 phrases (with punctuation/case variations) plays the right video; unknown text shows helpful UI.

## Stage 12 — History (local storage, no Firebase)
- **Files to create**: `app/lib/storage.ts` (AsyncStorage JSON, capped 50 entries).
- **Dependency**: `npx expo install @react-native-async-storage/async-storage` (or reuse `expo-file-system` already installed).
- **Files to modify**: `app/prototype/history.tsx` (read/write real entries), `signtotext.tsx` + `texttovoice.tsx` (append entries on action).
- **DoD**: history persists across app restarts; empty state real.

## Stage 13 — Security / config cleanup
- **Files to modify**: `app.json` (asset refs/case), remove fake claims in `translation Mode.tsx` + `texttovoice.tsx` (unless implemented), update `README.md` to the real structure, delete `RealSign-Indian-Sign-Language-Dataset/` empty dir.
- **Do**: keep API URL in `.env` (never commit real keys); rename route `translation Mode` → `translation-mode.tsx` (+ `_layout.tsx` + `AppBottomNav` + home navs).
- **DoD**: no fake "GEMINI TTS"/streak claims; README accurate; no secrets.

## Stage 14 — Testing
- **Do**: manual test matrix — onboarding → hub → each mode on web + Android; offline behavior; phone <-> laptop LAN; restart persistence.
- **DoD**: SIGN→TEXT, TEXT→SIGN, TEXT→VOICE demonstrable in one demo script.

## Stage 15 — Android APK
- **Do**: `npx expo prebuild --platform android` (repo already has `android/`); `cd android && gradlew assembleRelease` (or EAS build).
- **Watch**: camera permission in `app.json` already present; ensure backend URL is reachable from the APK (LAN IP or tunneled HTTPS).
- **DoD**: installable `.apk` opening to onboarding, both core modes working.

---

## Order of execution (phase 19 workflow)
1. AUDIT ✅ (this run)
2. FIX DATASET (Stage 2–4)
3. FIX FASTAPI (Stage 5)
4. TEST API (Stage 6)
5. CONNECT EXPO (Stage 7–9)
6. COMPLETE TEXT→SIGN (Stage 11)
7. ADD VOICE (Stage 10 — mostly done)
8. ADD HISTORY (Stage 12)
9. FINAL TEST (Stage 14)
10. APK (Stage 15)

We complete **one stage at a time** and test before moving forward.
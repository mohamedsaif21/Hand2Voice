# Hand2Voice — Frontend Audit (Phases 3–4)

## Screen status summary

| Screen | File | Status | Working | Missing | Problems |
|---|---|---|---|---|---|
| Root redirect | `app/index.tsx` | Working | ✅ | — | None |
| Onboarding | `app/prototype/onboarding.tsx` | Working (UI) | ✅ | — | Claims features that don't exist (900ms detection, AR) |
| Translation Hub (home) | `app/prototype/translation Mode.tsx` | Working (UI) | ✅ | — | **Space in filename**; hardcoded fake streaks/stats; claims "GEMINI TTS" that isn't used |
| Sign to Text (mobile) | `app/prototype/signtotext.tsx` | Broken e2e | ❌ | Real `/predict` response with hand_detected/confidence | Sends photos to stub backend → always no result; "SEARCHING HAND" forever |
| Sign to Text (web) | `app/prototype/signtotext.web.tsx` | Mock | ⚠️ | Real capture | Pure simulator with hardcoded gestures |
| Text to Sign | `app/prototype/texttosign.tsx` | Working (local videos) | ✅ | Next/Prev controls, unsupported-text feedback, multi-word chaining | Only 8 phrases; silent failure on unknown text; `lets-go.mp4.mp4` (works but ugly) |
| Text to Voice | `app/prototype/texttovoice.tsx` | Working (device TTS) | ✅ | Real translation API | 4-lang phrase dictionary (8 phrases); falls back to passing English through; "Neural/Gemini" claims are false |
| Alphabet | `app/prototype/alphabet.tsx` | Working | ✅ | — | Fine as static reference module |
| Sign Details | `app/prototype/signdetails.tsx` | UI/static | ⚠️ | Dynamic selection | Hardcoded "Hello" video/steps/IPA only |
| Login | `app/prototype/login.tsx` | UI-only | ❌ | Real auth | `handleSubmit` just navigates (login.tsx:31); Google/Apple buttons just navigate |
| Profile | `app/prototype/profile.tsx` | UI-only | ❌ | Real data | Hardcoded user "Hand2Voice Champion", stats, devices |
| Settings | `app/prototype/settings.tsx` | UI-only | ❌ | Persistence | Toggles do nothing; "Clear Cache" shows fake Alert |
| History | `app/prototype/history.tsx` | Stub/mock | ❌ | Persistence + real writes | `INITIAL_HISTORY` hardcoded (history.tsx:29); lost on restart |
| Connect Devices | `app/prototype/ConnectDevices.tsx` | Stub/mock | ❌ | Real BLE | Fake device list; fake "scan" Alert |

Legend: ✅ works, ⚠️ partial/mock, ❌ not working.

## Screens trakced for prototype priority
- **Must fix**: `signtotext.tsx` (SIGN → TEXT), `texttosign.tsx` (TEXT → SIGN).
- **Nice after core works**: `texttovoice.tsx` (already mostly works), `history.tsx` (needs persistence).
- **Defer**: login, profile, settings, ConnectDevices (all decorative UI).

---

## Navigation audit (Phase 4)

`index.tsx` → `/prototype/onboarding` → (`Skip` / `Get Started`) → `/prototype/translation Mode` → hub.

```
USER
 └─ /  (Redirect)
     └─ Onboarding            onboarding.tsx
         ├── Login            login.tsx            ← "Already have an account?"
         └── Translation Hub  "translation Mode"   ← SPACE in route
             ├── Sign to Text     signtotext(.web) ← camera
             ├── Text to Sign     texttosign        ← videos
             ├── Text to Voice    texttovoice        ← TTS
             ├── Alphabet         alphabet           ← quick pill "A-Z Alphabet"
             ├── History          history            ← quick pill "History"
             ├── Connect Devices  ConnectDevices     ← AR glasses quick pill
             ├── Profile          profile            ← header person icon
             └── Settings         settings           ← from profile header
             └── (learn tab) → SignDetails → Alphabet (via signdetails/alphabet)
```

### Checks
- **Route files vs `_layout.tsx`**: all 12 registered screens exist as files. ✅
- **Filename with space**: `prototype/translation Mode.tsx` → route contains a space. Expo Router URL-encodes it; navigation via the string constant works on native, but it violates Expo Router conventions, breaks typed-routes deduplication, and is fragile. **Rename to `translation-mode.tsx`** and update `_layout.tsx` + all `router.push('/prototype/translation Mode')` + `AppBottomNav` references.
- **Duplicate route**: `signtotext.tsx` + `signtotext.web.tsx` are two platform variants of the SAME route `/prototype/signtotext` (web uses `.web.tsx`). ✅ intentional, not a bug.
- **Unreachable**: `ScreenHeader.tsx` and `app-example/` are not routed. `signdetails.tsx` is reachable via alphabet header + bottom nav.
- **Bottom nav back behavior**: `translation Mode`, `history`, `profile`, `settings`, `signdetails`, `alphabet` render `AppBottomNav`; other screens use header back button. Consistent enough.
- **No tabs group**: everything is a flat Stack; bottom nav is a custom component (each tab does `router.push`). Works, but adds duplicate screens to history stack when switching tabs (minor UX smell).

---

## Phase 5 — SIGN → TEXT pipeline trace

Frontend path implemented in `app/prototype/signtotext.tsx`:

| Step | Exists? | Works? | Implemented by | Notes / gaps |
|---|---|---|---|---|
| CAMERA | ✅ | ✅ | `expo-camera` `CameraView` (signtotext.tsx:198) | Permissions handled |
| IMAGE / FRAME | ✅ | ⚠️ | `takePictureAsync({base64, quality:0.25})` every 900ms (signtotext.tsx:77) | Photo capture (not true frames); low fps |
| API REQUEST | ✅ | ⚠️ | `POST {api}/predict` (signtotext.tsx:85) | Server is a stub → always `unknown` |
| FASTAPI | ✅ | ❌ | `backend/server.py` | No model, no MediaPipe |
| MEDIAPIPE | ❌ | ❌ | — | **Never implemented in server.py** |
| HAND LANDMARKS | ❌ | ❌ | — | — |
| SEQUENCE | ❌ | ❌ | — | No 30-frame buffer in server |
| LSTM MODEL | ❌ | ❌ | `model.h5` is 0 bytes | — |
| PREDICTION | ❌ | ❌ | returns literal `"unknown"` | — |
| CONFIDENCE | ❌ | ❌ | response has no `confidence` field | UI expects `confidence` + `hand_detected` (signtotext.tsx:27) |
| SENTENCE BUILDER | ✅ | ⚠️ | chips state in signtotext.tsx:50 | Works, but only ever empty |
| UI | ✅ | ✅ | full UI | — |

**Conclusion: SIGN → TEXT does not work end-to-end. Every ML step after the fetch is missing.**

### Why the UI shows "SEARCHING HAND" forever
The stub returns `{"label":"unknown"}`. The UI reads `data.hand_detected` (undefined → falsy) so it sets prediction empty and shows `SEARCHING HAND` (signtotext.tsx:99). Also `label: "model_not_trained"` is treated as a prediction if `hand_detected` were ever true — the frontend needs the backend to return `{label, confidence, hand_detected}` properly.
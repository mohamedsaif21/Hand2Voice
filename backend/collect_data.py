"""
Hand2Voice — ISL Data Collection
==================================
Run this on your laptop to record your own ISL gesture dataset.

Usage:
    python collect_data.py

Controls (during recording):
    SPACE  →  start / stop recording frames for the current sign
    N      →  move to next sign label
    Q      →  quit and save

Output:
    dataset/
        Hello/    ← folder per sign label
            0.npy
            1.npy
            ...
        Thanks/
            ...
    labels.json   ← list of all recorded label names
"""

import json
import time
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np

# ── config ────────────────────────────────────────────────────────────────────
SIGNS_TO_COLLECT = [
    "Hello", "Thanks", "Yes", "No",
    "Please", "Sorry", "Help", "Water",
    "Food", "Home", "Good", "Bad",
    "I", "You", "Name", "Friend",
]

SEQUENCES_PER_SIGN = 40    # how many video sequences per sign
FRAMES_PER_SEQ     = 30    # frames per sequence (at ~30 fps = ~1 second)
DATASET_DIR        = Path("dataset")
LABELS_FILE        = Path("labels.json")

# ── mediapipe ─────────────────────────────────────────────────────────────────
mp_hands    = mp.solutions.hands
mp_drawing  = mp.solutions.drawing_utils
HANDS       = mp_hands.Hands(
    max_num_hands=2,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.5,
)

# ── helpers ───────────────────────────────────────────────────────────────────

def extract_landmarks(frame_rgb: np.ndarray) -> np.ndarray | None:
    result = HANDS.process(frame_rgb)
    if not result.multi_hand_landmarks:
        return None

    hand_lms = result.multi_hand_landmarks[0]
    lm_array = np.array(
        [[lm.x, lm.y, lm.z] for lm in hand_lms.landmark], dtype=np.float32
    ).flatten()

    wrist = lm_array[:3].copy()
    lm_array = lm_array.reshape(-1, 3) - wrist
    scale = np.linalg.norm(lm_array, axis=1).max() + 1e-6
    return (lm_array / scale).flatten()


def draw_status(frame, sign, seq_idx, frame_idx, recording):
    h, w = frame.shape[:2]
    color = (0, 200, 0) if recording else (0, 120, 255)

    cv2.rectangle(frame, (0, 0), (w, 80), (0, 0, 0), -1)
    cv2.putText(frame, f"Sign: {sign}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
    cv2.putText(frame,
                f"Seq {seq_idx}/{SEQUENCES_PER_SIGN}  Frame {frame_idx}/{FRAMES_PER_SEQ}",
                (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    status = "● RECORDING" if recording else "[ SPACE to start ]"
    cv2.putText(frame, status, (w - 280, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)


# ── main loop ─────────────────────────────────────────────────────────────────

def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("ERROR: Could not open webcam.")
        return

    sign_idx  = 0
    seq_idx   = 0
    frame_idx = 0
    recording = False
    buffer    = []          # collects landmark arrays for one sequence

    while sign_idx < len(SIGNS_TO_COLLECT):
        sign = SIGNS_TO_COLLECT[sign_idx]
        save_dir = DATASET_DIR / sign
        save_dir.mkdir(parents=True, exist_ok=True)

        # Count existing sequences so we can resume
        existing = len(list(save_dir.glob("*.npy")))
        if seq_idx == 0:
            seq_idx = existing
        if seq_idx >= SEQUENCES_PER_SIGN:
            sign_idx += 1
            seq_idx = 0
            continue

        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        rgb   = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Draw MediaPipe skeleton
        result = HANDS.process(rgb)
        if result.multi_hand_landmarks:
            for hand_lms in result.multi_hand_landmarks:
                mp_drawing.draw_landmarks(frame, hand_lms, mp_hands.HAND_CONNECTIONS)

        draw_status(frame, sign, seq_idx, frame_idx, recording)
        cv2.imshow("Hand2Voice — Data Collection (Q to quit)", frame)

        key = cv2.waitKey(1) & 0xFF

        if key == ord('q'):
            break

        if key == ord('n'):
            sign_idx += 1
            seq_idx = 0
            frame_idx = 0
            recording = False
            buffer = []
            continue

        if key == ord(' '):
            if not recording:
                recording  = True
                frame_idx  = 0
                buffer     = []
            else:
                recording = False

        if recording:
            lm = extract_landmarks(rgb)
            if lm is not None:
                buffer.append(lm)
                frame_idx += 1

            if frame_idx >= FRAMES_PER_SEQ:
                seq_array = np.array(buffer, dtype=np.float32)  # (30, 63)
                np.save(save_dir / f"{seq_idx}.npy", seq_array)
                print(f"  Saved  {sign}/{seq_idx}.npy")
                seq_idx  += 1
                frame_idx = 0
                buffer    = []
                recording = False
                time.sleep(0.3)   # brief pause between sequences

    cap.release()
    cv2.destroyAllWindows()

    # Save labels.json
    collected = sorted(
        p.name for p in DATASET_DIR.iterdir() if p.is_dir() and any(p.glob("*.npy"))
    )
    LABELS_FILE.write_text(json.dumps(collected, ensure_ascii=False, indent=2))
    print(f"\nDone!  Collected {len(collected)} signs → {LABELS_FILE}")
    print("Next step:  python train_model.py")


if __name__ == "__main__":
    main()
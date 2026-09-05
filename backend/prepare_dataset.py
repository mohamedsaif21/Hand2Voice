import json
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np


# ============================================================
# CONFIG
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
DATASET_DIR = BASE_DIR / "Dataset"

OUTPUT_DIR = BASE_DIR / "data"
OUTPUT_DIR.mkdir(exist_ok=True)

SPLITS = ["Training", "Validation", "Testing"]

IMAGE_SIZE = 128


# ============================================================
# MEDIAPIPE
# ============================================================

mp_hands = mp.solutions.hands

hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.5,
)


# ============================================================
# LANDMARK NORMALIZATION
# ============================================================

def extract_landmarks(image):
    """
    Extract 21 hand landmarks.

    Each landmark contains:
        x, y, z

    Total:
        21 × 3 = 63 features
    """

    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    results = hands.process(rgb)

    if not results.multi_hand_landmarks:
        return None

    hand = results.multi_hand_landmarks[0]

    landmarks = np.array(
        [[lm.x, lm.y, lm.z] for lm in hand.landmark],
        dtype=np.float32
    )

    # --------------------------------------------------------
    # Move wrist to origin
    # --------------------------------------------------------

    wrist = landmarks[0].copy()
    landmarks = landmarks - wrist

    # --------------------------------------------------------
    # Scale normalization
    # --------------------------------------------------------

    scale = np.max(np.linalg.norm(landmarks, axis=1))

    if scale > 0:
        landmarks = landmarks / scale

    return landmarks.flatten()


# ============================================================
# PROCESS ONE SPLIT
# ============================================================

def process_split(split_name):
    split_dir = DATASET_DIR / split_name

    if not split_dir.exists():
        raise FileNotFoundError(
            f"Dataset split not found: {split_dir}"
        )

    X = []
    y = []

    class_counts = {}

    classes = sorted(
        [
            folder.name
            for folder in split_dir.iterdir()
            if folder.is_dir()
        ]
    )

    print()
    print("=" * 60)
    print(f"PROCESSING: {split_name}")
    print("=" * 60)

    print(f"Classes found: {len(classes)}")

    for label_index, class_name in enumerate(classes):

        class_dir = split_dir / class_name

        image_files = sorted(
            [
                file
                for file in class_dir.iterdir()
                if file.suffix.lower() in [".jpg", ".jpeg", ".png"]
            ]
        )

        detected = 0
        skipped = 0

        for image_path in image_files:

            image = cv2.imread(str(image_path))

            if image is None:
                skipped += 1
                continue

            landmarks = extract_landmarks(image)

            if landmarks is None:
                skipped += 1
                continue

            X.append(landmarks)
            y.append(label_index)

            detected += 1

        class_counts[class_name] = {
            "total_images": len(image_files),
            "detected": detected,
            "skipped": skipped,
        }

        print(
            f"{class_name}: "
            f"{detected}/{len(image_files)} detected"
        )

    X = np.asarray(X, dtype=np.float32)
    y = np.asarray(y, dtype=np.int64)

    output_x = OUTPUT_DIR / f"{split_name.lower()}_X.npy"
    output_y = OUTPUT_DIR / f"{split_name.lower()}_y.npy"

    np.save(output_x, X)
    np.save(output_y, y)

    print()
    print(f"{split_name} complete")
    print(f"X shape: {X.shape}")
    print(f"y shape: {y.shape}")

    return classes, class_counts


# ============================================================
# MAIN
# ============================================================

def main():

    all_classes = None
    statistics = {}

    for split in SPLITS:

        classes, counts = process_split(split)

        if all_classes is None:
            all_classes = classes
        elif classes != all_classes:
            raise ValueError(
                f"Class mismatch detected in {split}"
            )

        statistics[split] = counts

    labels_path = OUTPUT_DIR / "letters_labels.json"

    with open(labels_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "classes": all_classes,
                "num_classes": len(all_classes),
                "feature_size": 63,
            },
            f,
            indent=2,
        )

    print()
    print("=" * 60)
    print("DATASET PREPARATION COMPLETE")
    print("=" * 60)

    print(f"Classes: {len(all_classes)}")
    print(f"Features per image: 63")
    print(f"Labels saved to: {labels_path}")
    print()
    print("Output files:")

    for file in sorted(OUTPUT_DIR.iterdir()):
        print(f"  {file.name}")


if __name__ == "__main__":
    main()
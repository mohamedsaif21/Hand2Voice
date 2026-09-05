from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np


image_path = next(
    Path("Dataset/Training/A").glob("*.jpg")
)

print("Testing image:")
print(image_path)

image = cv2.imread(str(image_path))

if image is None:
    raise RuntimeError("Could not read image")

print("Image shape:", image.shape)


mp_hands = mp.solutions.hands

hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.5,
)

rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

results = hands.process(rgb)

if not results.multi_hand_landmarks:
    print("❌ No hand detected")
else:
    landmarks = results.multi_hand_landmarks[0]

    values = np.array(
        [[lm.x, lm.y, lm.z] for lm in landmarks.landmark],
        dtype=np.float32
    )

    print("✅ Hand detected")
    print("Landmark shape:", values.shape)
    print("Flattened shape:", values.flatten().shape)

    print()
    print("First landmark:")
    print(values[0])

hands.close()
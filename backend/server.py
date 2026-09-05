import base64
import json
from pathlib import Path

import cv2
import joblib
import mediapipe as mp
import numpy as np

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ============================================================
# Hand2Voice - Sign to Text Backend
# ============================================================

app = FastAPI(
    title="Hand2Voice Backend",
    version="0.3.0",
    description="Indian Sign Language alphabet recognition API",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Paths
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "alphabet_model.joblib"
LABELS_PATH = BASE_DIR / "data" / "letters_labels.json"


# ============================================================
# Load Model
# ============================================================

model = None
labels = []

try:
    model = joblib.load(MODEL_PATH)

    with open(LABELS_PATH, "r", encoding="utf-8") as f:
        label_data = json.load(f)

    labels = label_data["classes"]

    print("✅ Alphabet model loaded")
    print(f"✅ Classes: {len(labels)}")

except Exception as e:
    print("❌ Failed to load alphabet model")
    print(f"Error: {e}")


# ============================================================
# MediaPipe Hands
# ============================================================

mp_hands = mp.solutions.hands

hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.5,
)


# ============================================================
# Request Model
# ============================================================

class PredictRequest(BaseModel):
    image_base64: str


# ============================================================
# Health Check
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "classes": len(labels),
    }


# ============================================================
# Extract Hand Landmarks
# ============================================================

def extract_landmarks(image):
    """
    Extract 21 MediaPipe hand landmarks.

    IMPORTANT:
    This preprocessing must match prepare_dataset.py.

    Output:
        21 landmarks × 3 coordinates = 63 features
    """

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    results = hands.process(rgb_image)

    if not results.multi_hand_landmarks:
        return None

    hand_landmarks = results.multi_hand_landmarks[0]

    # --------------------------------------------------------
    # Convert landmarks to NumPy array
    # Shape: (21, 3)
    # --------------------------------------------------------

    landmarks = np.array(
        [
            [landmark.x, landmark.y, landmark.z]
            for landmark in hand_landmarks.landmark
        ],
        dtype=np.float32,
    )

    # --------------------------------------------------------
    # Normalize relative to wrist
    # --------------------------------------------------------

    wrist = landmarks[0].copy()

    landmarks = landmarks - wrist

    # --------------------------------------------------------
    # Scale normalization
    # --------------------------------------------------------

    scale = np.max(
        np.linalg.norm(landmarks, axis=1)
    )

    if scale > 0:
        landmarks = landmarks / scale

    # --------------------------------------------------------
    # Flatten
    # (21, 3) -> (63,)
    # --------------------------------------------------------

    return landmarks.flatten()


# ============================================================
# Decode Base64 Image
# ============================================================

def decode_base64_image(image_base64: str):
    """
    Convert Base64 image string into OpenCV image.
    """

    try:
        # Handle data URLs such as:
        # data:image/jpeg;base64,/9j/4AAQ...
        if "," in image_base64:
            image_base64 = image_base64.split(",", 1)[1]

        image_bytes = base64.b64decode(image_base64)

        image_array = np.frombuffer(
            image_bytes,
            dtype=np.uint8,
        )

        image = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR,
        )

        return image

    except Exception as e:
        print(f"❌ Image decode error: {e}")
        return None


# ============================================================
# Prediction Endpoint
# ============================================================

@app.post("/predict")
def predict(request: PredictRequest):

    # --------------------------------------------------------
    # Check model
    # --------------------------------------------------------

    if model is None:
        return {
            "label": "unknown",
            "confidence": 0.0,
            "hand_detected": False,
            "message": "Model not loaded",
        }

    # --------------------------------------------------------
    # Decode image
    # --------------------------------------------------------

    image = decode_base64_image(
        request.image_base64
    )

    if image is None:
        return {
            "label": "unknown",
            "confidence": 0.0,
            "hand_detected": False,
            "message": "Could not decode image",
        }

    # --------------------------------------------------------
    # Extract landmarks
    # --------------------------------------------------------

    features = extract_landmarks(image)

    if features is None:
        return {
            "label": "unknown",
            "confidence": 0.0,
            "hand_detected": False,
            "message": "No hand detected",
        }

    # --------------------------------------------------------
    # Reshape for model
    # --------------------------------------------------------

    X = features.reshape(1, -1)

    # --------------------------------------------------------
    # Predict
    # --------------------------------------------------------

    try:

        probabilities = model.predict_proba(X)[0]

        predicted_index = int(
            np.argmax(probabilities)
        )

        confidence = float(
            probabilities[predicted_index]
        )

        # Get predicted label
        if predicted_index < len(labels):
            predicted_label = labels[predicted_index]
        else:
            predicted_label = str(
                model.classes_[predicted_index]
            )

        return {
            "label": predicted_label,
            "confidence": confidence,
            "hand_detected": True,
            "message": "Prediction successful",
        }

    except Exception as e:

        print(f"❌ Prediction error: {e}")

        return {
            "label": "unknown",
            "confidence": 0.0,
            "hand_detected": True,
            "message": f"Prediction failed: {str(e)}",
        }


# ============================================================
# Run Server
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
    )
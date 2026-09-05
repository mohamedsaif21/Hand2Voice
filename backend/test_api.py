import base64
import glob
import requests

BASE_URL = "http://127.0.0.1:8000/predict"

letters = ["A", "B", "C", "K", "M", "S", "Z"]

correct = 0
total = 0

print("=" * 60)
print("HAND2VOICE API TEST")
print("=" * 60)

for letter in letters:

    files = glob.glob(f"Dataset/Testing/{letter}/*.jpg")

    if not files:
        print(f"{letter}: No images found")
        continue

    # Test the first image from each class
    image_path = files[0]

    with open(image_path, "rb") as f:
        image_base64 = base64.b64encode(f.read()).decode()

    response = requests.post(
        BASE_URL,
        json={"image_base64": image_base64},
    )

    result = response.json()

    predicted = result.get("label")
    confidence = result.get("confidence")

    is_correct = predicted == letter

    if is_correct:
        correct += 1

    total += 1

    status = "✅" if is_correct else "❌"

    print(
        f"{status} Expected: {letter} | "
        f"Predicted: {predicted} | "
        f"Confidence: {confidence}"
    )

print()
print("=" * 60)
print(f"API SAMPLE ACCURACY: {correct}/{total}")
print("=" * 60)
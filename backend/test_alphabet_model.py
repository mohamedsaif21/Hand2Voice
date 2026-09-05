import os
import json
import numpy as np
import joblib

from sklearn.metrics import accuracy_score, classification_report


DATA_DIR = "data"
MODEL_PATH = "alphabet_model.joblib"
LABELS_PATH = os.path.join(DATA_DIR, "letters_labels.json")


print("=" * 60)
print("LOADING MODEL AND TEST DATA")
print("=" * 60)

model = joblib.load(MODEL_PATH)

X_test = np.load(os.path.join(DATA_DIR, "testing_X.npy"))
y_test = np.load(os.path.join(DATA_DIR, "testing_y.npy"))

with open(LABELS_PATH, "r", encoding="utf-8") as f:
    label_data = json.load(f)

classes = label_data["classes"]

print(f"Testing X: {X_test.shape}")
print(f"Testing y: {y_test.shape}")
print(f"Classes: {len(classes)}")


print("\n" + "=" * 60)
print("RUNNING TEST DATA")
print("=" * 60)

test_predictions = model.predict(X_test)

test_accuracy = accuracy_score(
    y_test,
    test_predictions
)

print(f"Testing Accuracy: {test_accuracy * 100:.2f}%")


print("\n" + "=" * 60)
print("TEST CLASSIFICATION REPORT")
print("=" * 60)

print(
    classification_report(
        y_test,
        test_predictions,
        target_names=classes,
        zero_division=0
    )
)


print("\n" + "=" * 60)
print("TESTING COMPLETE")
print("=" * 60)
print(f"Testing Accuracy: {test_accuracy * 100:.2f}%")
print("=" * 60)
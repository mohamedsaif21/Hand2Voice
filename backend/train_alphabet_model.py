import os
import json
import numpy as np

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib


# ============================================================
# CONFIGURATION
# ============================================================

DATA_DIR = "data"
MODEL_PATH = "alphabet_model.joblib"
LABELS_PATH = os.path.join(DATA_DIR, "letters_labels.json")


# ============================================================
# LOAD DATA
# ============================================================

print("=" * 60)
print("LOADING DATASET")
print("=" * 60)

X_train = np.load(os.path.join(DATA_DIR, "training_X.npy"))
y_train = np.load(os.path.join(DATA_DIR, "training_y.npy"))

X_val = np.load(os.path.join(DATA_DIR, "validation_X.npy"))
y_val = np.load(os.path.join(DATA_DIR, "validation_y.npy"))

print(f"Training X:   {X_train.shape}")
print(f"Training y:   {y_train.shape}")
print(f"Validation X: {X_val.shape}")
print(f"Validation y: {y_val.shape}")


# ============================================================
# LOAD LABELS
# ============================================================

with open(LABELS_PATH, "r", encoding="utf-8") as f:
    label_data = json.load(f)

classes = label_data["classes"]

print(f"Number of classes: {len(classes)}")
print(f"Classes: {classes}")


# ============================================================
# CREATE MLP PIPELINE
# ============================================================

print("\n" + "=" * 60)
print("CREATING MLP CLASSIFIER")
print("=" * 60)

model = Pipeline([
    (
        "scaler",
        StandardScaler()
    ),
    (
        "mlp",
        MLPClassifier(
            hidden_layer_sizes=(128, 64),
            activation="relu",
            solver="adam",
            alpha=0.0001,
            batch_size=64,
            learning_rate="adaptive",
            learning_rate_init=0.001,
            max_iter=150,
            random_state=42,
            verbose=True
        )
    )
])


# ============================================================
# TRAIN
# ============================================================

print("\n" + "=" * 60)
print("TRAINING MLP MODEL")
print("=" * 60)

print("This may take some time on CPU...\n")

model.fit(X_train, y_train)


# ============================================================
# TRAINING ACCURACY
# ============================================================

print("\n" + "=" * 60)
print("TRAINING RESULTS")
print("=" * 60)

train_predictions = model.predict(X_train)

train_accuracy = accuracy_score(
    y_train,
    train_predictions
)

print(f"Training Accuracy: {train_accuracy * 100:.2f}%")


# ============================================================
# VALIDATION ACCURACY
# ============================================================

print("\n" + "=" * 60)
print("VALIDATION RESULTS")
print("=" * 60)

val_predictions = model.predict(X_val)

val_accuracy = accuracy_score(
    y_val,
    val_predictions
)

print(f"Validation Accuracy: {val_accuracy * 100:.2f}%")


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

print("\n" + "=" * 60)
print("CLASSIFICATION REPORT")
print("=" * 60)

print(
    classification_report(
        y_val,
        val_predictions,
        target_names=classes,
        zero_division=0
    )
)


# ============================================================
# SAVE MODEL
# ============================================================

print("\n" + "=" * 60)
print("SAVING MODEL")
print("=" * 60)

joblib.dump(model, MODEL_PATH)

print(f"Model saved to: {os.path.abspath(MODEL_PATH)}")


# ============================================================
# SAVE TRAINING INFORMATION
# ============================================================

training_info = {
    "model": "MLPClassifier",
    "input_features": 63,
    "num_classes": len(classes),
    "classes": classes,
    "training_samples": int(len(X_train)),
    "validation_samples": int(len(X_val)),
    "training_accuracy": float(train_accuracy),
    "validation_accuracy": float(val_accuracy),
    "hidden_layers": [128, 64]
}

INFO_PATH = os.path.join(DATA_DIR, "training_info.json")

with open(INFO_PATH, "w", encoding="utf-8") as f:
    json.dump(training_info, f, indent=4)

print(f"Training information saved to: {os.path.abspath(INFO_PATH)}")


# ============================================================
# COMPLETE
# ============================================================

print("\n" + "=" * 60)
print("MLP TRAINING COMPLETE")
print("=" * 60)

print(f"Training Accuracy:   {train_accuracy * 100:.2f}%")
print(f"Validation Accuracy: {val_accuracy * 100:.2f}%")
print(f"Model:               {MODEL_PATH}")
print("=" * 60)
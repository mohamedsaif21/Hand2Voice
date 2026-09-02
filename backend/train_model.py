"""
Hand2Voice — Model Training
=============================
Trains an LSTM on the landmark sequences produced by collect_data.py.

Usage:
    python train_model.py

Output:
    model.h5     ← saved Keras model (loaded by server.py)
    labels.json  ← class labels in index order
"""

import json
from pathlib import Path

import numpy as np

# ── config ────────────────────────────────────────────────────────────────────
DATASET_DIR    = Path("dataset")
LABELS_FILE    = Path("labels.json")
MODEL_OUT      = Path("model.h5")
FRAMES_PER_SEQ = 30     # must match collect_data.py
FEATURES       = 63     # 21 landmarks × 3
TEST_SPLIT     = 0.15
EPOCHS         = 50
BATCH_SIZE     = 32

# ── load data ─────────────────────────────────────────────────────────────────

def load_dataset():
    labels_sorted = sorted(
        p.name for p in DATASET_DIR.iterdir()
        if p.is_dir() and any(p.glob("*.npy"))
    )
    label_to_idx = {lbl: i for i, lbl in enumerate(labels_sorted)}

    X, y = [], []
    for label in labels_sorted:
        folder = DATASET_DIR / label
        for npy_path in sorted(folder.glob("*.npy")):
            seq = np.load(npy_path)                 # (T, 63)
            if seq.shape[0] < FRAMES_PER_SEQ:
                # Pad shorter sequences with last frame
                pad = np.tile(seq[-1], (FRAMES_PER_SEQ - seq.shape[0], 1))
                seq = np.vstack([seq, pad])
            else:
                seq = seq[:FRAMES_PER_SEQ]
            X.append(seq)
            y.append(label_to_idx[label])

    X = np.array(X, dtype=np.float32)   # (N, 30, 63)
    y = np.array(y, dtype=np.int32)
    return X, y, labels_sorted


# ── model ─────────────────────────────────────────────────────────────────────

def build_model(num_classes: int):
    import tensorflow as tf

    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(FRAMES_PER_SEQ, FEATURES)),

        tf.keras.layers.LSTM(128, return_sequences=True),
        tf.keras.layers.Dropout(0.3),

        tf.keras.layers.LSTM(64),
        tf.keras.layers.Dropout(0.3),

        tf.keras.layers.Dense(64, activation="relu"),
        tf.keras.layers.Dropout(0.2),

        tf.keras.layers.Dense(num_classes, activation="softmax"),
    ])

    model.compile(
        optimizer="adam",
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()
    return model


# ── train ─────────────────────────────────────────────────────────────────────

def main():
    if not DATASET_DIR.exists():
        print("ERROR: dataset/ folder not found. Run collect_data.py first.")
        return

    print("Loading dataset …")
    X, y, labels = load_dataset()
    print(f"  {len(X)} sequences  |  {len(labels)} classes: {labels}")

    import tensorflow as tf
    from sklearn.model_selection import train_test_split  # type: ignore

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=TEST_SPLIT, random_state=42, stratify=y
    )

    model = build_model(len(labels))

    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_accuracy", patience=10, restore_best_weights=True
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=5, verbose=1
        ),
    ]

    print("\nTraining …")
    model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        callbacks=callbacks,
    )

    # Save
    model.save(str(MODEL_OUT))
    LABELS_FILE.write_text(json.dumps(labels, ensure_ascii=False, indent=2))
    print(f"\nSaved model → {MODEL_OUT}")
    print(f"Saved labels → {LABELS_FILE}")

    # Quick eval
    loss, acc = model.evaluate(X_val, y_val, verbose=0)
    print(f"\nValidation accuracy: {acc * 100:.1f}%")
    print("Next step:  python server.py")


if __name__ == "__main__":
    main()
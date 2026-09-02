from __future__ import annotations

import base64
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Hand2Voice Backend", version="0.1.0")

MODEL_PATH = Path(__file__).with_name("model.h5")
LABELS_PATH = Path(__file__).with_name("labels.json")


class PredictRequest(BaseModel):
    image_base64: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/predict")
def predict(payload: PredictRequest) -> dict[str, Any]:
    if not payload.image_base64:
        raise HTTPException(status_code=400, detail="image_base64 is required")

    try:
        base64.b64decode(payload.image_base64, validate=True)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail="image_base64 is not valid base64") from exc

    if not MODEL_PATH.exists() or not LABELS_PATH.exists():
        return {"label": "model_not_trained"}

    return {"label": "unknown"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

import io
import os
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from PIL import Image

# Suppress TF logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf

app = FastAPI(title="Maize Guard AI - Disease Detection API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
MODEL_PATH = "model/Maizeplant_disease_model.h5"
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"Warning: Could not load the model from {MODEL_PATH}. Error: {e}")
    model = None

# Define classes as requested
CLASSES = ["Blight", "Common Rust", "Grey Leaf Spot", "Healthy"]

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    class_index: int

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    try:
        # Load image from bytes
        img = Image.open(io.BytesIO(image_bytes))
        # Convert to RGB (in case of RGBA/Grayscale)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        # Resize to 224x224
        img = img.resize((224, 224))
        # Convert to numpy array
        img_array = np.array(img)
        # Normalize pixel values to 0-1
        img_array = img_array / 255.0
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        raise ValueError(f"Error during image processing: {str(e)}")

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded. Please ensure the .h5 file exists at backend/model/Maizeplant_disease_model.h5")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    
    try:
        contents = await file.read()
        processed_image = preprocess_image(contents)
        
        # Predict
        predictions = model.predict(processed_image)
        predicted_class_index = int(np.argmax(predictions, axis=1)[0])
        confidence = float(np.max(predictions))
        
        predicted_class_name = CLASSES[predicted_class_index]
        
        return PredictionResponse(
            prediction=predicted_class_name,
            confidence=confidence,
            class_index=predicted_class_index
        )

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}

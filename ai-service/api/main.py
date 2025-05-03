import os
import logging
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time

# Import prediction services
from src.inference.image_predictor import ImagePredictor
from src.inference.video_predictor import VideoPredictor

# Configure logging
log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, log_level),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize the FastAPI app
app = FastAPI(
    title="Content Analysis AI Service",
    description="API for detecting harmful content in images and videos",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class PredictionResult(BaseModel):
    harmful: bool
    confidence: float
    category: str
    regions: List[dict] = []
    processing_time: float

class ModelStatus(BaseModel):
    status: str
    models_loaded: List[str]
    gpu_available: bool
    version: str

# Load models
MODEL_PATH = os.environ.get("MODEL_PATH", "./models")

# Initialize predictors
try:
    image_predictor = ImagePredictor(model_path=MODEL_PATH)
    video_predictor = VideoPredictor(model_path=MODEL_PATH)
    models_loaded = True
    logger.info("Models loaded successfully")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    models_loaded = False

@app.get("/")
async def root():
    return {"message": "Content Analysis AI Service API"}

@app.get("/model/status", response_model=ModelStatus)
async def get_model_status():
    import torch
    return {
        "status": "ready" if models_loaded else "error",
        "models_loaded": ["image_model", "video_model"] if models_loaded else [],
        "gpu_available": torch.cuda.is_available(),
        "version": "1.0.0"
    }

@app.post("/predict/image", response_model=PredictionResult)
async def predict_image(file: UploadFile = File(...)):
    if not models_loaded:
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        start_time = time.time()
        contents = await file.read()
        
        # Process image
        result = image_predictor.predict(contents)
        
        processing_time = time.time() - start_time
        
        return {
            **result,
            "processing_time": processing_time
        }
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/predict/video", response_model=PredictionResult)
async def predict_video(file: UploadFile = File(...)):
    if not models_loaded:
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    if not file.content_type.startswith('video/'):
        raise HTTPException(status_code=400, detail="File must be a video")
    
    try:
        start_time = time.time()
        contents = await file.read()
        
        # Save temporarily to disk since video processing typically needs file access
        temp_file = f"/tmp/{file.filename}"
        with open(temp_file, "wb") as f:
            f.write(contents)
        
        # Process video
        result = video_predictor.predict(temp_file)
        
        # Clean up
        os.remove(temp_file)
        
        processing_time = time.time() - start_time
        
        return {
            **result,
            "processing_time": processing_time
        }
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
import os
import io
import numpy as np
import logging
import tensorflow as tf
from PIL import Image
from src.preprocessing.image_preprocessing import preprocess_image
from src.utils.detector import detect_regions

logger = logging.getLogger(__name__)

class ImagePredictor:
    def __init__(self, model_path="./models"):
        """
        Initialize the image predictor with the specified model.
        
        Args:
            model_path: Path to the directory containing the model files
        """
        self.model_path = model_path
        self.image_model = self._load_model(os.path.join(model_path, "image_model"))
        self.categories = ["nudity", "violence", "hate_speech", "self_harm", "drugs", "other"]
        logger.info("Image predictor initialized")
    
    def _load_model(self, model_path):
        """
        Load the TensorFlow model from the specified path.
        
        Args:
            model_path: Path to the model file or directory
        
        Returns:
            The loaded model
        """
        try:
            # For demonstration, we'll try to load an EfficientNet model
            # In a real application, you'd load your trained model from disk
            if not os.path.exists(model_path):
                logger.warning(f"Model path {model_path} doesn't exist, using a mock model")
                # Create a simple mock model for demonstration
                inputs = tf.keras.Input(shape=(224, 224, 3))
                base_model = tf.keras.applications.EfficientNetB0(
                    include_top=False,
                    weights="imagenet",
                    input_shape=(224, 224, 3)
                )
                base_model.trainable = False
                x = base_model(inputs, training=False)
                x = tf.keras.layers.GlobalAveragePooling2D()(x)
                x = tf.keras.layers.Dense(512, activation='relu')(x)
                outputs = tf.keras.layers.Dense(len(self.categories) + 1, activation='sigmoid')(x)
                model = tf.keras.Model(inputs, outputs)
                
                # Save the model for future use
                os.makedirs(model_path, exist_ok=True)
                model.save(model_path)
                logger.info(f"Created and saved mock model to {model_path}")
                return model
            else:
                logger.info(f"Loading model from {model_path}")
                return tf.keras.models.load_model(model_path)
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            # Fallback to a simpler mock model
            inputs = tf.keras.Input(shape=(224, 224, 3))
            x = tf.keras.layers.GlobalAveragePooling2D()(inputs)
            outputs = tf.keras.layers.Dense(len(self.categories) + 1, activation='sigmoid')(x)
            return tf.keras.Model(inputs, outputs)
    
    def predict(self, image_data):
        """
        Predict harmful content in the given image.
        
        Args:
            image_data: Binary image data
        
        Returns:
            A dictionary containing the prediction results
        """
        try:
            # Convert binary data to PIL Image
            image = Image.open(io.BytesIO(image_data))
            
            # Preprocess the image
            preprocessed_img = preprocess_image(image)
            
            # Run inference
            predictions = self.image_model.predict(np.expand_dims(preprocessed_img, axis=0))[0]
            
            # Get the highest probability category
            max_prob_idx = np.argmax(predictions)
            max_prob = predictions[max_prob_idx]
            
            # First output is "safe" probability, other outputs are harmful categories
            is_harmful = max_prob_idx > 0
            
            # If harmful, identify the category and detect regions
            if is_harmful:
                category = self.categories[max_prob_idx - 1]  # -1 because first output is "safe"
                regions = detect_regions(image, preprocessed_img, self.image_model)
            else:
                category = "safe"
                regions = []
            
            return {
                "harmful": is_harmful,
                "confidence": float(max_prob),
                "category": category,
                "regions": regions
            }
            
        except Exception as e:
            logger.error(f"Error predicting image: {str(e)}")
            return {
                "harmful": False,
                "confidence": 0.0,
                "category": "error",
                "regions": []
            }
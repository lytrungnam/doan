import numpy as np
from PIL import Image

def preprocess_image(image, target_size=(224, 224)):
    """
    Preprocess an image for model inference.
    
    Args:
        image: PIL Image object
        target_size: Target size (height, width) for resizing
    
    Returns:
        Preprocessed image as numpy array
    """
    # Resize image
    image = image.resize(target_size)
    
    # Convert to RGB if needed
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    # Convert to numpy array
    img_array = np.array(image)
    
    # Normalize pixel values to [0, 1]
    img_array = img_array / 255.0
    
    return img_array

def augment_image(image):
    """
    Apply data augmentation to an image.
    Used for training, not for inference.
    
    Args:
        image: PIL Image object
    
    Returns:
        Augmented image
    """
    import random
    from PIL import ImageEnhance
    
    # Random rotation
    if random.random() > 0.5:
        angle = random.uniform(-10, 10)
        image = image.rotate(angle)
    
    # Random brightness adjustment
    if random.random() > 0.5:
        factor = random.uniform(0.8, 1.2)
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(factor)
    
    # Random contrast adjustment
    if random.random() > 0.5:
        factor = random.uniform(0.8, 1.2)
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(factor)
    
    return image
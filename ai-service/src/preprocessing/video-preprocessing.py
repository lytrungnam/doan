import cv2
import numpy as np
import logging
from PIL import Image

logger = logging.getLogger(__name__)

def extract_frames(video_path, sample_rate=1, max_frames=30):
    """
    Extract frames from a video at a given sample rate.
    
    Args:
        video_path: Path to the video file
        sample_rate: Extract every nth frame
        max_frames: Maximum number of frames to extract
    
    Returns:
        List of extracted frames as PIL Images
    """
    try:
        # Open video file
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            logger.error(f"Error opening video file: {video_path}")
            return []
        
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = frame_count / fps if fps > 0 else 0
        
        logger.info(f"Video properties: {fps} fps, {duration:.2f}s, {frame_count} frames")
        
        # Calculate sample interval and total frames to extract
        sample_interval = max(1, int(sample_rate))
        
        # Adjust sampling to get a reasonable number of frames
        if frame_count > max_frames * sample_interval:
            # If we have too many frames even with sampling, increase the interval
            sample_interval = max(sample_interval, frame_count // max_frames)
        
        logger.info(f"Using sample interval: {sample_interval}")
        
        # Extract frames
        frames = []
        frame_idx = 0
        
        while len(frames) < max_frames:
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_idx % sample_interval == 0:
                # Convert from BGR to RGB
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                # Convert to PIL Image
                pil_image = Image.fromarray(frame_rgb)

import base64
import io
import uuid
import os
from typing import Dict

import cv2
import numpy as np
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from PIL import Image

from .. import database
from ..auth import get_current_user

router = APIRouter(
    prefix="/images",
    tags=["image processing"],
    responses={404: {"description": "Not found"}},
)

@router.post("/remove-background/")
async def remove_background(
    file: UploadFile = File(...),
    current_user: Dict = Depends(get_current_user)
):
    """
    Remove the background from a clothing item image and return the processed image.
    Uses a simple OpenCV-based background removal algorithm.
    """
    try:
        # Read the image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert PIL Image to OpenCV format
        cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Convert to RGBA (we need alpha channel for transparency)
        if cv_image.shape[2] == 3:
            cv_image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2BGRA)
        
        # Create a mask using simple thresholding
        # Convert to grayscale
        gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
        
        # Apply GaussianBlur to reduce noise
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply Otsu's thresholding
        _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)
        
        # Find the largest contour (assuming it's the clothing item)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if not contours:
            raise HTTPException(status_code=400, detail="Could not detect clothing item in image")
            
        # Find the largest contour by area
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Create an empty mask and draw the largest contour
        mask = np.zeros_like(gray)
        cv2.drawContours(mask, [largest_contour], 0, 255, -1)
        
        # Apply morphological operations to improve the mask
        kernel = np.ones((5, 5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        # Expand mask slightly to prevent edge artifacts
        mask = cv2.dilate(mask, kernel, iterations=2)
        
        # Apply the mask to the alpha channel
        cv_image[:, :, 3] = mask
        
        # Convert back to PIL Image
        result_image = Image.fromarray(cv2.cvtColor(cv_image, cv2.COLOR_BGRA2RGBA))
        
        # Save to a BytesIO object
        img_byte_arr = io.BytesIO()
        result_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        # Encode as base64
        base64_image = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')
        
        # Generate a unique filename for the processed image
        filename = f"{uuid.uuid4()}.png"
        
        # In a real app, you'd save this to cloud storage or a database
        # For now, we'll just return the base64 data
        
        return {
            "filename": filename,
            "content_type": "image/png",
            "base64_image": base64_image
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")

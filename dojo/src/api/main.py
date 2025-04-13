from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import requests
import os
import shutil

app = FastAPI()


from typing import List
from pydantic import BaseModel
import requests

# ------------------ API ENDPOINT (FastAPI & JSON) x AI integration ------------------

# AI endpoint
AI_ENDPOINT = "https://8da6-193-221-143-82.ngrok-free.app/generate"

# Pydantic model to validate JSON body
class PromptRequest(BaseModel):
    prompt: str                 # Description for AI to generate image
    tile: int                   # Tile ID or coordinate number
    neighbours: List[int]       # List of surrounding tile IDs

# Function to call AI endpoint and return image URL
def get_ai_image(data: PromptRequest):
    # Send POST request to AI backend
    response = requests.post(AI_ENDPOINT, json=data.dict())

    # Raise error if request fails
    response.raise_for_status()

    # Parse JSON response
    result = response.json()
    image_url = result.get("url")

    return {
        "success": True,
        "ai_image": image_url
    }

# ------------------ API ENDPOINT (FastAPI) x Frontend integration - GET Tiles from Starknet (via RPC)  ------------------
@app.get("/tiles")
def get_all_tiles():
    """
    This endpoint simulates pulling tile data from Starknet via Torii RPC.
    Later this will be replaced with actual on-chain calls.
    """
    tiles = [
        {
            "x": 3,
            "y": 7,
            "img_url": "https://supabase.com/encode-assets/tile_3_7.png",
            "model_url": "https://supabase.com/encode-assets/tile_3_7.glb",
            "description": "tree",
            "tile_type": "normal"
        },
        {
            "x": 4,
            "y": 8,
            "img_url": "https://supabase.com/encode-assets/tile_4_8.png",
            "model_url": "https://supabase.com/encode-assets/tile_4_8.glb",
            "description": "house",
            "tile_type": "normal"
        }
    ]

    return {"tiles": tiles}
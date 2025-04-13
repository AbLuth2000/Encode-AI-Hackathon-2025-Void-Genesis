from fastapi import FastAPI
from pydantic import BaseModel
from typing import Tuple
from contextlib import asynccontextmanager
import subprocess
import threading
import json

from ai_agent.main_portia import run_tile_generation_agent

# FastAPI App
app = FastAPI()

# Data Model
class AssetRequest(BaseModel):
    scene_description: str
    tile_index: int
    neighbours: Tuple[int, ...]


# Shared Tile Generation Logic
def process_tile_request(scene_description: str, tile_index: int) -> dict:
    output_tile_name = f"tile_{tile_index}"
    supabase_url = run_tile_generation_agent(
        scene_description=scene_description,
        output_tile_name=output_tile_name
    )

    return {
        "status": "success" if "http" in supabase_url else "error",
        "tile": output_tile_name,
        "supabase_url": supabase_url,
        "scene_description": scene_description
    }


# Sequential Event Listener (Runs in Thread)
def run_event_listener_sync():
    print("Background listener started for Dojo events...")

    process = subprocess.Popen(
        ["sozo", "events", "--follow"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    for line in process.stdout:
        try:
            event_data = json.loads(line)

            if event_data.get("name") == "TileRequested":
                scene = felt_to_str(event_data["data"]["scene"])
                tile_index = int(event_data["data"]["tile_index"])

                print(f"Received TileRequested event for tile {tile_index}. Generating...")

                result = process_tile_request(
                    scene_description=scene,
                    tile_index=tile_index
                )

                print("Generation complete:", result)

        except Exception as e:
            print("Error while processing event:", e)


# Utility: Convert felt252 hex to string
def felt_to_str(felt):
    if isinstance(felt, str) and felt.startswith("0x"):
        try:
            return bytes.fromhex(felt[2:]).decode("utf-8").strip('\x00')
        except Exception:
            return str(felt)
    return str(felt)


# FastAPI Lifespan: Start background thread on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    listener_thread = threading.Thread(target=run_event_listener_sync, daemon=True)
    listener_thread.start()
    yield


# Reassign app with lifespan
app = FastAPI(lifespan=lifespan)


# Root Endpoint
@app.get("/")
def root():
    return {"message": "STEVE is online and ready to generate"}


# Generate Tile via API
@app.post("/generate")
def generate_asset(data: AssetRequest):
    return process_tile_request(data.scene_description, data.tile_index)

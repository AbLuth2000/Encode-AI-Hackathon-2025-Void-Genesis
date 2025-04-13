from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, Tuple
from ai_agent.main_portia import run_tile_generation_agent

app = FastAPI()


class AssetRequest(BaseModel):
    scene_description: str
    tile_index: int
    neighbours: Tuple[int, ...]


@app.get("/")
def root():
    return {"message": "STEVE is online and ready to generate!"}


@app.post("/generate")
def generate_asset(data: AssetRequest):
    output_tile_name = f"tile_{data.tile_index}"
    supabase_url = run_tile_generation_agent(
        scene_description=data.scene_description,
        output_tile_name=output_tile_name
    )

    return {
        "status": "success" if "http" in supabase_url else "error",
        "tile": output_tile_name,
        "supabase_url": supabase_url,
        "scene_description": data.scene_description
    }
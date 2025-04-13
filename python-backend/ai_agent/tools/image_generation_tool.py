import os
from pydantic import BaseModel, Field
from portia.tool import Tool, ToolRunContext
from pathlib import Path
import requests
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables and initialize OpenAI client
load_dotenv()
STABILITY_KEY = os.getenv("STABILITY_API_KEY")

# Initialise OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class ImageGenSchema(BaseModel):
    """Inputs for creating a prompt to generate an image."""
    scene_description: str = Field(..., description="The scene the user wants to place.")
    tile_index: str = Field(..., description="The tile position number.")
    image_prompt: str = Field(..., description="The prompt to be used to generate the image - it is either from the 'final_image_prompt' or the 'fallback_image_prompt'.")


class OpenAIImageGenTool(Tool[dict]):
    """Generates a low-res image using DALL·E 2 and saves it locally."""

    id: str = "openai_image_gen_tool"
    name: str = "OpenAI Image Generator Tool"
    description: str = "Uses a prompt to generate an image with DALL·E 3 and saves it locally."
    args_schema: type[BaseModel] = ImageGenSchema
    output_schema: tuple[str, str] = (
        "json",
        "A dictionary with the 'scene_description', 'tile_index', 'local_image_path' and ''."
    )

    def run(self, _: ToolRunContext, scene_description: str, tile_index: str, image_prompt: str) -> dict:
        if not image_prompt:
            return {
                "scene_description": scene_description,
                "tile_index": tile_index,
                "local_image_path": "",
                "model_path": ""
            }

        output_dir = Path.home() / "encode-2025-ai-agent" / "python-backend" / "generated_assets"
        output_dir.mkdir(parents=True, exist_ok=True)

        image_filename = f"{tile_index}.png"
        image_path = output_dir / image_filename

        try:
            # Generate image using OpenAI DALL·E 2
            response = client.images.generate(
                model="dall-e-3",
                prompt=image_prompt,
                n=1,
                size="1024x1024",
                response_format="url"
            )

            image_url = response.data[0].url
            print(f"Image URL: {image_url}")

            img_data = requests.get(image_url).content
            print(f"Downloaded image size: {len(img_data)} bytes")

            with open(image_path, "wb") as f:
                f.write(img_data)

            saved_image_path = str(image_path.resolve())
            print(f"Image successfully saved at: {saved_image_path}")

            # === Now convert image to 3D model ===
            model_filename = f"{tile_index}.glb"
            model_path = output_dir / model_filename


            host = "https://api.stability.ai/v2beta/3d/stable-point-aware-3d"
            texture_resolution = "2048"
            foreground_ratio = 1.3
            remesh = 'triangle'
            target_type = 'none'
            target_count = 1000
            guidance_scale = 3.0

            print(f"Sending image to Stability API for 3D model conversion...")
            model_response = requests.post(
                host,
                headers={"Authorization": f"Bearer {STABILITY_KEY}"},
                files={"image": open(image_path, 'rb')},
                data={
                    "texture_resolution": texture_resolution,
                    "foreground_ratio": foreground_ratio,
                    "remesh": remesh,
                    "target_type": target_type,
                    "target_count": target_count,
                    "guidance_scale": guidance_scale
                }
            )

            if not model_response.ok:
                raise Exception(f"3D conversion failed: HTTP {model_response.status_code}: {model_response.text}")

            with open(model_path, "wb") as f:
                f.write(model_response.content)

            saved_model_path = str(model_path.resolve())
            print(f"3D model saved at: {saved_model_path}")

        except Exception as e:
            print(f"Generation process failed: {e}")
            saved_image_path = ""
            saved_model_path = ""

        return {
            "scene_description": scene_description,
            "tile_index": tile_index,
            "local_image_path": saved_image_path,
            "model_path": saved_model_path
        }


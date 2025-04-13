import os
from pydantic import BaseModel, Field
from portia.tool import Tool, ToolRunContext
from PIL import Image
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


class SceneValidationSchema(BaseModel):
    """Inputs for checking whether a described scene fits the given images."""
    scene_description: str = Field(..., description="The scene the user wants to place (e.g., 'a castle on a hill')")
    tile_index: str = Field(..., description="The tile position number.")


class SceneValidatorTool(Tool[dict]):
    """Validates whether a described scene fits the given image environment."""

    id: str = "gemini_scene_validator_tool"
    name: str = "Scene Validator Tool"
    description: str = (
        "Uses Gemini 1.5 Pro to determine if a described scene fits within the game environment images. "
        "Returns a dict with the scene_description, tile_index, and scene_validation_result."
    )
    args_schema: type[BaseModel] = SceneValidationSchema
    requires_arguments: bool = False
    output_schema: tuple[str, str] = (
        "json",
        "A dictionary with the 'scene_description', 'tile_index', and 'scene_validation_result'."
    )

    def run(self, ctx: ToolRunContext, scene_description: str, tile_index: str) -> dict:
        if not scene_description:
            return {
                "scene_description": scene_description,
                "tile_index": tile_index,
                "scene_validation_result": "This doesn't match since there is no scene_description to compare."
            }

        model = genai.GenerativeModel("gemini-1.5-pro")

        image_paths = [
            "ai_agent/test_images/arctic_image.jpg",
            "ai_agent/test_images/desert_image.jpg"
        ]

        image_list = []
        for path in image_paths:
            try:
                img = Image.open(path)
                image_list.append(img)
            except Exception:
                return {
                    "scene_description": scene_description,
                    "tile_index": tile_index,
                    "scene_validation_result": "This doesn't match since there was an exception."
                }

        query = (
            "You are an AI scene validator. Given the following images of a game environment and a described scene, "
            "answer only with 'true' or a short sentence for why it doesn't match."
            f"Scene: '{scene_description}'. Does this scene contextually fit with the environment shown in the images?"
        )

        try:
            response = model.generate_content([query] + image_list, generation_config={"temperature": 0})
            answer = response.text.strip().lower()
            return {
                "scene_description": scene_description,
                "tile_index": tile_index,
                "scene_validation_result": "true" in answer
            }
        except Exception as e:
            return {
                "scene_description": scene_description,
                "tile_index": tile_index,
                "scene_validation_result": "It doesn't match since the api call failed."
            }

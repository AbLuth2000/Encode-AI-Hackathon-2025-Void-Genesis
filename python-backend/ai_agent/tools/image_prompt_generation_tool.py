from pydantic import BaseModel, Field
from portia.tool import Tool, ToolRunContext
import google.generativeai as genai
import os

# Configure Gemini with your API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


class ImagePromptSchema(BaseModel):
    """Inputs for creating a prompt to generate an image."""
    scene_description: str = Field(..., description="The scene the user wants to place.")
    tile_index: str = Field(..., description="The tile position number.")
    scene_validation_result: str = Field(..., description="If the scene matches the context or not.")


class GeminiImagePromptTool(Tool[dict]):
    """Uses Gemini 2.0 Flash to generate a simple prompt for image generation."""

    id: str = "gemini_image_prompt_tool"
    name: str = "Gemini Image Prompt Tool"
    description: str = (
        "Enhances a basic scene description into a simple image prompt using Gemini 2.0 Flash."
        "Stores result as 'final_image_prompt' or 'fallback_image_prompt' depending on usage context."
    )
    args_schema: type[BaseModel] = ImagePromptSchema
    output_schema: tuple[str, str] = (
        "json",
        "A dictionary with the 'scene_description', 'tile_index', and either 'final_image_prompt' or 'fallback_image_prompt'."
    )

    def run(self, _: ToolRunContext, scene_description: str, tile_index: str, scene_validation_result: str) -> dict:
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")

            system_instruction = (
                "You are a visual prompt engineer for AI-generated art."
                "Given a user prompt, rewrite it as a description for a minimalistic image generation that will be used to create a 3D model."
                "Respond with only the final prompt, no explanation or commentary."
                "Here's an example:"
                "User Prompt: 'Create a beautiful log house"
                "Your Output: 'Create an image of a log house with neutral background."
            )

            chat = model.start_chat(history=[])
            response = chat.send_message(f"{system_instruction}\n\n{scene_description}")
            generated_image_prompt = response.text.strip()

            # Caller (the plan) determines the step: valid or fallback
            if scene_validation_result is True:
                return {
                    "scene_description": scene_description,
                    "tile_index": tile_index,
                    "final_image_prompt": generated_image_prompt
                }
            else:
                return {
                    "scene_description": scene_description,
                    "tile_index": tile_index,
                    "fallback_image_prompt": generated_image_prompt
                }

        except Exception as e:
            return {
                "scene_description": scene_description,
                "tile_index": tile_index,
                "fallback_image_prompt": "Create an image of a log house with neutral background. This image will be used to create a 3D object."
            }
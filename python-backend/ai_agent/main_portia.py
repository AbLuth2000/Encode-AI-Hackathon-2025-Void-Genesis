from portia import Portia, Config, LLMModel, LLMProvider, InMemoryToolRegistry, execution_context
from portia.plan import PlanBuilder, Variable
from .tools.image_prompt_generation_tool import GeminiImagePromptTool
from .tools.input_validation_tool import SceneValidatorTool
from .tools.supabase_asset_uploader import SupabaseAssetUploaderTool
from .tools.image_generation_tool import OpenAIImageGenTool
from portia.templates.example_plans import DEFAULT_EXAMPLE_PLANS
from portia.execution_context import get_execution_context
import os
from dotenv import load_dotenv

load_dotenv()

_tool_registry = InMemoryToolRegistry.from_local_tools([
    SceneValidatorTool(),
    GeminiImagePromptTool(),
    OpenAIImageGenTool(),
    SupabaseAssetUploaderTool()
])

_config = Config.from_default(
    llm_provider=LLMProvider.GOOGLE_GENERATIVE_AI,
    llm_model_name=LLMModel.GEMINI_2_0_FLASH
)

_portia = Portia(config=_config, tools=_tool_registry)

def run_tile_generation_agent(scene_description: str, output_tile_name: str) -> str:
    agent_instruction = f"""
    You are creating a tile named '{output_tile_name}'.
    1. Validate the scene: '{scene_description}' using the scene validator tool.
    2. If the validator returns 'true', generate an image prompt from it but if the validator returns 'false', generate a better fitting prompt.
    3. Use the prompt to generate an image (save it as '{output_tile_name}.png') and 3D asset (save it as '{output_tile_name}.glb').
    5. Upload both the image .png file and 3D asset .glb file to Supabase as and return the public URL.
    """

    builder = PlanBuilder(query=agent_instruction)
    
    # STEP 1: Scene validation
    builder.step(
        task="Validate scene from scene_description.",
        tool_id="gemini_scene_validator_tool",
        inputs=[Variable(name="scene_prompt_input", description=f"A dict with scene_description and tile_index")],
        output="validated_context"
    )

    # STEP 2: Generate image prompt if valid
    builder.step(
        task="Generate image prompt from scene description",
        tool_id="gemini_image_prompt_tool",
        output="prompt_context_valid",
        inputs=[Variable(name="true_image_prompt_input", description="A dict with scene_description, tile_index and scene_validation_result")],
        condition="if $validated_context.scene_validation_result is true"
    )

    # STEP 3: Generate fallback image prompt if invalid
    builder.step(
        task="Generate fallback image prompt",
        tool_id="gemini_image_prompt_tool",
        output="prompt_context_fallback",
        inputs=[Variable(name="false_image_prompt_input", description="A dict with scene_description, tile_index and scene_validation_result")],
        condition="if $validated_context.scene_validation_result is false"
    )

    # STEP 4: Generate image from final_image_prompt
    builder.step(
        task="Generate image from final_image_prompt",
        tool_id="openai_image_gen_tool",
        output="image_context_valid",
        inputs=[Variable(name="true_image_gen_input", description="A dict with scene_description, tile_index and final_image_prompt")],
        condition="if $validated_context.scene_validation_result is true"
    )

    # STEP 5: Generate image from fallback_image_prompt
    builder.step(
        task="Generate image from fallback_image_prompt",
        tool_id="openai_image_gen_tool",
        output="image_context_fallback",
        inputs=[Variable(name="false_image_gen_input", description="A dict with scene_description, tile_index and fallback_image_prompt")],
        condition="if $validated_context.scene_validation_result is false"
    )

    # STEP 6: Upload image to Supabase (from whichever path succeeded)
    builder.step(
        task="Upload image to Supabase",
        tool_id="supabase_asset_uploader_tool",
        output="final_context",
        inputs=[Variable(name="supabase_upload_input", description="A dict with the tile_index, local image path and local 3D asset path")]
    )

    with execution_context(end_user_id="tile-user", additional_data={"scene_description": scene_description, "tile_index": output_tile_name}):
        # Build plan and wrap in context
        plan = builder.build()
        new_plan = _portia.plan(
            query=agent_instruction,
            example_plans=[*DEFAULT_EXAMPLE_PLANS, plan]
        )

        print(new_plan.pretty_print())
    
        assert "scene_description" in get_execution_context().additional_data
        plan_run = _portia.run_plan(new_plan)

    print(plan_run.model_dump_json(indent=2))

    final_output = plan_run.outputs.step_outputs.get("final_context")
    if final_output:
        return final_output.value.get("uploaded_url", "Upload failed or no output")
    else:
        return "Plan completed without producing final_context"

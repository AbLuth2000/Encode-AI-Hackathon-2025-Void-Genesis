from pydantic import BaseModel, Field
from portia.tool import Tool, ToolRunContext
from pathlib import Path
import requests
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL") or "sk-LDh2N2YcPvKkUuZGj697k5NVWQoqCgmu4XTLJzHCbt8sWuHs"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
BUCKET = "encode-assets"


class SupabaseUploadSchema(BaseModel):
    """Inputs for uploading both an image and a 3D asset to Supabase."""
    tile_index: str = Field(..., description="The tile position number.")
    image_path: str = Field(..., description="The local path of the image to be stored.")
    asset_path: str = Field(..., description="The local path of the 3D asset to be stored.")


class SupabaseAssetUploaderTool(Tool[dict]):
    """Uploads an image and a 3D asset to Supabase, returns the public URL of the 3D asset."""

    id: str = "supabase_asset_uploader_tool"
    name: str = "Supabase Asset Uploader Tool"
    description: str = (
        "Uploads an image and a 3D asset to a Supabase bucket and returns the public URL of the 3D asset."
    )
    args_schema: type[BaseModel] = SupabaseUploadSchema
    output_schema: tuple[str, str] = ("json", "Dict with 'uploaded_url' that has the Supabase URL of the 3D asset.")

    def _upload_file(self, file_path: str, filename: str, content_type: str) -> tuple[bool, str]:
        try:
            with open(file_path, "rb") as f:
                headers = {
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": content_type
                }

                upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{filename}"
                response = requests.put(upload_url, headers=headers, data=f)

            if response.ok:
                return True, f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{filename}"
            else:
                return False, f"Upload failed: {response.status_code} - {response.text}"

        except Exception as e:
            return False, f"Exception during upload: {e}"

    def run(self, _: ToolRunContext, tile_index: str, image_path: str, asset_path: str) -> dict:
        # Upload image
        image_filename = f"{tile_index}.png"
        if not Path(image_path).exists():
            return {"uploaded_url": f"Image not found at: {image_path}"}
        self._upload_file(image_path, image_filename, "image/png")

        # Upload 3D asset
        asset_filename = f"{tile_index}.glb"
        if not Path(asset_path).exists():
            return {"uploaded_url": f"3D asset not found at: {asset_path}"}
        success, model_url = self._upload_file(asset_path, asset_filename, "model/gltf-binary")

        return {
            "uploaded_url": model_url if success else f"3D asset upload failed: {model_url}"
        }

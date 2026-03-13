from pathlib import Path

from fastapi import APIRouter

from app.api.schemas import ContainerImageOut

router = APIRouter(tags=["images"])

VISION_DIR = Path(__file__).resolve().parent.parent / "vision"


@router.get("/container-image/{container_id}", response_model=ContainerImageOut)
def get_container_image(container_id: int):
    esp32_cam_path = VISION_DIR / f"container_{container_id}.jpg"
    webcam_path = VISION_DIR / "webcam" / f"container_{container_id}.jpg"

    if esp32_cam_path.exists():
        return {
            "container_id": container_id,
            "source": "esp32-cam",
            "image_url": f"/vision/container_{container_id}.jpg",
        }

    if webcam_path.exists():
        return {
            "container_id": container_id,
            "source": "webcam",
            "image_url": f"/vision/webcam/container_{container_id}.jpg",
        }

    return {
        "container_id": container_id,
        "source": "placeholder",
        "image_url": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=60",
    }

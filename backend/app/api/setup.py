from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.api.schemas import SetupConfigIn, SetupConfigOut
from app.database import ContainerConfig, SupermarketSetup, User, get_db

router = APIRouter(prefix="/setup", tags=["setup"])


@router.post("/config", response_model=SetupConfigOut)
def save_setup_config(
    payload: SetupConfigIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.container_count != len(payload.containers):
        raise HTTPException(status_code=400, detail="Container count must match container list length")

    existing_setup = db.query(SupermarketSetup).filter(SupermarketSetup.user_id == current_user.id).first()
    if existing_setup:
        existing_setup.container_count = payload.container_count
    else:
        existing_setup = SupermarketSetup(user_id=current_user.id, container_count=payload.container_count)
        db.add(existing_setup)

    db.query(ContainerConfig).filter(ContainerConfig.user_id == current_user.id).delete()

    for container in payload.containers:
        expected_sensors = 0
        if container.has_temp_humidity_sensor:
            expected_sensors += 1
        if container.has_gas_sensor:
            expected_sensors += 1
        if container.has_camera:
            expected_sensors += 1

        db.add(
            ContainerConfig(
                user_id=current_user.id,
                container_index=container.container_index,
                container_name=container.container_name,
                food_type=container.food_type,
                has_gas_sensor=container.has_gas_sensor,
                has_temp_humidity_sensor=container.has_temp_humidity_sensor,
                has_camera=container.has_camera,
                expected_sensors=expected_sensors,
            )
        )

    db.commit()

    containers = db.query(ContainerConfig).filter(ContainerConfig.user_id == current_user.id).order_by(ContainerConfig.container_index).all()
    return {
        "container_count": existing_setup.container_count,
        "containers": [
            {
                "container_index": c.container_index,
                "container_name": c.container_name,
                "food_type": c.food_type,
                "has_gas_sensor": c.has_gas_sensor,
                "has_temp_humidity_sensor": c.has_temp_humidity_sensor,
                "has_camera": c.has_camera,
                "expected_sensors": c.expected_sensors,
            }
            for c in containers
        ],
    }


@router.get("/config", response_model=SetupConfigOut)
def get_setup_config(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    setup = db.query(SupermarketSetup).filter(SupermarketSetup.user_id == current_user.id).first()
    if not setup:
        return {"container_count": 0, "containers": []}

    containers = db.query(ContainerConfig).filter(ContainerConfig.user_id == current_user.id).order_by(ContainerConfig.container_index).all()
    return {
        "container_count": setup.container_count,
        "containers": [
            {
                "container_index": c.container_index,
                "container_name": c.container_name,
                "food_type": c.food_type,
                "has_gas_sensor": c.has_gas_sensor,
                "has_temp_humidity_sensor": c.has_temp_humidity_sensor,
                "has_camera": c.has_camera,
                "expected_sensors": c.expected_sensors,
            }
            for c in containers
        ],
    }

from datetime import datetime, timedelta
from pathlib import Path

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.api.alerts import router as alerts_router
from app.api.analytics import router as analytics_router
from app.api.auth import router as auth_router
from app.api.images import router as images_router
from app.api.schemas import SensorData
from app.api.setup import router as setup_router
from app.database import AlertEvent, Base, ContainerConfig, SensorHistory, User, engine, get_db
from app.ml.freshness import predict_freshness
from app.services.notifications import send_email_alert, send_sms_alert

app = FastAPI()

# Per-container live data store: { container_id: {...} }
container_data: dict = {}
last_update_time: datetime | None = None


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "https://portable-food-freshness-detect-git-4eedd7-kaushalk123s-projects.vercel.app",
        "https://portable-food-freshness-detection-device-iot-pbcctic4g.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vision_dir = Path(__file__).resolve().parent / "vision"
app.mount("/vision", StaticFiles(directory=vision_dir), name="vision")

app.include_router(auth_router)
app.include_router(setup_router)
app.include_router(alerts_router)
app.include_router(analytics_router)
app.include_router(images_router)


@app.get("/")
def root():
    return {"message": "Food Spoilage Detection API Running"}


@app.post("/sensor-data")
def receive_sensor_data(data: SensorData, db: Session = Depends(get_db)):

    global container_data, last_update_time

    # Accept both new payload format and legacy temp1/temp2/hum1/hum2 payloads.
    temperature = data.temperature
    humidity = data.humidity

    if temperature is None or humidity is None:
        temp_candidates = [
            v for v in [data.temp1, data.temp2] if v is not None and v > 0
        ]
        hum_candidates = [
            v for v in [data.hum1, data.hum2] if v is not None and v > 0
        ]

        if temperature is None and temp_candidates:
            temperature = sum(temp_candidates) / len(temp_candidates)
        if humidity is None and hum_candidates:
            humidity = sum(hum_candidates) / len(hum_candidates)

    # Final fallback so partial device payloads do not fail with 422.
    if temperature is None:
        temperature = 0.0
    if humidity is None:
        humidity = 0.0

    prediction = predict_freshness(temperature, humidity, data.gas, data.food_type)
    freshness_score = prediction["freshness_score"]

    entry = {
        "container_id": data.container_id,
        "temperature": round(temperature, 2),
        "humidity": round(humidity, 2),
        "gas": data.gas,
        "food_type": data.food_type,
        "freshness_score": freshness_score,
        "status": prediction["status"],
        "shelf_life_days": prediction["shelf_life_days"],
        "recommended_discount": prediction["recommended_discount"],
        "action": prediction["action"],
        "timestamp": datetime.utcnow().isoformat(),
    }

    container_data[data.container_id] = entry
    last_update_time = datetime.utcnow()

    db.add(
        SensorHistory(
            container_id=data.container_id,
            temperature=temperature,
            humidity=humidity,
            gas=data.gas,
            freshness_score=freshness_score,
            food_type=data.food_type,
        )
    )

    # Generate spoilage alerts per configured container/user (10-min dedup).
    if freshness_score < 40:
        container_matches = (
            db.query(ContainerConfig)
            .filter(ContainerConfig.container_index == data.container_id)
            .all()
        )

        for container in container_matches:
            user = db.query(User).filter(User.id == container.user_id).first()
            if not user:
                continue

            last_similar = (
                db.query(AlertEvent)
                .filter(
                    AlertEvent.user_id == user.id,
                    AlertEvent.container_id == data.container_id,
                    AlertEvent.alert_type == "spoilage",
                )
                .order_by(AlertEvent.created_at.desc())
                .first()
            )

            if last_similar and datetime.utcnow() - last_similar.created_at < timedelta(minutes=10):
                continue

            message = (
                f"Spoilage Alert | Container {data.container_id} ({container.food_type}) | "
                f"Freshness dropped to {round(freshness_score, 1)}% | "
                f"Shelf life: {prediction['shelf_life_days']} days | "
                f"{prediction['recommended_discount']} discount recommended"
            )
            email_sent = send_email_alert(user.email, "FreshTrack Alert: Spoilage Warning", message)
            sms_sent = (
                send_sms_alert(
                    user.phone_number,
                    f"ALERT: {container.food_type} freshness {round(freshness_score, 1)}%. {prediction['action']}",
                )
                if user.phone_number
                else False
            )

            db.add(
                AlertEvent(
                    user_id=user.id,
                    container_id=data.container_id,
                    food_type=container.food_type,
                    alert_type="spoilage",
                    message=message,
                    freshness_score=round(freshness_score, 2),
                    suggested_action=prediction["action"],
                    sent_email=email_sent,
                    sent_sms=sms_sent,
                )
            )

    db.commit()

    print("Received:", entry)

    return entry


@app.get("/latest-data")
def get_latest_data():
    return {"containers": list(container_data.values())}


@app.get("/latest-data-meta")
def get_latest_data_meta():
    return {"updated_at": last_update_time}
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

latest_data = {}

class SensorData(BaseModel):
    gas: int
    temperature: float
    humidity: float
    container_id: int
    food_type: str


@app.get("/")
def root():
    return {"message": "Food Spoilage Detection API Running"}


@app.post("/sensor-data")
def receive_sensor_data(data: SensorData):

    global latest_data

    freshness_score = 100 - (data.gas * 0.1) - (data.temperature * 0.5) - (data.humidity * 0.2)

    if freshness_score > 70:
        status = "Fresh"
    elif freshness_score > 40:
        status = "Consume Soon"
    else:
        status = "Spoiled"

    latest_data = {
        "gas": data.gas,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "container_id": data.container_id,
        "food_type": data.food_type,
        "freshness_score": freshness_score,
        "status": status,
        "shelf_life_days": 2
    }

    print("Received:", latest_data)

    return latest_data


@app.get("/latest-data")
def get_latest_data():
    return latest_data
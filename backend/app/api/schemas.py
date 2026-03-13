from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class SensorData(BaseModel):
    container_id: int = 1
    temperature: float | None = None
    humidity: float | None = None
    gas: int = 0
    food_type: str = "unknown"
    # Backward-compat fields for older ESP32 payloads.
    temp1: float | None = None
    hum1: float | None = None
    temp2: float | None = None
    hum2: float | None = None
    active_sensors: int | None = None


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    phone_number: str | None = None
    supermarket_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    phone_number: str | None
    supermarket_name: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ContainerConfigIn(BaseModel):
    container_index: int
    container_name: str
    food_type: str
    has_gas_sensor: bool = True
    has_temp_humidity_sensor: bool = True
    has_camera: bool = False


class SetupConfigIn(BaseModel):
    container_count: int = Field(ge=1, le=200)
    containers: list[ContainerConfigIn]


class ContainerConfigOut(ContainerConfigIn):
    expected_sensors: int


class SetupConfigOut(BaseModel):
    container_count: int
    containers: list[ContainerConfigOut]


class AlertOut(BaseModel):
    id: int
    container_id: int
    food_type: str
    alert_type: str
    message: str
    freshness_score: float | None
    suggested_action: str | None
    sent_email: bool
    sent_sms: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class AnalyticsOut(BaseModel):
    total_containers_monitored: int
    spoilage_risk_containers: int
    estimated_waste_prevented_kg: float
    estimated_money_saved_inr: float


class AnalyticsOverviewOut(BaseModel):
    total_containers: int
    containers_at_risk: int
    estimated_loss: float
    estimated_saved: float


class AnalyticsMonthlyOut(BaseModel):
    days: list[str]
    spoilage_events: list[int]
    saved_revenue: list[float]


class ContainerImageOut(BaseModel):
    container_id: int
    source: str
    image_url: str

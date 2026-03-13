from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .core import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(30), nullable=True)
    supermarket_name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    setup: Mapped["SupermarketSetup"] = relationship("SupermarketSetup", back_populates="user", uselist=False)
    containers: Mapped[list["ContainerConfig"]] = relationship("ContainerConfig", back_populates="user")
    alerts: Mapped[list["AlertEvent"]] = relationship("AlertEvent", back_populates="user")


class SupermarketSetup(Base):
    __tablename__ = "supermarket_setups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    container_count: Mapped[int] = mapped_column(Integer, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped[User] = relationship("User", back_populates="setup")


class ContainerConfig(Base):
    __tablename__ = "container_configs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    container_index: Mapped[int] = mapped_column(Integer, nullable=False)
    container_name: Mapped[str] = mapped_column(String(100), nullable=False)
    food_type: Mapped[str] = mapped_column(String(100), nullable=False)
    has_gas_sensor: Mapped[bool] = mapped_column(Boolean, default=True)
    has_temp_humidity_sensor: Mapped[bool] = mapped_column(Boolean, default=True)
    has_camera: Mapped[bool] = mapped_column(Boolean, default=False)
    expected_sensors: Mapped[int] = mapped_column(Integer, default=2)

    user: Mapped[User] = relationship("User", back_populates="containers")


class AlertEvent(Base):
    __tablename__ = "alert_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    container_id: Mapped[int] = mapped_column(Integer, nullable=False)
    food_type: Mapped[str] = mapped_column(String(100), nullable=False)
    alert_type: Mapped[str] = mapped_column(String(50), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    freshness_score: Mapped[float] = mapped_column(Float, nullable=True)
    suggested_action: Mapped[str] = mapped_column(String(255), nullable=True)
    sent_email: Mapped[bool] = mapped_column(Boolean, default=False)
    sent_sms: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped[User] = relationship("User", back_populates="alerts")


class SensorHistory(Base):
    __tablename__ = "sensor_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    container_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    temperature: Mapped[float] = mapped_column(Float, nullable=False)
    humidity: Mapped[float] = mapped_column(Float, nullable=False)
    gas: Mapped[int] = mapped_column(Integer, nullable=False)
    freshness_score: Mapped[float] = mapped_column(Float, nullable=True)
    food_type: Mapped[str] = mapped_column(String(100), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

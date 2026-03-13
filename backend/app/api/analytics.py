from collections import defaultdict
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.api.schemas import AnalyticsMonthlyOut, AnalyticsOut, AnalyticsOverviewOut
from app.database import AlertEvent, ContainerConfig, SensorHistory, User, get_db

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsOut)
def get_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_containers = db.query(ContainerConfig).filter(ContainerConfig.user_id == current_user.id).count()

    spoilage_risk_containers = max(1 if total_containers > 0 else 0, int(total_containers * 0.25))
    estimated_waste_prevented_kg = round(total_containers * 1.8, 2)
    estimated_money_saved_inr = round(estimated_waste_prevented_kg * 260, 2)

    return {
        "total_containers_monitored": total_containers,
        "spoilage_risk_containers": spoilage_risk_containers,
        "estimated_waste_prevented_kg": estimated_waste_prevented_kg,
        "estimated_money_saved_inr": estimated_money_saved_inr,
    }


@router.get("/overview", response_model=AnalyticsOverviewOut)
def get_overview(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Real-time overview using SensorHistory from the last 24 hours."""
    total = db.query(ContainerConfig).filter(ContainerConfig.user_id == current_user.id).count()

    user_container_ids = [
        c.container_index
        for c in db.query(ContainerConfig).filter(ContainerConfig.user_id == current_user.id).all()
    ]

    at_risk = 0
    if user_container_ids:
        cutoff = datetime.utcnow() - timedelta(hours=24)
        at_risk = (
            db.query(SensorHistory.container_id)
            .filter(
                SensorHistory.container_id.in_(user_container_ids),
                SensorHistory.freshness_score < 40,
                SensorHistory.timestamp >= cutoff,
            )
            .distinct()
            .count()
        )

    estimated_loss = round(at_risk * 1500.0, 2)
    estimated_saved = round((total - at_risk) * 500.0, 2)

    return {
        "total_containers": total,
        "containers_at_risk": at_risk,
        "estimated_loss": estimated_loss,
        "estimated_saved": estimated_saved,
    }


@router.get("/monthly", response_model=AnalyticsMonthlyOut)
def get_monthly(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Last 30 days of spoilage events for graph rendering."""
    cutoff = datetime.utcnow() - timedelta(days=30)

    events = (
        db.query(AlertEvent)
        .filter(
            AlertEvent.user_id == current_user.id,
            AlertEvent.alert_type == "spoilage",
            AlertEvent.created_at >= cutoff,
        )
        .all()
    )

    spoilage_by_day: dict[str, int] = defaultdict(int)
    for evt in events:
        spoilage_by_day[str(evt.created_at.day)] += 1

    days = [str(i) for i in range(1, 31)]
    spoilage_events = [spoilage_by_day.get(d, 0) for d in days]
    saved_revenue = [max(0.0, (3 - s) * 300.0) for s in spoilage_events]

    return {
        "days": days,
        "spoilage_events": spoilage_events,
        "saved_revenue": saved_revenue,
    }

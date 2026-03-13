from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.api.schemas import AlertOut
from app.database import AlertEvent, User, get_db

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("", response_model=list[AlertOut])
def get_alerts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(AlertEvent)
        .filter(AlertEvent.user_id == current_user.id)
        .order_by(AlertEvent.created_at.desc())
        .limit(50)
        .all()
    )

"""
Dashboard endpoint.

GET /api/dashboard → upcoming check-ins + latest alerts
"""

from datetime import datetime, timezone
from fastapi import APIRouter

from app.database import db
from app.response import success_response, error_response

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("")
async def get_dashboard(page: int = 1):
    """
    Returns:
      - upcoming_checkins: meetings where next_followup_date >= today (paginated)
      - total_upcoming_checkins: count of all upcoming check-ins
      - latest_alerts:     10 most recent alerts
    """
    try:
        now = datetime.now(timezone.utc)
        take = 6
        skip = (page - 1) * take

        total_upcoming_checkins = await db.meeting.count(
            where={"next_followup_date": {"gte": now}}
        )

        upcoming_checkins = await db.meeting.find_many(
            where={"next_followup_date": {"gte": now}},
            order={"next_followup_date": "asc"},
            include={"employee": True},
            take=take,
            skip=skip,
        )

        latest_alerts = await db.employeealert.find_many(
            take=10,
            order={"created_at": "desc"},
            include={"employee": True},
        )

        return success_response(
            {
                "upcoming_checkins": [
                    c.model_dump(mode="json") for c in upcoming_checkins
                ],
                "total_upcoming_checkins": total_upcoming_checkins,
                "latest_alerts": [
                    a.model_dump(mode="json") for a in latest_alerts
                ],
            }
        )
    except Exception as exc:
        return error_response(str(exc), 500)

"""
Meeting Insights CRUD routes.

GET    /api/insights/{meeting_id}  → get insights for a meeting
POST   /api/insights               → create insight
PUT    /api/insights/{id}           → update insight
DELETE /api/insights/{id}           → delete insight
"""

from fastapi import APIRouter

from app.database import db
from app.response import success_response, error_response
from app.schemas.insight import InsightCreate, InsightUpdate

router = APIRouter(prefix="/api/insights", tags=["Meeting Insights"])


# ── Get insights for a meeting ────────────────────────────────

@router.get("/{meeting_id}")
async def get_meeting_insights(meeting_id: str):
    try:
        # Verify meeting exists
        meeting = await db.meeting.find_unique(where={"id": meeting_id})
        if not meeting:
            return error_response("Meeting not found", 404)

        insights = await db.meetinginsight.find_many(
            where={"meeting_id": meeting_id},
            order={"created_at": "desc"},
        )
        return success_response([i.model_dump(mode="json") for i in insights])
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Create insight ────────────────────────────────────────────

@router.post("", status_code=201)
async def create_insight(payload: InsightCreate):
    try:
        meeting = await db.meeting.find_unique(where={"id": payload.meeting_id})
        if not meeting:
            return error_response("Meeting not found", 404)

        insight = await db.meetinginsight.create(data=payload.model_dump())
        return success_response(insight.model_dump(mode="json"), 201)
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Update insight ────────────────────────────────────────────

@router.put("/{insight_id}")
async def update_insight(insight_id: str, payload: InsightUpdate):
    try:
        existing = await db.meetinginsight.find_unique(where={"id": insight_id})
        if not existing:
            return error_response("Insight not found", 404)

        updated = await db.meetinginsight.update(
            where={"id": insight_id},
            data=payload.model_dump(exclude_unset=True),
        )
        return success_response(updated.model_dump(mode="json"))
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Delete insight ────────────────────────────────────────────

@router.delete("/{insight_id}")
async def delete_insight(insight_id: str):
    try:
        existing = await db.meetinginsight.find_unique(where={"id": insight_id})
        if not existing:
            return error_response("Insight not found", 404)

        await db.meetinginsight.delete(where={"id": insight_id})
        return success_response({"message": "Insight deleted successfully"})
    except Exception as exc:
        return error_response(str(exc), 500)

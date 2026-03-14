"""
Meeting CRUD routes + employee-scoped meetings.

GET    /api/meetings                   → list all meetings
GET    /api/meetings/{id}              → get meeting with insights
POST   /api/meetings                   → create meeting (+ auto-timeline event)
PUT    /api/meetings/{id}              → update meeting
DELETE /api/meetings/{id}              → delete meeting
GET    /api/employees/{id}/meetings    → meetings for an employee
"""

from fastapi import APIRouter

from app.database import db
from app.response import success_response, error_response
from app.schemas.meeting import MeetingCreate, MeetingUpdate

router = APIRouter(tags=["Meetings"])


# ── List all meetings ─────────────────────────────────────────

@router.get("/api/meetings")
async def list_meetings():
    try:
        meetings = await db.meeting.find_many(
            order={"meeting_date": "desc"},
            include={"employee": True},
        )
        return success_response([m.model_dump(mode="json") for m in meetings])
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Get meeting details ──────────────────────────────────────

@router.get("/api/meetings/{meeting_id}")
async def get_meeting(meeting_id: str):
    try:
        meeting = await db.meeting.find_unique(
            where={"id": meeting_id},
            include={"employee": True, "insights": True},
        )
        if not meeting:
            return error_response("Meeting not found", 404)
        return success_response(meeting.model_dump(mode="json"))
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Create meeting (+ auto-create timeline event) ────────────

@router.post("/api/meetings", status_code=201)
async def create_meeting(payload: MeetingCreate):
    try:
        # Verify employee exists
        employee = await db.employee.find_unique(where={"id": payload.employee_id})
        if not employee:
            return error_response("Employee not found", 404)

        meeting = await db.meeting.create(data=payload.model_dump())

        # ── Business Logic: auto-create institutional memory event ──
        await db.institutionalmemory.create(
            data={
                "employee_id": payload.employee_id,
                "event_type": "meeting",
                "title": "Employee Check-in",
                "description": payload.summary or "Meeting recorded",
                "source": "meeting transcript",
            }
        )

        return success_response(meeting.model_dump(mode="json"), 201)
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Update meeting ────────────────────────────────────────────

@router.put("/api/meetings/{meeting_id}")
async def update_meeting(meeting_id: str, payload: MeetingUpdate):
    try:
        existing = await db.meeting.find_unique(where={"id": meeting_id})
        if not existing:
            return error_response("Meeting not found", 404)

        updated = await db.meeting.update(
            where={"id": meeting_id},
            data=payload.model_dump(exclude_unset=True),
        )
        return success_response(updated.model_dump(mode="json"))
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Delete meeting ────────────────────────────────────────────

@router.delete("/api/meetings/{meeting_id}")
async def delete_meeting(meeting_id: str):
    try:
        existing = await db.meeting.find_unique(where={"id": meeting_id})
        if not existing:
            return error_response("Meeting not found", 404)

        await db.meeting.delete(where={"id": meeting_id})
        return success_response({"message": "Meeting deleted successfully"})
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Meetings for an employee ─────────────────────────────────

@router.get("/api/employees/{employee_id}/meetings")
async def get_employee_meetings(employee_id: str):
    try:
        employee = await db.employee.find_unique(where={"id": employee_id})
        if not employee:
            return error_response("Employee not found", 404)

        meetings = await db.meeting.find_many(
            where={"employee_id": employee_id},
            order={"meeting_date": "desc"},
            include={"insights": True},
        )
        return success_response([m.model_dump(mode="json") for m in meetings])
    except Exception as exc:
        return error_response(str(exc), 500)

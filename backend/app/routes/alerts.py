"""
Employee Alerts routes.

GET    /api/alerts                     → list all alerts
GET    /api/employees/{id}/alerts      → alerts for an employee
POST   /api/alerts                     → create alert
DELETE /api/alerts/{id}                → delete alert
"""

from fastapi import APIRouter

from app.database import db
from app.response import success_response, error_response
from app.schemas.alert import AlertCreate

router = APIRouter(tags=["Employee Alerts"])


# ── List all alerts ───────────────────────────────────────────

@router.get("/api/alerts")
async def list_alerts():
    try:
        alerts = await db.employeealert.find_many(
            order={"created_at": "desc"},
            include={"employee": True},
        )
        return success_response([a.model_dump(mode="json") for a in alerts])
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Alerts for an employee ────────────────────────────────────

@router.get("/api/employees/{employee_id}/alerts")
async def get_employee_alerts(employee_id: str):
    try:
        employee = await db.employee.find_unique(where={"id": employee_id})
        if not employee:
            return error_response("Employee not found", 404)

        alerts = await db.employeealert.find_many(
            where={"employee_id": employee_id},
            order={"created_at": "desc"},
        )
        return success_response([a.model_dump(mode="json") for a in alerts])
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Create alert ──────────────────────────────────────────────

@router.post("/api/alerts", status_code=201)
async def create_alert(payload: AlertCreate):
    try:
        employee = await db.employee.find_unique(where={"id": payload.employee_id})
        if not employee:
            return error_response("Employee not found", 404)

        alert = await db.employeealert.create(data=payload.model_dump())
        return success_response(alert.model_dump(mode="json"), 201)
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Delete alert ──────────────────────────────────────────────

@router.delete("/api/alerts/{alert_id}")
async def delete_alert(alert_id: str):
    try:
        existing = await db.employeealert.find_unique(where={"id": alert_id})
        if not existing:
            return error_response("Alert not found", 404)

        await db.employeealert.delete(where={"id": alert_id})
        return success_response({"message": "Alert deleted successfully"})
    except Exception as exc:
        return error_response(str(exc), 500)

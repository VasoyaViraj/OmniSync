"""
Employee CRUD routes.

GET    /api/employees          → list all employees
GET    /api/employees/{id}     → full profile (+ meetings, alerts, notes, timeline)
POST   /api/employees          → create employee
PUT    /api/employees/{id}     → update employee
DELETE /api/employees/{id}     → delete employee
"""

from fastapi import APIRouter

from app.database import db
from app.response import success_response, error_response
from app.schemas.employee import EmployeeCreate, EmployeeUpdate

router = APIRouter(prefix="/api/employees", tags=["Employees"])


# ── List all employees ────────────────────────────────────────

@router.get("")
async def list_employees():
    try:
        employees = await db.employee.find_many(order={"created_at": "desc"})
        return success_response([e.model_dump(mode="json") for e in employees])
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Get employee profile (enriched) ──────────────────────────

@router.get("/{employee_id}")
async def get_employee(employee_id: str):
    try:
        employee = await db.employee.find_unique(
            where={"id": employee_id},
            include={
                "meetings": {"order_by": {"meeting_date": "desc"}},
                "alerts": {"order_by": {"created_at": "desc"}},
                "notes": {"order_by": {"created_at": "desc"}},
                "institutional_memory": {"order_by": {"created_at": "desc"}},
            },
        )
        if not employee:
            return error_response("Employee not found", 404)
        return success_response(employee.model_dump(mode="json"))
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Create employee ──────────────────────────────────────────

@router.post("", status_code=201)
async def create_employee(payload: EmployeeCreate):
    try:
        employee = await db.employee.create(data=payload.model_dump())
        return success_response(employee.model_dump(mode="json"), 201)
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Update employee ──────────────────────────────────────────

@router.put("/{employee_id}")
async def update_employee(employee_id: str, payload: EmployeeUpdate):
    try:
        existing = await db.employee.find_unique(where={"id": employee_id})
        if not existing:
            return error_response("Employee not found", 404)

        updated = await db.employee.update(
            where={"id": employee_id},
            data=payload.model_dump(exclude_unset=True),
        )
        return success_response(updated.model_dump(mode="json"))
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Delete employee ──────────────────────────────────────────

@router.delete("/{employee_id}")
async def delete_employee(employee_id: str):
    try:
        existing = await db.employee.find_unique(where={"id": employee_id})
        if not existing:
            return error_response("Employee not found", 404)

        await db.employee.delete(where={"id": employee_id})
        return success_response({"message": "Employee deleted successfully"})
    except Exception as exc:
        return error_response(str(exc), 500)

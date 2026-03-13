"""
Institutional Memory routes.

GET    /api/employees/{id}/timeline  → employee memory timeline
POST   /api/memory                   → create memory event
DELETE /api/memory/{id}              → delete memory event
"""

from fastapi import APIRouter

from app.database import db
from app.response import success_response, error_response
from app.schemas.memory import MemoryCreate

router = APIRouter(tags=["Institutional Memory"])


# ── Timeline for an employee ─────────────────────────────────

@router.get("/api/employees/{employee_id}/timeline")
async def get_employee_timeline(employee_id: str):
    try:
        employee = await db.employee.find_unique(where={"id": employee_id})
        if not employee:
            return error_response("Employee not found", 404)

        timeline = await db.institutionalmemory.find_many(
            where={"employee_id": employee_id},
            order={"created_at": "desc"},
        )
        return success_response([t.model_dump(mode="json") for t in timeline])
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Create memory event ──────────────────────────────────────

@router.post("/api/memory", status_code=201)
async def create_memory(payload: MemoryCreate):
    try:
        employee = await db.employee.find_unique(where={"id": payload.employee_id})
        if not employee:
            return error_response("Employee not found", 404)

        memory = await db.institutionalmemory.create(data=payload.model_dump())
        return success_response(memory.model_dump(mode="json"), 201)
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Delete memory event ──────────────────────────────────────

@router.delete("/api/memory/{memory_id}")
async def delete_memory(memory_id: str):
    try:
        existing = await db.institutionalmemory.find_unique(where={"id": memory_id})
        if not existing:
            return error_response("Memory event not found", 404)

        await db.institutionalmemory.delete(where={"id": memory_id})
        return success_response({"message": "Memory event deleted successfully"})
    except Exception as exc:
        return error_response(str(exc), 500)

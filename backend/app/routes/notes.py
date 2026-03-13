"""
Employee Notes routes.

GET    /api/employees/{id}/notes  → notes for an employee
POST   /api/notes                 → create note
PUT    /api/notes/{id}            → update note
DELETE /api/notes/{id}            → delete note
"""

from fastapi import APIRouter

from app.database import db
from app.response import success_response, error_response
from app.schemas.note import NoteCreate, NoteUpdate

router = APIRouter(tags=["Employee Notes"])


# ── Notes for an employee ─────────────────────────────────────

@router.get("/api/employees/{employee_id}/notes")
async def get_employee_notes(employee_id: str):
    try:
        employee = await db.employee.find_unique(where={"id": employee_id})
        if not employee:
            return error_response("Employee not found", 404)

        notes = await db.employeenote.find_many(
            where={"employee_id": employee_id},
            order={"created_at": "desc"},
        )
        return success_response([n.model_dump(mode="json") for n in notes])
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Create note ───────────────────────────────────────────────

@router.post("/api/notes", status_code=201)
async def create_note(payload: NoteCreate):
    try:
        employee = await db.employee.find_unique(where={"id": payload.employee_id})
        if not employee:
            return error_response("Employee not found", 404)

        note = await db.employeenote.create(data=payload.model_dump())
        return success_response(note.model_dump(mode="json"), 201)
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Update note ───────────────────────────────────────────────

@router.put("/api/notes/{note_id}")
async def update_note(note_id: str, payload: NoteUpdate):
    try:
        existing = await db.employeenote.find_unique(where={"id": note_id})
        if not existing:
            return error_response("Note not found", 404)

        updated = await db.employeenote.update(
            where={"id": note_id},
            data=payload.model_dump(exclude_unset=True),
        )
        return success_response(updated.model_dump(mode="json"))
    except Exception as exc:
        return error_response(str(exc), 500)


# ── Delete note ───────────────────────────────────────────────

@router.delete("/api/notes/{note_id}")
async def delete_note(note_id: str):
    try:
        existing = await db.employeenote.find_unique(where={"id": note_id})
        if not existing:
            return error_response("Note not found", 404)

        await db.employeenote.delete(where={"id": note_id})
        return success_response({"message": "Note deleted successfully"})
    except Exception as exc:
        return error_response(str(exc), 500)

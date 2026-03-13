"""Pydantic schemas for Employee Note validation."""

from pydantic import BaseModel, Field
from typing import Optional


class NoteCreate(BaseModel):
    employee_id: str
    note: str = Field(..., min_length=1)
    created_by: str = Field(..., min_length=1, max_length=255)


class NoteUpdate(BaseModel):
    note: Optional[str] = Field(None, min_length=1)
    created_by: Optional[str] = Field(None, min_length=1, max_length=255)

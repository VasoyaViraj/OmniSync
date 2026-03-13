"""Pydantic schemas for Institutional Memory validation."""

from pydantic import BaseModel, Field
from typing import Optional


class MemoryCreate(BaseModel):
    employee_id: str
    event_type: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None
    source: Optional[str] = None

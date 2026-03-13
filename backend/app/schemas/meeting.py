"""Pydantic schemas for Meeting validation."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class MeetingCreate(BaseModel):
    employee_id: str
    hr_id: str
    meeting_date: datetime
    audio_url: Optional[str] = None
    transcript: Optional[str] = None
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    next_followup_date: Optional[datetime] = None


class MeetingUpdate(BaseModel):
    employee_id: Optional[str] = None
    hr_id: Optional[str] = None
    meeting_date: Optional[datetime] = None
    audio_url: Optional[str] = None
    transcript: Optional[str] = None
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    next_followup_date: Optional[datetime] = None

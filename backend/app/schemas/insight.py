"""Pydantic schemas for Meeting Insight validation."""

from pydantic import BaseModel, Field
from typing import Optional


class InsightCreate(BaseModel):
    meeting_id: str
    key_takeaways: Optional[str] = None
    action_items: Optional[str] = None
    risk_flags: Optional[str] = None
    sentiment_score: float = Field(default=0, ge=-1, le=1)


class InsightUpdate(BaseModel):
    key_takeaways: Optional[str] = None
    action_items: Optional[str] = None
    risk_flags: Optional[str] = None
    sentiment_score: Optional[float] = Field(None, ge=-1, le=1)

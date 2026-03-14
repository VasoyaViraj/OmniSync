"""Pydantic schemas for Meeting Insight validation.

The DB columns are: key_takeaways, action_items, risk_flags, sentiment_score.
A 'content' alias is accepted for backwards compat (maps → key_takeaways).
"""

from pydantic import BaseModel, Field, model_validator
from typing import Optional


class InsightCreate(BaseModel):
    meeting_id: str
    key_takeaways: Optional[str] = None
    action_items: Optional[str] = None
    risk_flags: Optional[str] = None
    sentiment_score: float = Field(default=0, ge=-1, le=1)

    # Allow frontend to send { content: "..." } and treat it as key_takeaways
    @model_validator(mode="before")
    @classmethod
    def alias_content(cls, values):
        if isinstance(values, dict) and "content" in values and "key_takeaways" not in values:
            values["key_takeaways"] = values.pop("content")
        # Also strip unknown fields like insight_type that are not in DB
        values.pop("insight_type", None)
        return values


class InsightUpdate(BaseModel):
    key_takeaways: Optional[str] = None
    action_items: Optional[str] = None
    risk_flags: Optional[str] = None
    sentiment_score: Optional[float] = Field(None, ge=-1, le=1)

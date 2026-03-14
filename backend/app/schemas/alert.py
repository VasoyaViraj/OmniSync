"""Pydantic schemas for Employee Alert validation."""

from pydantic import BaseModel, Field
from typing import Optional


class AlertCreate(BaseModel):
    employee_id: str
    alert_type: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1)
    severity: str = Field(
        ...,
        pattern=r"^(low|medium|high|critical|warning|info)$",
    )


class AlertUpdate(BaseModel):
    alert_type: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1)
    severity: Optional[str] = Field(
        None,
        pattern=r"^(low|medium|high|critical|warning|info)$",
    )

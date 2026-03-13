"""Pydantic schemas for Employee validation."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class EmployeeCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=255)
    designation: str = Field(..., min_length=1, max_length=255)
    location: str = Field(..., min_length=1, max_length=255)
    manager_id: Optional[str] = None
    tenure_years: float = Field(default=0, ge=0)
    performance_score: float = Field(default=0, ge=0, le=10)
    engagement_score: float = Field(default=0, ge=0, le=10)


class EmployeeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    department: Optional[str] = Field(None, min_length=1, max_length=255)
    designation: Optional[str] = Field(None, min_length=1, max_length=255)
    location: Optional[str] = Field(None, min_length=1, max_length=255)
    manager_id: Optional[str] = None
    tenure_years: Optional[float] = Field(None, ge=0)
    performance_score: Optional[float] = Field(None, ge=0, le=10)
    engagement_score: Optional[float] = Field(None, ge=0, le=10)

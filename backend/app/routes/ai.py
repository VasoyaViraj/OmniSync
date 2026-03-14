"""
AI stub routes — replicate the dummy Next.js API routes.

POST /api/ai/transcribe         → dummy transcript
POST /api/ai/analyze-meeting    → dummy summary + insights + sentiment
POST /api/ai/generate-alert     → dummy alertType
POST /api/ai/meeting-prep       → dummy prep_notes
POST /api/ai/chat               → dummy answer
"""

import asyncio
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/ai", tags=["AI"])


# ── Request models ────────────────────────────────────────────


class TranscribeRequest(BaseModel):
    filename: Optional[str] = None


class AnalyzeMeetingRequest(BaseModel):
    transcript: str


class GenerateAlertRequest(BaseModel):
    summary: str
    sentiment: str


class MeetingPrepRequest(BaseModel):
    meetingId: str
    employeeId: str


class ChatRequest(BaseModel):
    meetingId: str
    question: str


# ── Routes ────────────────────────────────────────────────────


@router.post("/transcribe")
async def transcribe():
    """Simulate audio transcription (Whisper stub)."""
    await asyncio.sleep(2)
    return {
        "transcript": (
            "HR: Thanks for joining today. How have things been going?\n"
            "Employee: Honestly, it's been pretty intense lately. The workload for the new Q3 deliverables is higher than I expected.\n"
            "HR: I hear you. Do you feel you have the resources you need?\n"
            "Employee: We're making do, but I am putting in a lot of extra hours. "
            "On a positive note, I am really interested in taking on more leadership responsibilities "
            "as the team grows, maybe moving into a Team Lead role next year."
        )
    }


@router.post("/analyze-meeting")
async def analyze_meeting(payload: AnalyzeMeetingRequest):
    """Simulate AI extraction of summary, insights, and sentiment."""
    await asyncio.sleep(2.5)

    text = payload.transcript.lower()
    if any(w in text for w in ["overwhelmed", "intense", "burnout", "stress"]):
        sentiment = "Negative"
    elif any(w in text for w in ["excited", "great", "thrilled", "positive"]):
        sentiment = "Positive"
    else:
        sentiment = "Neutral"

    return {
        "summary": (
            "The employee discussed their current project workload, indicating some stress regarding "
            "recent deadlines. They also expressed clear interest in career advancement, specifically "
            "mentioning a desire to move into a Team Lead position within the next year."
        ),
        "insights": {
            "key_takeaways": "Experiencing high workload and stress related to Q3 deliverables; Strong desire for career growth",
            "action_items": "Schedule follow-up on resource allocation; Discuss leadership development path",
            "risk_flags": "Risk of burnout if resources are not adjusted",
            "sentiment_score": -0.5 if sentiment == "Negative" else 0.8 if sentiment == "Positive" else 0.0
        },
        "sentiment": sentiment,
    }


@router.post("/generate-alert")
async def generate_alert(payload: GenerateAlertRequest):
    """Simulate AI-generated early warning signal."""
    await asyncio.sleep(1.5)

    summary_lower = payload.summary.lower()
    if payload.sentiment == "Negative":
        alert_type = "High Risk: Burnout / Workload pressure mentioned"
    elif any(w in summary_lower for w in ["promotion", "lead", "leadership", "growth"]):
        alert_type = "Flight Risk: Seeking career growth opportunities"
    else:
        alert_type = "Check-in needed next quarter"

    return {"alertType": alert_type}


@router.post("/meeting-prep")
async def meeting_prep(payload: MeetingPrepRequest):
    """Simulate AI-generated meeting preparation brief."""
    await asyncio.sleep(1.2)
    return {
        "prep_notes": (
            "Based on previous performance reviews and institutional memory, focus on discussing "
            "workload balance, sprint velocity stress, and providing a clear path for career growth "
            "towards the Team Lead role."
        )
    }


@router.post("/chat")
async def chat(payload: ChatRequest):
    """Simulate RAG-powered meeting Q&A."""
    await asyncio.sleep(0.8)
    return {
        "answer": (
            "During the last three meetings the employee mentioned workload pressure and desire for "
            "leadership opportunities. This correlates directly with the recent drop in engagement scores."
        )
    }

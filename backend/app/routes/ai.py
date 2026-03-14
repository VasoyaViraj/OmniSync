"""
AI routes — backed by Google Gemini (gemini-1.5-flash).

POST /api/ai/transcribe         → dummy transcript (Whisper stub)
POST /api/ai/analyze-meeting    → LIVE Gemini: summary + insights + sentiment
POST /api/ai/generate-alert     → rule-based alertType
POST /api/ai/meeting-prep       → dummy prep_notes
POST /api/ai/chat               → dummy RAG answer
"""

import asyncio
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.services.gemini import generate_insights

router = APIRouter(prefix="/api/ai", tags=["AI"])


# ── Request models ────────────────────────────────────────────────


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


# ── Routes ────────────────────────────────────────────────────────


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
    """
    Analyze a meeting transcript with Gemini and return structured HR insights.

    Returns a flat JSON object with:
      summary, key_takeaways, action_items, risk_flags, sentiment_score, sentiment
    """
    insights = await generate_insights(payload.transcript)

    # Return the flat Gemini response; frontend reads these fields directly.
    return {
        "summary": insights["summary"],
        "insights": {
            "key_takeaways": insights["key_takeaways"],
            "action_items": insights["action_items"],
            "risk_flags": insights["risk_flags"],
            "sentiment_score": insights["sentiment_score"],
        },
        "sentiment": insights["sentiment"],
    }


@router.post("/generate-alert")
async def generate_alert(payload: GenerateAlertRequest):
    """Rule-based early warning signal derived from the analyzed summary."""
    await asyncio.sleep(1.5)

    summary_lower = payload.summary.lower()
    sentiment_lower = payload.sentiment.lower()

    if sentiment_lower in ("negative", "concern"):
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

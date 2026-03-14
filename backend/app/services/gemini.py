"""
Gemini AI service for meeting transcript analysis.

Uses the gemini-1.5-flash model to extract structured HR insights
from a raw meeting transcript.  The prompt instructs the model to
return strictly valid JSON — no markdown fences, no extra text.
"""

import json
import os
import re

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

# ── Configure SDK once at import time ─────────────────────────────
_api_key = os.getenv("GEMINI_API_KEY", "")
if _api_key and _api_key != "your_gemini_api_key_here":
    genai.configure(api_key=_api_key)

_model = genai.GenerativeModel("gemini-2.5-flash")

# ── Prompt template ───────────────────────────────────────────────

PROMPT_TEMPLATE = """\
You are an AI assistant that analyzes employee-manager meeting transcripts \
for an HR intelligence platform called OmniSync.

Your task is to read the meeting transcript and generate structured insights \
that will be stored in a database.

You MUST return the result in STRICT JSON format with the exact schema provided below.
Do NOT include explanations, comments, markdown formatting, or extra text.
Return JSON only.

JSON Schema:
{{
  "summary": string,
  "key_takeaways": string,
  "action_items": string,
  "risk_flags": string,
  "sentiment_score": number,
  "sentiment": string
}}

Field Requirements:

summary:
  Write a clear 3-4 sentence paragraph summarizing the meeting discussion.

key_takeaways:
  Write a short 2-3 sentence paragraph describing the most important insights or points discussed.

action_items:
  Write a short 2-3 sentence paragraph describing next steps, responsibilities, or follow-ups mentioned in the meeting.

risk_flags:
  Write ONE concise line identifying any potential risks such as burnout, disengagement, performance concerns, conflict, or lack of clarity.
  If no risk is present return "No major risk identified".

sentiment_score:
  Return a number between -1 and 1 representing overall emotional tone of the meeting.
  -1 = very negative | -0.5 = concerning | 0 = neutral | 0.5 = positive | 1 = very positive

sentiment:
  Choose ONLY one of these values: positive | negative | neutral | concern

Additional Instructions:
- Base insights strictly on the transcript content.
- Do not hallucinate information that is not present.
- Be concise and professional.
- Keep paragraphs short and readable.
- Avoid bullet points.
- Avoid repeating the same information across fields.

Transcript to analyze:

{transcript}
"""


# ── Public API ────────────────────────────────────────────────────


async def generate_insights(transcript: str) -> dict:
    """
    Call Gemini and return a dict with keys:
      summary, key_takeaways, action_items, risk_flags,
      sentiment_score, sentiment
    Raises HTTPException(502) on network/parse errors.
    """
    if not _api_key or _api_key == "your_gemini_api_key_here":
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY is not configured. Add it to your .env file.",
        )

    prompt = PROMPT_TEMPLATE.replace("{transcript}", transcript)

    try:
        response = _model.generate_content(prompt)
        text = response.text
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Gemini API call failed: {exc}",
        ) from exc

    # Strip accidental markdown fences the model may wrap around the JSON
    # e.g.  ```json\n{...}\n```
    text = re.sub(r"^```(?:json)?\s*", "", text.strip())
    text = re.sub(r"\s*```$", "", text)

    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Gemini returned non-JSON response: {exc}. Raw: {text[:300]}",
        ) from exc

    # Validate required keys are present
    required = {"summary", "key_takeaways", "action_items", "risk_flags", "sentiment_score", "sentiment"}
    missing = required - data.keys()
    if missing:
        raise HTTPException(
            status_code=502,
            detail=f"Gemini response missing required fields: {missing}",
        )

    # Coerce types to be safe
    data["sentiment_score"] = float(data["sentiment_score"])
    data["sentiment"] = str(data["sentiment"]).lower()

    return data

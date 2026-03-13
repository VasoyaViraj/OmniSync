"""
HR Intelligence Dashboard — FastAPI Application Entry Point.

Connects to PostgreSQL via Prisma and registers all API routers.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import db
from app.routes import employees, meetings, insights, alerts, notes, memory, dashboard


# ── Lifespan: Prisma connect / disconnect ─────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()


# ── FastAPI app ───────────────────────────────────────────────

app = FastAPI(
    title="HR Intelligence Dashboard API",
    description="AI-powered REST API for managing employees, meetings, insights, alerts, notes, and institutional memory.",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ─────────────────────────────────────────

app.include_router(employees.router)
app.include_router(meetings.router)
app.include_router(insights.router)
app.include_router(alerts.router)
app.include_router(notes.router)
app.include_router(memory.router)
app.include_router(dashboard.router)


# ── Health check ──────────────────────────────────────────────

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"success": True, "data": {"status": "healthy"}}

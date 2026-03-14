/**
 * API client for the FastAPI backend (http://localhost:8000).
 * All data operations go through these helpers instead of Next.js API routes.
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err?.message || "API Error");
  }
  const json = await res.json();
  return json.data ?? json;
}

// ── Employees ──────────────────────────────────────────────────
export const getEmployees = () => apiFetch<Employee[]>("/api/employees");
export const getEmployee = (id: string) =>
  apiFetch<EmployeeWithRelations>(`/api/employees/${id}`);
export const createEmployee = (data: Partial<Employee>) =>
  apiFetch("/api/employees", { method: "POST", body: JSON.stringify(data) });
export const updateEmployee = (id: string, data: Partial<Employee>) =>
  apiFetch(`/api/employees/${id}`, { method: "PUT", body: JSON.stringify(data) });

// ── Dashboard ──────────────────────────────────────────────────
export const getDashboard = (page: number = 1) =>
  apiFetch<{ upcoming_checkins: Meeting[]; total_upcoming_checkins: number; latest_alerts: Alert[] }>(
    `/api/dashboard?page=${page}`
  );

// ── Meetings ───────────────────────────────────────────────────
export const getMeetings = () => apiFetch<Meeting[]>("/api/meetings");
export const getMeeting = (id: string) =>
  apiFetch<MeetingWithInsights>(`/api/meetings/${id}`);
export const createMeeting = (data: Partial<MeetingCreate>) =>
  apiFetch("/api/meetings", { method: "POST", body: JSON.stringify(data) });
export const getEmployeeMeetings = (id: string) =>
  apiFetch<Meeting[]>(`/api/employees/${id}/meetings`);

// ── Alerts ─────────────────────────────────────────────────────
export const getAlerts = () => apiFetch<Alert[]>("/api/alerts");
export const getEmployeeAlerts = (id: string) =>
  apiFetch<Alert[]>(`/api/employees/${id}/alerts`);
export const createAlert = (data: Partial<AlertCreate>) =>
  apiFetch("/api/alerts", { method: "POST", body: JSON.stringify(data) });
export const deleteAlert = (id: string) =>
  apiFetch(`/api/alerts/${id}`, { method: "DELETE" });

// ── Notes ──────────────────────────────────────────────────────
export const getEmployeeNotes = (id: string) =>
  apiFetch<Note[]>(`/api/employees/${id}/notes`);
export const createNote = (data: Partial<NoteCreate>) =>
  apiFetch("/api/notes", { method: "POST", body: JSON.stringify(data) });

// ── Institutional Memory ───────────────────────────────────────
export const getEmployeeTimeline = (id: string) =>
  apiFetch<MemoryEvent[]>(`/api/employees/${id}/timeline`);
export const createMemory = (data: Partial<MemoryEvent>) =>
  apiFetch("/api/memory", { method: "POST", body: JSON.stringify(data) });

// ── Insights ───────────────────────────────────────────────────
export const getMeetingInsights = (meetingId: string) =>
  apiFetch<Insight[]>(`/api/insights/${meetingId}`);
export const createInsight = (data: Partial<InsightCreate>) =>
  apiFetch("/api/insights", { method: "POST", body: JSON.stringify(data) });

// ── AI helpers (all proxied to FastAPI /api/ai/*) ──────────────
export const aiTranscribe = (): Promise<{ transcript: string }> =>
  apiFetch("/api/ai/transcribe", { method: "POST", body: JSON.stringify({}) });

export const aiAnalyzeMeeting = (
  transcript: string
): Promise<{
  summary: string;
  insights: { key_takeaways: string; action_items: string; risk_flags: string; sentiment_score: number };
  sentiment: string;
}> =>
  apiFetch("/api/ai/analyze-meeting", {
    method: "POST",
    body: JSON.stringify({ transcript }),
  });

export const aiGenerateAlert = (
  summary: string,
  sentiment: string
): Promise<{ alertType: string }> =>
  apiFetch("/api/ai/generate-alert", {
    method: "POST",
    body: JSON.stringify({ summary, sentiment }),
  });

export const aiMeetingPrep = (
  meetingId: string,
  employeeId: string
): Promise<{ prep_notes: string }> =>
  apiFetch("/api/ai/meeting-prep", {
    method: "POST",
    body: JSON.stringify({ meetingId, employeeId }),
  });

export const aiChat = (
  meetingId: string,
  question: string
): Promise<{ answer: string }> =>
  apiFetch("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify({ meetingId, question }),
  });

// ─── Types (matching PostgreSQL / Prisma schema exactly) ───────

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;       // was "role"
  location: string;
  manager_id?: string | null;
  tenure_years: number;
  performance_score: number;
  engagement_score: number;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeWithRelations extends Employee {
  meetings?: Meeting[];
  alerts?: Alert[];
  notes?: Note[];
  institutional_memory?: MemoryEvent[];
}

export interface Meeting {
  id: string;
  employee_id: string;
  hr_id?: string;
  employee?: Employee;
  meeting_date: string;
  audio_url?: string | null;
  transcript?: string | null;
  summary?: string | null;
  sentiment?: string | null;
  next_followup_date?: string | null;
  insights?: Insight[];
  created_at?: string;
  updated_at?: string;
}

/** Shape sent to POST /api/meetings */
export interface MeetingCreate {
  employee_id: string;
  hr_id: string;
  meeting_date: string;
  audio_url?: string;
  transcript?: string;
  summary?: string;
  sentiment?: string;
  next_followup_date?: string;
}

export interface MeetingWithInsights extends Meeting {
  insights: Insight[];
}

export interface Alert {
  id: string;
  employee_id: string;
  employee?: Employee;
  alert_type: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical" | "warning" | "info";
  created_at: string;
  updated_at?: string;
}

/** Shape sent to POST /api/alerts */
export interface AlertCreate {
  employee_id: string;
  alert_type: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical" | "warning" | "info";
}

export interface Note {
  id: string;
  employee_id: string;
  note: string;           // was "content"
  created_by: string;
  created_at: string;
  updated_at?: string;
}

/** Shape sent to POST /api/notes */
export interface NoteCreate {
  employee_id: string;
  note: string;
  created_by: string;
}

export interface MemoryEvent {
  id: string;
  employee_id: string;
  event_type: string;
  title: string;
  description?: string | null;
  source?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Insight {
  id: string;
  meeting_id: string;
  key_takeaways?: string | null;   // was "content"
  action_items?: string | null;
  risk_flags?: string | null;
  sentiment_score: number;
  created_at: string;
  updated_at?: string;
}

/** Shape sent to POST /api/insights */
export interface InsightCreate {
  meeting_id: string;
  key_takeaways?: string;
  action_items?: string;
  risk_flags?: string;
  sentiment_score?: number;
}

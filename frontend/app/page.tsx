"use client";

import { useEffect, useState } from "react";
import { getDashboard, getEmployees, aiMeetingPrep } from "../lib/api";
import type { Meeting, Alert, Employee } from "../lib/api";

// ── Skeleton ───────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[oklch(0.92_0_0)] rounded-lg ${className}`} />;
}

// ── Meeting card ───────────────────────────────────────────────
function UpcomingMeetingCard({ meeting, onPrepare }: { meeting: Meeting; onPrepare: (m: Meeting) => void }) {
  const date = meeting.meeting_date
    ? new Date(meeting.meeting_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";
  const time = meeting.meeting_date
    ? new Date(meeting.meeting_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div className="bg-white border border-[oklch(0.88_0_0)] rounded-xl p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[13px] font-semibold text-[oklch(0.18_0_0)]">
            {meeting.employee?.name ?? "Employee"}
          </p>
          <p className="text-[11px] text-[oklch(0.52_0_0)] mt-0.5">
            {meeting.employee?.department}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[12px] text-[oklch(0.52_0_0)]">
        <span>{date}</span>
        <span>{time}</span>
      </div>

      <button
        onClick={() => onPrepare(meeting)}
        className="w-full h-8 bg-[oklch(0.12_0_0)] text-white text-[12px] font-medium rounded-lg hover:bg-[oklch(0.22_0_0)] transition-colors"
      >
        Prepare with AI
      </button>
    </div>
  );
}

// ── Alerts panel ───────────────────────────────────────────────
function AlertRow({ alert }: { alert: Alert }) {
  const severity = alert.severity;
  const color =
    severity === "critical" ? "text-red-600 bg-red-50 border-red-100" :
    severity === "warning"  ? "text-amber-600 bg-amber-50 border-amber-100" :
                              "text-[oklch(0.62_0.16_250)] bg-[oklch(0.62_0.16_250)]/8 border-[oklch(0.62_0.16_250)]/15";
  const dot =
    severity === "critical" ? "bg-red-500" :
    severity === "warning"  ? "bg-amber-400" : "bg-[oklch(0.62_0.16_250)]";

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border text-[12px] ${color}`}>
      <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <div className="min-w-0">
        <p className="font-semibold truncate">{alert.employee?.name ?? "—"}</p>
        <p className="opacity-80 mt-0.5">{alert.alert_type}</p>
      </div>
      <span className="ml-auto shrink-0 text-[10px] opacity-60">
        {new Date(alert.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </span>
    </div>
  );
}

// ── Sentiment heatmap ──────────────────────────────────────────
function SentimentHeatmap({ employees }: { employees: Employee[] }) {
  const byDept: Record<string, { eng: number[]; perf: number[] }> = {};
  for (const e of employees) {
    if (!byDept[e.department]) byDept[e.department] = { eng: [], perf: [] };
    if (e.engagement_score) byDept[e.department].eng.push(e.engagement_score);
    if (e.performance_score) byDept[e.department].perf.push(e.performance_score);
  }

  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

  const cellColor = (score: number) =>
    score >= 80 ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
    score >= 60 ? "bg-amber-50 text-amber-800 border-amber-200" :
                  "bg-red-50 text-red-800 border-red-200";

  const depts = Object.keys(byDept);

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.52_0_0)] mb-3">
        Sentiment Heatmap
      </p>
      <div className="space-y-3">
        {depts.map((d) => {
          const e = avg(byDept[d].eng);
          const p = avg(byDept[d].perf);
          return (
            <div key={d} className="flex items-center gap-3">
              <span className="text-[11px] text-[oklch(0.45_0_0)] w-24 shrink-0 truncate">{d}</span>
              <div className={`flex-1 h-7 rounded-md border flex items-center justify-center text-[11px] font-semibold ${cellColor(e)}`}>
                Eng {e}
              </div>
              <div className={`flex-1 h-7 rounded-md border flex items-center justify-center text-[11px] font-semibold ${cellColor(p)}`}>
                Perf {p}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Prep Modal ─────────────────────────────────────────────────
function PrepModal({ meeting, onClose }: { meeting: Meeting; onClose: () => void }) {
  const [notes, setNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiMeetingPrep(meeting.id, meeting.employee_id)
      .then((d) => setNotes(d.prep_notes))
      .catch(() => setNotes("Could not generate prep notes."))
      .finally(() => setLoading(false));
  }, [meeting]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[13px] font-semibold text-[oklch(0.18_0_0)]">AI Prep Brief</p>
            <p className="text-[11px] text-[oklch(0.52_0_0)] mt-0.5">{meeting.employee?.name}</p>
          </div>
          <button onClick={onClose} className="text-[oklch(0.52_0_0)] hover:text-[oklch(0.18_0_0)] text-[18px] leading-none">×</button>
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : (
          <p className="text-[13px] text-[oklch(0.30_0_0)] leading-relaxed bg-[oklch(0.97_0_0)] p-4 rounded-xl border border-[oklch(0.90_0_0)]">
            {notes}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────
export default function DashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [prepMeeting, setPrepMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    Promise.all([getDashboard(), getEmployees()])
      .then(([dash, emps]) => {
        setMeetings(dash.upcoming_checkins ?? []);
        setAlerts(dash.latest_alerts ?? []);
        setEmployees(emps ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Stats row */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[80px]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Employees", value: employees.length },
            { label: "Upcoming Meetings", value: meetings.length },
            { label: "Active Alerts", value: alerts.length },
            { label: "Critical Alerts", value: alerts.filter((a) => a.severity === "critical").length },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[oklch(0.88_0_0)] rounded-xl p-5">
              <p className="text-[11px] font-medium uppercase tracking-widest text-[oklch(0.52_0_0)]">{s.label}</p>
              <p className="text-[28px] font-bold text-[oklch(0.12_0_0)] mt-1 tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Meetings */}
        <div className="xl:col-span-2 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.52_0_0)]">
            Upcoming Check-ins
          </p>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => <Skeleton key={i} className="h-[140px]" />)}
            </div>
          ) : meetings.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[12px] text-[oklch(0.52_0_0)] border border-dashed border-[oklch(0.88_0_0)] rounded-xl">
              No upcoming meetings
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meetings.map((m) => (
                <UpcomingMeetingCard key={m.id} meeting={m} onPrepare={setPrepMeeting} />
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Alerts */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.52_0_0)] mb-3">
              Early Warnings
            </p>
            {loading ? (
              <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14" />)}</div>
            ) : alerts.length === 0 ? (
              <p className="text-[12px] text-[oklch(0.52_0_0)]">No active alerts.</p>
            ) : (
              <div className="space-y-2">{alerts.map((a) => <AlertRow key={a.id} alert={a} />)}</div>
            )}
          </div>

          {/* Heatmap */}
          {!loading && employees.length > 0 && <SentimentHeatmap employees={employees} />}
        </div>
      </div>

      {prepMeeting && <PrepModal meeting={prepMeeting} onClose={() => setPrepMeeting(null)} />}
    </div>
  );
}
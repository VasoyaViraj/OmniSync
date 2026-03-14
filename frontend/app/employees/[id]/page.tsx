"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEmployee, getEmployeeNotes, getEmployeeTimeline, createNote, createMemory } from "../../../lib/api";
import type { EmployeeWithRelations, Note, MemoryEvent, Meeting } from "../../../lib/api";
import Link from "next/link";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-[oklch(0.92_0_0)] rounded-lg ${className}`} />;
}

const scoreColor = (s: number) =>
  s >= 80 ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
  s >= 60 ? "text-amber-700 bg-amber-50 border-amber-200" :
             "text-red-700 bg-red-50 border-red-200";

// Note form
function AddNoteForm({ employeeId, onAdded }: { employeeId: string; onAdded: () => void }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await createNote({ employee_id: employeeId, note: content, created_by: "HR User" }).catch(console.error);
        setContent("");
        onAdded();
        setSubmitting(false);
      }}
      className="flex gap-2"
    >
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a note..."
        required
        className="flex-1 h-9 px-3 text-[12px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.16_250)]/40 focus:border-[oklch(0.62_0.16_250)]"
      />
      <button
        type="submit"
        disabled={submitting}
        className="h-9 px-4 text-[12px] font-medium bg-[oklch(0.12_0_0)] text-white rounded-lg hover:bg-[oklch(0.22_0_0)] disabled:opacity-50"
      >
        Add Note
      </button>
    </form>
  );
}

// Memory form
function AddMemoryForm({ employeeId, onAdded }: { employeeId: string; onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await createMemory({ employee_id: employeeId, event_type: "manual", title, description: desc, source: "hr-manual" }).catch(console.error);
        setTitle(""); setDesc("");
        onAdded();
        setSubmitting(false);
      }}
      className="space-y-2"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="w-full h-9 px-3 text-[12px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.16_250)]/40"
      />
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Description..."
        rows={2}
        className="w-full px-3 py-2 text-[12px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.16_250)]/40 resize-none"
      />
      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="h-9 px-4 text-[12px] font-medium bg-[oklch(0.12_0_0)] text-white rounded-lg hover:bg-[oklch(0.22_0_0)] disabled:opacity-50"
      >
        Save Record
      </button>
    </form>
  );
}

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeWithRelations | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [timeline, setTimeline] = useState<MemoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"notes" | "memory" | "meetings">("notes");

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      getEmployee(id),
      getEmployeeNotes(id),
      getEmployeeTimeline(id),
    ])
      .then(([emp, n, t]) => {
        setEmployee(emp);
        setNotes(n ?? []);
        setTimeline(t ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, [id]);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-8 text-center text-[13px] text-[oklch(0.52_0_0)]">
        Employee not found.
      </div>
    );
  }

  const meetings = employee.meetings ?? [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="bg-white border border-[oklch(0.88_0_0)] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[oklch(0.90_0_0)] flex items-center justify-center text-[18px] font-semibold text-[oklch(0.40_0_0)] shrink-0">
            {employee.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-[18px] font-semibold text-[oklch(0.12_0_0)]">{employee.name}</h1>
            <p className="text-[12px] text-[oklch(0.52_0_0)] mt-0.5">{employee.designation} · {employee.department}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className={`px-4 py-2 rounded-lg border text-center text-[11px] font-semibold ${scoreColor(employee.engagement_score)}`}>
            <div className="text-[18px] font-bold">{employee.engagement_score ?? "—"}</div>
            Engagement
          </div>
          <div className={`px-4 py-2 rounded-lg border text-center text-[11px] font-semibold ${scoreColor(employee.performance_score)}`}>
            <div className="text-[18px] font-bold">{employee.performance_score ?? "—"}</div>
            Performance
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[oklch(0.93_0_0)] p-1 rounded-xl w-fit">
        {(["notes", "memory", "meetings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-[12px] font-medium capitalize transition-colors ${
              tab === t
                ? "bg-white text-[oklch(0.12_0_0)] shadow-sm"
                : "text-[oklch(0.52_0_0)] hover:text-[oklch(0.18_0_0)]"
            }`}
          >
            {t === "memory" ? "Inst. Memory" : t}
          </button>
        ))}
      </div>

      {/* Notes tab */}
      {tab === "notes" && (
        <div className="space-y-4">
          <AddNoteForm employeeId={id} onAdded={fetchAll} />
          <div className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-[12px] text-[oklch(0.52_0_0)]">No notes yet.</p>
            ) : notes.map((n) => (
              <div key={n.id} className="bg-white border border-[oklch(0.90_0_0)] rounded-xl p-4">
                <p className="text-[12px] text-[oklch(0.35_0_0)] leading-relaxed">{n.note}</p>
                <p className="text-[10px] text-[oklch(0.62_0_0)] mt-2">
                  {new Date(n.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Institutional memory tab */}
      {tab === "memory" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.52_0_0)]">Add Record</p>
            <AddMemoryForm employeeId={id} onAdded={fetchAll} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.52_0_0)] mb-3">Timeline</p>
            {timeline.length === 0 ? (
              <p className="text-[12px] text-[oklch(0.52_0_0)]">No records yet.</p>
            ) : (
              <div className="space-y-2">
                {timeline.map((ev) => (
                  <div key={ev.id} className="bg-white border border-[oklch(0.90_0_0)] rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <p className="text-[12px] font-semibold text-[oklch(0.18_0_0)]">{ev.title}</p>
                      <span className="text-[10px] text-[oklch(0.52_0_0)] ml-2 shrink-0">
                        {new Date(ev.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-[11px] text-[oklch(0.45_0_0)] mt-1">{ev.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Meetings tab */}
      {tab === "meetings" && (
        <div className="bg-white border border-[oklch(0.88_0_0)] rounded-xl overflow-hidden">
          {meetings.length === 0 ? (
            <p className="p-6 text-center text-[12px] text-[oklch(0.52_0_0)]">No meetings.</p>
          ) : (
            <div className="divide-y divide-[oklch(0.93_0_0)]">
              {meetings.map((m) => (
                <Link
                  key={m.id}
                  href={`/meetings/${m.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[oklch(0.97_0_0)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-[12px]">
                      <span className="font-medium text-[oklch(0.18_0_0)]">
                        {new Date(m.meeting_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

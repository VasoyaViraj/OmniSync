"use client";

import { use, useEffect, useState } from "react";
import { getMeeting, aiChat } from "../../../lib/api";
import type { MeetingWithInsights } from "../../../lib/api";
import Link from "next/link";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-[oklch(0.92_0_0)] rounded-lg ${className}`} />;
}

function SentimentBadge({ value }: { value?: string }) {
  if (!value) return null;
  const cfg: Record<string, string> = {
    positive: "bg-emerald-50 text-emerald-700 border-emerald-200",
    neutral:  "bg-[oklch(0.93_0_0)] text-[oklch(0.45_0_0)] border-[oklch(0.88_0_0)]",
    negative: "bg-red-50 text-red-700 border-red-200",
  };
  const key = value.toLowerCase();
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize ${cfg[key] ?? cfg.neutral}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${key === "positive" ? "bg-emerald-400" : key === "negative" ? "bg-red-400" : "bg-[oklch(0.60_0_0)]"}`} />
      {value}
    </span>
  );
}

// Bubble transcript renderer
function Transcript({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim());
  return (
    <div className="space-y-4 p-4 max-h-[400px] overflow-y-auto">
      {lines.map((line, i) => {
        const colonIdx = line.indexOf(":");
        if (colonIdx > -1) {
          const speaker = line.slice(0, colonIdx).trim();
          const content = line.slice(colonIdx + 1).trim();
          const isHR = speaker.toLowerCase().includes("hr");
          return (
            <div key={i} className={`flex flex-col ${isHR ? "items-end" : "items-start"}`}>
              <p className="text-[10px] font-semibold text-[oklch(0.60_0_0)] mb-1 px-1">{speaker}</p>
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[12px] leading-relaxed ${
                isHR
                  ? "bg-[oklch(0.18_0_0)] text-white rounded-tr-sm"
                  : "bg-[oklch(0.95_0_0)] text-[oklch(0.20_0_0)] rounded-tl-sm"
              }`}>
                {content}
              </div>
            </div>
          );
        }
        return <p key={i} className="text-[12px] text-[oklch(0.45_0_0)]">{line}</p>;
      })}
    </div>
  );
}

// RAG chat component
function AskChat({ meetingId }: { meetingId: string }) {
  const [msgs, setMsgs] = useState([{ role: "ai", text: "Ask me anything about this meeting." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input.trim();
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    try {
      const d = await aiChat(meetingId, q);
      setMsgs((m) => [...m, { role: "ai", text: d.answer }]);
    } catch {
      setMsgs((m) => [...m, { role: "ai", text: "Could not process your question." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[360px] bg-white border border-[oklch(0.88_0_0)] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[oklch(0.92_0_0)] bg-[oklch(0.97_0_0)]">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.45_0_0)]">Ask OmniSync</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <p className={`max-w-[85%] text-[12px] px-3 py-2 rounded-xl leading-relaxed ${
              m.role === "user"
                ? "bg-[oklch(0.18_0_0)] text-white"
                : "bg-[oklch(0.95_0_0)] text-[oklch(0.20_0_0)]"
            }`}>
              {m.text}
            </p>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[oklch(0.95_0_0)] px-3 py-2 rounded-xl flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[oklch(0.60_0_0)] animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <form onSubmit={send} className="p-3 border-t border-[oklch(0.92_0_0)] flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this meeting..."
          className="flex-1 h-9 px-3 text-[12px] border border-[oklch(0.88_0_0)] rounded-lg bg-[oklch(0.97_0_0)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.16_250)]/40 focus:border-[oklch(0.62_0.16_250)]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="h-9 px-3 bg-[oklch(0.18_0_0)] text-white rounded-lg text-[12px] hover:bg-[oklch(0.28_0_0)] disabled:opacity-40 transition-colors"
        >
          ↑
        </button>
      </form>
    </div>
  );
}

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [meeting, setMeeting] = useState<MeetingWithInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMeeting(id)
      .then(setMeeting)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 space-y-4"><Skeleton className="h-28" /><Skeleton className="h-96" /></div>;
  }

  if (!meeting) {
    return <div className="p-8 text-center text-[13px] text-[oklch(0.52_0_0)]">Meeting not found.</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-[oklch(0.88_0_0)] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href={`/employees/${meeting.employee_id}`} className="text-[11px] text-[oklch(0.62_0.16_250)] hover:underline">
            ← Back to Employee
          </Link>
          <h1 className="text-[16px] font-semibold text-[oklch(0.12_0_0)] mt-1">
            {meeting.employee?.name ?? "Meeting"}
          </h1>
          <p className="text-[12px] text-[oklch(0.52_0_0)] mt-0.5">
            {new Date(meeting.meeting_date).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <SentimentBadge value={meeting.sentiment ?? undefined} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Transcript */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-[oklch(0.88_0_0)] rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[oklch(0.92_0_0)] bg-[oklch(0.97_0_0)]">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.45_0_0)]">Transcript</p>
            </div>
            {meeting.transcript ? (
              <Transcript text={meeting.transcript} />
            ) : (
              <div className="flex items-center justify-center h-48 text-[12px] text-[oklch(0.52_0_0)]">
                No transcript available
              </div>
            )}
          </div>
        </div>

        {/* Side column */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Analysis */}
          <div className="bg-white border border-[oklch(0.88_0_0)] rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[oklch(0.92_0_0)] bg-[oklch(0.97_0_0)]">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.45_0_0)]">AI Analysis</p>
            </div>
            <div className="p-5 space-y-5">
              {meeting.summary && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.60_0_0)] mb-1.5">Summary</p>
                  <p className="text-[12px] text-[oklch(0.30_0_0)] leading-relaxed">{meeting.summary}</p>
                </div>
              )}
              {meeting.insights && meeting.insights.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.60_0_0)] mb-2">Key Insights</p>
                  <ul className="space-y-2">
                    {meeting.insights.map((ins, i) => (
                      <li key={ins.id ?? i} className="flex items-start gap-2 text-[12px] text-[oklch(0.30_0_0)]">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[oklch(0.62_0.16_250)] shrink-0" />
                        {ins.key_takeaways ?? ins.action_items ?? "—"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!meeting.summary && (!meeting.insights || meeting.insights.length === 0) && (
                <p className="text-[12px] text-[oklch(0.52_0_0)]">No AI analysis available yet.</p>
              )}
            </div>
          </div>

          {/* Chat */}
          <AskChat meetingId={meeting.id} />
        </div>
      </div>
    </div>
  );
}

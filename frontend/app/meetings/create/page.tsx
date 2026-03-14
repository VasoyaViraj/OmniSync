"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getEmployees,
  createMeeting,
  createInsight,
  createAlert,
  aiTranscribe,
  aiAnalyzeMeeting,
  aiGenerateAlert,
} from "../../../lib/api";
import type { Employee, Meeting } from "../../../lib/api";
import { useEffect } from "react";

type Step = "select" | "input" | "analyze" | "review" | "alerts" | "done";

function ProgressBar({ step }: { step: Step }) {
  const steps: Step[] = ["select", "input", "analyze", "review", "alerts", "done"];
  const current = steps.indexOf(step);
  const pct = Math.round((current / (steps.length - 1)) * 100);

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.slice(0, -1).map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={s} className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border ${
                done ? "bg-[oklch(0.12_0_0)] text-white border-[oklch(0.12_0_0)]" :
                active ? "bg-white text-[oklch(0.18_0_0)] border-[oklch(0.62_0.16_250)] ring-2 ring-[oklch(0.62_0.16_250)]/30" :
                "bg-white text-[oklch(0.60_0_0)] border-[oklch(0.88_0_0)]"
              }`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-[10px] uppercase tracking-wide font-medium hidden sm:block ${active ? "text-[oklch(0.18_0_0)]" : "text-[oklch(0.60_0_0)]"}`}>
                {s}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative h-0.5 bg-[oklch(0.90_0_0)] rounded-full">
        <div
          className="absolute top-0 left-0 h-0.5 bg-[oklch(0.12_0_0)] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="bg-white border border-[oklch(0.88_0_0)] rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[oklch(0.92_0_0)] bg-[oklch(0.97_0_0)]">
        <p className="text-[13px] font-semibold text-[oklch(0.18_0_0)]">{title}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Btn({ children, onClick, disabled, variant = "dark", type = "button" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
  variant?: "dark" | "ghost"; type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-9 px-5 text-[13px] font-medium rounded-lg transition-colors disabled:opacity-40 ${
        variant === "dark"
          ? "bg-[oklch(0.12_0_0)] text-white hover:bg-[oklch(0.22_0_0)]"
          : "text-[oklch(0.45_0_0)] hover:bg-[oklch(0.93_0_0)]"
      }`}
    >
      {children}
    </button>
  );
}

export default function CreateMeetingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("select");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [employeeId, setEmployeeId] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [nextFollowupDate, setNextFollowupDate] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "upload">("text");
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // AI state
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [insights, setInsights] = useState<{ key_takeaways: string; action_items: string; risk_flags: string; sentiment_score: number } | null>(null);
  const [sentiment, setSentiment] = useState("Neutral");
  const [alertType, setAlertType] = useState("");

  // Saved IDs
  const [meetingId, setMeetingId] = useState<string | null>(null);

  const selectedEmployee = employees.find((e) => e.id === employeeId);

  useEffect(() => {
    getEmployees().then(setEmployees).catch(console.error);
  }, []);

  // Step 2 → process transcript
  const handleInput = async () => {
    setLoading(true);
    if (inputMode === "upload" && file) {
      const d = await aiTranscribe();
      setTranscript(d.transcript);
    } else {
      setTranscript(rawText);
    }
    setLoading(false);
    setStep("analyze");
  };

  // Step 3 → analyze
  const handleAnalyze = async () => {
    setLoading(true);
    const d = await aiAnalyzeMeeting(transcript);
    setSummary(d.summary);
    setInsights(d.insights ?? null);
    setSentiment(d.sentiment);
    setLoading(false);
    setStep("review");
  };

  // Step 4 → accept & insert meeting
  const handleAcceptMeeting = async () => {
    setLoading(true);
    const newMeeting = await createMeeting({
      employee_id: employeeId,
      hr_id: "hr-001",
      meeting_date: meetingDate ? new Date(meetingDate).toISOString() : new Date().toISOString(),
      next_followup_date: nextFollowupDate ? new Date(nextFollowupDate).toISOString() : undefined,
      transcript,
      summary,
      sentiment,
    }) as Meeting | null;
    const mId = (newMeeting as Meeting | null)?.id ?? null;
    setMeetingId(mId);

    // Insert insight via POST /api/insights
    if (mId && insights) {
      await createInsight({
        meeting_id: mId,
        key_takeaways: insights.key_takeaways,
        action_items: insights.action_items,
        risk_flags: insights.risk_flags,
        sentiment_score: insights.sentiment_score
      }).catch(console.error);
    }

    // Generate alert signal via FastAPI
    const alertD = await aiGenerateAlert(summary, sentiment);
    setAlertType(alertD.alertType);

    setLoading(false);
    setStep("alerts");
  };

  // Step 5 → insert alert
  const handleAcceptAlert = async () => {
    setLoading(true);
    if (alertType.trim()) {
      await createAlert({
        employee_id: employeeId,
        alert_type: alertType,
        description: `Auto-generated alert: ${alertType}`,
        severity: sentiment === "Negative" ? "critical" : "warning",
      }).catch(console.error);
    }
    setLoading(false);
    setStep("done");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-[18px] font-semibold text-[oklch(0.12_0_0)]">New Meeting Record</h2>
        <p className="text-[12px] text-[oklch(0.52_0_0)] mt-0.5">Log a meeting and extract intelligence with OmniSync AI</p>
      </div>

      <ProgressBar step={step} />

      {step === "select" && (
        <Card title="Select Employee & Meeting Details">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[oklch(0.45_0_0)] uppercase tracking-wider mb-1.5">Employee</label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full h-9 px-3 text-[13px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.16_250)]/40 focus:border-[oklch(0.62_0.16_250)]"
              >
                <option value="">Select employee…</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name} — {e.department}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[oklch(0.45_0_0)] uppercase tracking-wider mb-1.5">Date</label>
                <input
                  type="datetime-local"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[oklch(0.45_0_0)] uppercase tracking-wider mb-1.5">Next Follow-up (Optional)</label>
                <input
                  type="date"
                  value={nextFollowupDate}
                  onChange={(e) => setNextFollowupDate(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Btn disabled={!employeeId} onClick={() => setStep("input")}>Continue →</Btn>
            </div>
          </div>
        </Card>
      )}

      {step === "input" && (
        <Card title={`Meeting Content — ${selectedEmployee?.name}`}>
          <div className="space-y-4">
            <div className="flex gap-2">
              {(["text", "upload"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setInputMode(m)}
                  className={`h-8 px-4 text-[12px] font-medium rounded-lg border transition-colors ${
                    inputMode === m
                      ? "bg-[oklch(0.12_0_0)] text-white border-[oklch(0.12_0_0)]"
                      : "bg-white text-[oklch(0.45_0_0)] border-[oklch(0.88_0_0)] hover:bg-[oklch(0.95_0_0)]"
                  }`}
                >
                  {m === "text" ? "📝 Paste Transcript" : "🎵 Upload Audio"}
                </button>
              ))}
            </div>

            {inputMode === "text" ? (
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the meeting transcript here…"
                rows={8}
                className="w-full px-3 py-2 text-[13px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.16_250)]/40 resize-none"
              />
            ) : (
              <div
                onClick={() => document.getElementById("audio-upload")?.click()}
                className="border-2 border-dashed border-[oklch(0.88_0_0)] rounded-xl p-10 flex flex-col items-center cursor-pointer hover:bg-[oklch(0.97_0_0)] transition-colors"
              >
                <span className="text-3xl mb-2">🎵</span>
                <p className="text-[13px] font-medium text-[oklch(0.35_0_0)]">Click to upload .mp3 or .wav</p>
                {file && <p className="text-[12px] text-[oklch(0.62_0.16_250)] mt-2 font-medium">{file.name}</p>}
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Btn variant="ghost" onClick={() => setStep("select")}>← Back</Btn>
              <Btn
                disabled={loading || (inputMode === "text" && !rawText.trim()) || (inputMode === "upload" && !file)}
                onClick={handleInput}
              >
                {loading ? "Processing…" : inputMode === "upload" ? "Transcribe Audio →" : "Process Text →"}
              </Btn>
            </div>
          </div>
        </Card>
      )}

      {step === "analyze" && (
        <Card title="Transcript Ready">
          <div className="space-y-5">
            <div className="bg-[oklch(0.97_0_0)] border border-[oklch(0.90_0_0)] rounded-xl p-4 max-h-60 overflow-y-auto">
              <pre className="text-[12px] text-[oklch(0.30_0_0)] whitespace-pre-wrap font-mono">{transcript}</pre>
            </div>
            <div className="bg-[oklch(0.62_0.16_250)]/8 border border-[oklch(0.62_0.16_250)]/20 rounded-xl p-4 text-[12px] text-[oklch(0.35_0_0)]">
              OmniSync will now extract summary, key insights, and sentiment from this transcript.
            </div>
            <div className="flex justify-between pt-2">
              <Btn variant="ghost" onClick={() => setStep("input")}>← Back</Btn>
              <Btn disabled={loading} onClick={handleAnalyze}>
                {loading ? "Analyzing…" : "Run AI Analysis →"}
              </Btn>
            </div>
          </div>
        </Card>
      )}

      {step === "review" && (
        <Card title="Review AI Results">
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-[oklch(0.45_0_0)] uppercase tracking-wider mb-1.5">
                Sentiment — <span className={`${sentiment === "Positive" ? "text-emerald-600" : sentiment === "Negative" ? "text-red-600" : "text-[oklch(0.45_0_0)]"}`}>{sentiment}</span>
              </label>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[oklch(0.45_0_0)] uppercase tracking-wider mb-1.5">Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-[13px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.16_250)]/40 resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[oklch(0.45_0_0)] uppercase tracking-wider mb-1.5">Insights</label>
              <div className="space-y-3">
                {insights && (
                  <>
                    <div>
                      <p className="text-[10px] text-[oklch(0.52_0_0)] mb-1">Key Takeaways</p>
                      <textarea
                        value={insights.key_takeaways}
                        onChange={(e) => setInsights({ ...insights, key_takeaways: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 text-[12px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-[oklch(0.52_0_0)] mb-1">Action Items</p>
                      <textarea
                        value={insights.action_items}
                        onChange={(e) => setInsights({ ...insights, action_items: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 text-[12px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-[oklch(0.52_0_0)] mb-1">Risk Flags</p>
                      <textarea
                        value={insights.risk_flags}
                        onChange={(e) => setInsights({ ...insights, risk_flags: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 text-[12px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none resize-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <Btn variant="ghost" onClick={() => setStep("analyze")}>← Back</Btn>
              <Btn disabled={loading} onClick={handleAcceptMeeting}>
                {loading ? "Saving…" : "Save Meeting & Check Alerts →"}
              </Btn>
            </div>
          </div>
        </Card>
      )}

      {step === "alerts" && (
        <Card title="Early Warning Signal">
          <div className="space-y-5">
            <p className="text-[12px] text-[oklch(0.45_0_0)]">
              OmniSync detected a potential early signal. Review and confirm to log it as an alert.
            </p>
            <div>
              <label className="block text-[11px] font-semibold text-[oklch(0.45_0_0)] uppercase tracking-wider mb-1.5">Alert</label>
              <input
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="w-full h-9 px-3 text-[13px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.16_250)]/40"
              />
            </div>
            <div className="flex justify-between pt-2">
              <Btn variant="ghost" onClick={() => setStep("done")}>Skip Alert</Btn>
              <Btn disabled={loading || !alertType.trim()} onClick={handleAcceptAlert}>
                {loading ? "Logging…" : "Confirm & Log Alert →"}
              </Btn>
            </div>
          </div>
        </Card>
      )}

      {step === "done" && (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-2xl mx-auto mb-4">
            ✓
          </div>
          <h3 className="text-[18px] font-semibold text-[oklch(0.12_0_0)]">Meeting Logged</h3>
          <p className="text-[12px] text-[oklch(0.52_0_0)] mt-2 max-w-xs mx-auto">
            Transcript, AI insights, and alert signals have been stored for {selectedEmployee?.name}.
          </p>
          <div className="flex justify-center gap-3 mt-8">
            {selectedEmployee && (
              <Btn variant="ghost" onClick={() => router.push(`/employees/${selectedEmployee.id}`)}>
                View Employee
              </Btn>
            )}
            <Btn onClick={() => router.push("/")}>Return to Dashboard</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

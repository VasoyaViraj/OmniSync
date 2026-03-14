"use client";

import { useEffect, useState } from "react";
import { getMeetings, type Meeting } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[oklch(0.92_0_0)] ${className}`} />;
}

export default function DashboardInsightsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMeetings()
      .then((m) => setMeetings(m ?? []))
      .finally(() => setLoading(false));
  }, []);

  const withInsights = meetings.filter((m) => m.summary || (m.insights && m.insights.length > 0));

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.52_0_0)]">
          AI Layer
        </p>
        <h1 className="mt-1 text-[18px] font-semibold text-[oklch(0.12_0_0)]">
          Meeting Insights
        </h1>
        <p className="mt-1 text-[12px] text-[oklch(0.52_0_0)]">
          This is the \"brain\" of OmniSync – summaries, key takeaways, action items and risk flags.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-semibold">AI Generated Insights</CardTitle>
            <CardDescription className="text-xs">
              One card per meeting with AI content to show to judges.
            </CardDescription>
          </div>
          <span className="rounded-full bg-[oklch(0.93_0_0)] px-3 py-1 text-[11px] font-medium text-[oklch(0.45_0_0)]">
            {withInsights.length} analyzed
          </span>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          ) : withInsights.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-[oklch(0.52_0_0)]">
              No meetings with AI insights yet. Run through the meeting creation flow to populate this.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {withInsights.slice(0, 6).map((m) => {
                const sentiment = (m.sentiment ?? "").toLowerCase();
                const sentimentCfg =
                  sentiment === "positive"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : sentiment === "negative"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-[oklch(0.93_0_0)] text-[oklch(0.45_0_0)] border-[oklch(0.88_0_0)]";
                return (
                  <div
                    key={m.id}
                    className="flex flex-col rounded-xl border border-[oklch(0.88_0_0)] bg-white p-4 text-[12px] shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-semibold text-[oklch(0.18_0_0)]">
                          {m.employee?.name ?? "Employee"}
                        </p>
                        <p className="text-[11px] text-[oklch(0.52_0_0)]">
                          {new Date(m.meeting_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      {m.sentiment && (
                        <Badge
                          variant="outline"
                          className={`${sentimentCfg} border text-[10px] font-semibold`}
                        >
                          {m.sentiment}
                        </Badge>
                      )}
                    </div>
                    {m.summary && (
                      <div className="mb-2 rounded-lg bg-[oklch(0.97_0_0)] p-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[oklch(0.52_0_0)]">
                          Summary
                        </p>
                        <p className="mt-1 text-[oklch(0.30_0_0)]">{m.summary}</p>
                      </div>
                    )}
                    {m.insights && m.insights.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[oklch(0.52_0_0)]">
                          Key Takeaways
                        </p>
                        <ul className="list-disc space-y-0.5 pl-4 text-[oklch(0.30_0_0)]">
                          {m.insights.slice(0, 3).map((i) => (
                            <li key={i.id}>
                              {i.key_takeaways ?? i.action_items ?? "AI insight"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


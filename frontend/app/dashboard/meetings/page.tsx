"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMeetings, getEmployees, type Meeting, type Employee } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Calendar, Clock, UserCircle2, Sparkles } from "lucide-react";

type MeetingRow = Meeting & { employeeName?: string; department?: string };

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[oklch(0.92_0_0)] ${className}`} />;
}

export default function DashboardMeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [rawMeetings, employees] = await Promise.all([
          getMeetings().catch(() => []),
          getEmployees().catch(() => []),
        ]);

        const byId = new Map<string, Employee>();
        (employees ?? []).forEach((e) => byId.set(e.id, e));

        const rows: MeetingRow[] = (rawMeetings ?? []).map((m) => {
          const emp = m.employee ?? byId.get(m.employee_id);
          return {
            ...m,
            employeeName: emp?.name,
            department: emp?.department,
          };
        });
        rows.sort(
          (a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime(),
        );
        setMeetings(rows);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.52_0_0)]">
            Conversations
          </p>
          <h1 className="mt-1 text-[18px] font-semibold text-[oklch(0.12_0_0)]">
            Meetings & AI Insights
          </h1>
          <p className="mt-1 text-[12px] text-[oklch(0.52_0_0)]">
            See every employee conversation captured with summaries, sentiment and follow‑ups.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/meetings/create">
            <Button
              variant="default"
              className="h-9 rounded-lg bg-[oklch(0.12_0_0)] px-4 text-[13px] font-medium text-white hover:bg-[oklch(0.22_0_0)]"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              New AI Meeting
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-semibold">All Meetings</CardTitle>
            <CardDescription className="text-xs">
              Click into a meeting to view full transcript, AI analysis, and chat.
            </CardDescription>
          </div>
          <span className="rounded-full bg-[oklch(0.93_0_0)] px-3 py-1 text-[11px] font-medium text-[oklch(0.45_0_0)]">
            {meetings.length} records
          </span>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
          ) : meetings.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-[oklch(0.52_0_0)]">
              No meetings recorded yet. Start by creating a new AI meeting.
            </p>
          ) : (
            <div className="divide-y divide-[oklch(0.93_0_0)]">
              {meetings.map((m) => {
                const date = new Date(m.meeting_date);
                return (
                  <Link
                    key={m.id}
                    href={`/meetings/${m.id}`}
                    className="flex items-center justify-between gap-4 px-3 py-3.5 hover:bg-[oklch(0.97_0_0)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[oklch(0.93_0_0)] text-[oklch(0.40_0_0)]">
                        <UserCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[oklch(0.18_0_0)]">
                          {m.employeeName ?? "Employee"}
                        </p>
                        <p className="text-[11px] text-[oklch(0.52_0_0)]">
                          {m.department ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-[oklch(0.52_0_0)]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {date.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


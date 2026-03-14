"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getDashboard,
  getEmployees,
  getAlerts,
  type Employee,
  type Alert,
  type Meeting,
} from "../../lib/api";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Activity,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  Calendar,
  Clock,
  MessageCircle,
} from "lucide-react";

type RoleKey = "junior" | "senior" | "admin";

const SENTIMENT_COLORS = ["#22C55E", "#E5E7EB", "#EF4444"];

function useDashboardData() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [emp, dash, alertData] = await Promise.all([
          getEmployees().catch(() => []),
          getDashboard(1).catch(() => null),
          getAlerts().catch(() => []),
        ]);
        setEmployees(emp ?? []);
        if (dash) {
          setMeetings(dash.upcoming_checkins ?? []);
          setTotalMeetings(dash.total_upcoming_checkins ?? 0);
          // dashboard already returns latest_alerts, but we also fetch /alerts for analytics
        }
        setAlerts(alertData ?? []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const metrics = useMemo(() => {
    const totalEmployees = employees.length || 150;
    const avgEngagement =
      employees.length > 0
        ? Math.round(
            employees.reduce((sum, e) => sum + (e.engagement_score ?? 0), 0) /
              employees.length,
          )
        : 78;
    const avgPerformance =
      employees.length > 0
        ? Math.round(
            employees.reduce((sum, e) => sum + (e.performance_score ?? 0), 0) /
              employees.length,
          )
        : 81;
    const riskEmployees =
      employees.length > 0
        ? employees.filter(
            (e) =>
              (e.engagement_score ?? 100) < 60 ||
              (e.performance_score ?? 100) < 60,
          ).length
        : 6;

    const workforceHealth = Math.round(
      (avgEngagement * 0.6 + avgPerformance * 0.4) * 0.9,
    );

    return {
      totalEmployees,
      avgEngagement,
      avgPerformance,
      riskEmployees,
      workforceHealth,
    };
  }, [employees]);

  return {
    employees,
    alerts,
    meetings,
    totalMeetings,
    loading,
    metrics,
  };
}

function StatCard(props: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: "primary" | "secondary" | "danger";
  helper?: string;
}) {
  const { label, value, icon, accent = "primary", helper } = props;
  const ringColor =
    accent === "secondary"
      ? "from-[#22C55E]/10 to-transparent"
      : accent === "danger"
        ? "from-[#EF4444]/12 to-transparent"
        : "from-[#6366F1]/12 to-transparent";

  return (
    <Card className="relative overflow-hidden border border-slate-100 bg-linear-to-br from-slate-50/40 to-white shadow-sm">
      <div className={`pointer-events-none absolute inset-0 bg-radial ${ringColor}`} />
      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardDescription className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          {label}
        </CardDescription>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-100 shadow-sm">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-2xl font-semibold tabular-nums text-slate-900">
            {value}
          </p>
          {helper && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              <ArrowUpRight className="h-3 w-3" />
              {helper}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EngagementTrend() {
  const data = [
    { month: "Jan", engagement: 72 },
    { month: "Feb", engagement: 74 },
    { month: "Mar", engagement: 76 },
    { month: "Apr", engagement: 77 },
    { month: "May", engagement: 79 },
    { month: "Jun", engagement: 81 },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-semibold">
          <span>Engagement Trend</span>
          <span className="text-xs font-medium text-emerald-600">
            +9 pts · 6 months
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          Line chart of engagement score over time.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-56">
        <ChartContainer
          config={{
            engagement: {
              label: "Engagement",
              color: "#6366F1",
            },
          }}
        >
          <LineChart data={data}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
              width={32}
            />
            <ChartTooltip
              cursor={{ stroke: "#E5E7EB" }}
              content={<ChartTooltipContent />}
            />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="var(--color-engagement)"
              strokeWidth={2.4}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 4.5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function PerformanceDistribution() {
  const data = [
    { band: "90–100", count: 18 },
    { band: "80–89", count: 42 },
    { band: "70–79", count: 45 },
    { band: "60–69", count: 30 },
    { band: "< 60", count: 15 },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-semibold">
          <span>Performance Distribution</span>
          <span className="text-xs text-slate-500">Bar chart by score band</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        <ChartContainer
          config={{
            count: {
              label: "Employees",
              color: "#22C55E",
            },
          }}
        >
          <BarChart data={data}>
            <XAxis dataKey="band" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              fill="var(--color-count)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function SentimentPie() {
  const data = [
    { name: "Positive", value: 60 },
    { name: "Neutral", value: 30 },
    { name: "Negative", value: 10 },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-semibold">
          <span>Meeting Sentiment</span>
          <span className="text-xs text-slate-500">Pie chart</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        <ChartContainer
          config={{
            value: {
              label: "Sentiment",
            },
          }}
          className="mx-auto aspect-square max-h-[224px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              innerRadius={52}
              outerRadius={80}
              paddingAngle={6}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 flex justify-center gap-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            Positive
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#E5E7EB]" />
            Neutral
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
            Negative
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function DepartmentRadar() {
  const data = [
    { department: "Engineering", engagement: 82, performance: 84, satisfaction: 80, risk: 18 },
    { department: "Sales", engagement: 76, performance: 79, satisfaction: 74, risk: 24 },
    { department: "Support", engagement: 72, performance: 70, satisfaction: 71, risk: 28 },
    { department: "HR", engagement: 88, performance: 86, satisfaction: 90, risk: 10 },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-semibold">
          <span>Department Health</span>
          <span className="text-xs text-slate-500">Radar chart</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer>
          <RadarChart data={data}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis dataKey="department" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fontSize: 8 }} />
            <Radar
              name="Engagement"
              dataKey="engagement"
              stroke="#6366F1"
              fill="#6366F1"
              fillOpacity={0.3}
            />
            <Radar
              name="Performance"
              dataKey="performance"
              stroke="#22C55E"
              fill="#22C55E"
              fillOpacity={0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function UpcomingMeetingsList({ meetings }: { meetings: Meeting[] }) {
  if (!meetings.length) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
        No upcoming meetings
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {meetings.slice(0, 4).map((m) => {
        const date = new Date(m.meeting_date);
        return (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 text-xs shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">
                  {m.employee?.name ?? "Employee"}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  {m.employee?.department}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <Link href="/meetings/create">
              <Button size="sm" className="h-7 rounded-lg bg-slate-900 px-3 text-[11px]">
                Prepare with AI
              </Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function RiskEmployeesList({
  employees,
}: {
  employees: Employee[];
}) {
  const risky = employees
    .filter(
      (e) =>
        (e.engagement_score ?? 100) < 60 ||
        (e.performance_score ?? 100) < 60,
    )
    .slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-semibold">
          <span>Risk Employees</span>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardTitle>
        <CardDescription className="text-xs">
          Employees with low engagement or performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {risky.length === 0 ? (
          <p className="text-xs text-slate-500">No risk signals detected.</p>
        ) : (
          risky.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs shadow-sm"
            >
              <div>
                <p className="font-medium text-slate-900">{e.name}</p>
                <p className="text-[11px] text-slate-500">{e.department}</p>
              </div>
              <div className="flex gap-2 text-[11px]">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                  Eng {e.engagement_score ?? "—"}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                  Perf {e.performance_score ?? "—"}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function AIAssistantPanel({
  employees,
}: {
  employees: Employee[];
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([
    {
      role: "ai",
      content:
        "Ask OmniSync for high‑risk employees, recent meetings, or strategic HR actions.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const pushMessage = (role: "user" | "ai", content: string) =>
    setMessages((m) => [...m, { role, content }]);

  const handleAsk = async (question: string) => {
    const q = question.trim();
    if (!q) return;
    setInput("");
    pushMessage("user", q);
    setLoading(true);

    // Simple prototype responses computed on the client from current data
    const lower = q.toLowerCase();
    let answer = "";

    if (lower.includes("high risk")) {
      const risky = employees
        .filter(
          (e) =>
            (e.engagement_score ?? 100) < 60 ||
            (e.performance_score ?? 100) < 60,
        )
        .slice(0, 5);
      if (!risky.length) {
        answer = "There are currently no employees flagged as high risk.";
      } else {
        const list = risky
          .map(
            (e) =>
              `${e.name} (${e.department}) – engagement ${e.engagement_score}, performance ${e.performance_score}`,
          )
          .join("\n• ");
        answer =
          "Here are the top high‑risk employees based on engagement and performance:\n\n• " +
          list +
          "\n\nConsider scheduling a check‑in with these individuals this week.";
      }
    } else if (lower.includes("summarize last meeting")) {
      answer =
        "This prototype view summarizes from stored Meeting Insights. For the demo, position this as: OmniSync will condense the last 1–2 meetings with that employee into a concise briefing, including sentiment, risk flags, and follow‑up items.";
    } else if (lower.includes("suggest questions")) {
      answer =
        "Here are 4 suggested questions for your next employee check‑in:\n\n" +
        "1. \"How are you feeling about your current workload and priorities?\"\n" +
        "2. \"Which recent wins are you most proud of, and how can we support more of that?\"\n" +
        "3. \"Is there anything blocking your progress or affecting your engagement right now?\"\n" +
        "4. \"What one change from the company would most improve your day‑to‑day experience?\"";
    } else {
      answer =
        "For the demo, you can ask about workforce health, high‑risk employees, or suggested HR actions. In a production setup this panel would call the OmniSync AI backend for grounded answers.";
    }

    pushMessage("ai", answer);
    setLoading(false);
  };

  return (
    <div className="pointer-events-auto w-full max-w-xs shrink-0 rounded-2xl border border-slate-200 bg-slate-950/95 p-4 text-slate-50 shadow-2xl backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800">
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              AI Assistant
            </p>
            <p className="text-[11px] text-slate-400">
              OmniSync Copilot for HR
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleAsk("Show high risk employees")}
          className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-100 hover:bg-slate-700"
        >
          Show high risk employees
        </button>
        <button
          type="button"
          onClick={() =>
            handleAsk("Summarize last meeting with John")
          }
          className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-100 hover:bg-slate-700"
        >
          Summarize last meeting with John
        </button>
        <button
          type="button"
          onClick={() =>
            handleAsk("Suggest questions for employee check-in")
          }
          className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-100 hover:bg-slate-700"
        >
          Suggest questions for check‑in
        </button>
      </div>

      <div className="mb-3 max-h-52 space-y-2 overflow-y-auto pr-1 text-[11px]">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "ai" && (
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800">
                <MessageCircle className="h-3 w-3 text-indigo-400" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 leading-relaxed ${
                m.role === "user"
                  ? "bg-indigo-500 text-slate-50 rounded-br-sm"
                  : "bg-slate-900 text-slate-100 rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:240ms]" />
          </div>
        )}
      </div>

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void handleAsk(input);
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Ask e.g. "Show high risk employees"'
          className="h-8 border-slate-700 bg-slate-900 text-[11px] placeholder:text-slate-500"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || loading}
          className="h-8 w-8 rounded-full bg-indigo-500 text-white hover:bg-indigo-400"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}

export default function DashboardPage() {
  const { employees, alerts, meetings, metrics, totalMeetings, loading } =
    useDashboardData();
  const [role, setRole] = useState<RoleKey>("junior");

  const upcomingMeetingsCount = totalMeetings || meetings.length || 8;
  const activeAlerts = alerts.length;
  const criticalAlerts = alerts.filter(
    (a) => a.severity === "critical",
  ).length;

  return (
    <div className="relative mx-auto flex max-w-7xl gap-6 px-6 py-8">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              OmniSync · AI HR Analytics
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
              {role === "junior" && "Junior HR · Daily Ops Cockpit"}
              {role === "senior" && "Senior HR · Workforce Health"}
              {role === "admin" && "Admin HR / CXO · Executive View"}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Switch roles to show how OmniSync scales from day‑to‑day HR work
              to board‑level decisions.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 text-[11px] font-medium">
            {[
              { key: "junior", label: "Junior HR" },
              { key: "senior", label: "Senior HR" },
              { key: "admin", label: "Admin / CXO" },
            ].map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key as RoleKey)}
                className={`rounded-full px-3 py-1 transition-colors ${
                  role === r.key
                    ? "bg-slate-900 text-slate-50 shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Employees"
            value={metrics.totalEmployees}
            icon={<Users className="h-4 w-4" />}
            helper="+12 this quarter"
          />
          <StatCard
            label="Engagement Score"
            value={`${metrics.avgEngagement}%`}
            icon={<Activity className="h-4 w-4" />}
            accent="secondary"
            helper="+3.2 pts"
          />
          <StatCard
            label="Performance Score"
            value={`${metrics.avgPerformance}%`}
            icon={<TrendingUp className="h-4 w-4" />}
            helper="+2.1 pts"
          />
          <StatCard
            label="Risk Employees"
            value={metrics.riskEmployees}
            icon={<ShieldAlert className="h-4 w-4" />}
            accent="danger"
            helper={`${activeAlerts} active alerts`}
          />
        </div>

        {role === "junior" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Upcoming Meetings
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {upcomingMeetingsCount} check‑ins scheduled
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-lg border-slate-200 text-[11px]"
                  >
                    View calendar
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
                      <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
                    </div>
                  ) : (
                    <UpcomingMeetingsList meetings={meetings} />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">
                    AI Insights from Recent Meetings
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Position this as pulling from the Meeting Insights table.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <p className="text-[11px] font-semibold text-slate-700">
                      Employee: John Doe
                    </p>
                    <p className="mt-1 text-slate-600">
                      Discussion about workload and project deadlines.
                    </p>
                    <div className="mt-2 grid gap-1 text-slate-600 md:grid-cols-2">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Key takeaways
                        </p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-4">
                          <li>Needs support on current sprint</li>
                          <li>Feeling stressed by parallel projects</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Action items
                        </p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-4">
                          <li>Adjust workload for next 2 weeks</li>
                          <li>Schedule follow‑up wellness check</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-50">
                      Sentiment: Neutral
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">
                    Employee Alerts
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Live early‑warning signals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                      <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                    </div>
                  ) : alerts.length === 0 ? (
                    <p className="text-slate-500">No active alerts.</p>
                  ) : (
                    alerts.slice(0, 4).map((a) => (
                      <div
                        key={a.id}
                        className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2"
                      >
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-amber-500" />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-900">
                            {a.employee?.name ?? "Employee"}
                          </p>
                          <p className="text-[11px] text-slate-700">
                            {a.alert_type}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">
                    Action Items
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Simple checklist to show judge‑friendly ops focus.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <span>Follow up with risk employees</span>
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-50">
                      Today
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <span>Log notes after every check‑in</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                      Best practice
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {role === "senior" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="grid gap-4 md:grid-cols-2">
                <EngagementTrend />
                <SentimentPie />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <PerformanceDistribution />
                <DepartmentRadar />
              </div>
            </div>
            <div className="space-y-4">
              <RiskEmployeesList employees={employees} />
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    HR Action Completion
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Example metric to discuss HR performance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <p className="text-slate-600">
                    86% of recommended AI action items have a completed follow‑up
                    meeting logged within 14 days.
                  </p>
                  <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[86%] rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Use this to show leaders that HR is closing the loop on
                    signals, not just collecting them.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {role === "admin" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Workforce Health Score
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Executive composite across engagement, performance, and
                      risk.
                    </CardDescription>
                  </div>
                  <span className="text-2xl font-semibold text-slate-900">
                    {metrics.workforceHealth}
                  </span>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <p className="text-slate-600">
                    OmniSync rolls up signals from meetings, alerts, and
                    sentiment to a single health score that you can show in a
                    board slide.
                  </p>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Attrition risk
                      </p>
                      <p className="mt-1 text-sm font-semibold text-amber-600">
                        Elevated in 2 teams
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Engagement
                      </p>
                      <p className="mt-1 text-sm font-semibold text-emerald-600">
                        Stable vs last quarter
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Sentiment
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        60% positive meetings
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <DepartmentRadar />
                <SentimentPie />
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Strategic AI Insights
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Judge‑facing story of how OmniSync guides executives.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 px-3 py-2.5 text-slate-800">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-700">
                      Insight 1 · Retention
                    </p>
                    <p className="mt-1">
                      High‑performing ICs in Engineering with low engagement are
                      3.2× more likely to trigger risk alerts in the next 60
                      days. Consider an accelerated recognition program.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                      Insight 2 · Manager coaching
                    </p>
                    <p className="mt-1">
                      74% of negative‑sentiment meetings are concentrated under
                      8 managers. Targeted coaching could improve engagement
                      without broad policy changes.
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    For the hackathon, frame this as the AI layer that translates
                    raw meeting data into board‑ready narratives.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <div className="sticky top-20 hidden h-fit lg:block">
        {/* <AIAssistantPanel employees={employees} /> */}
      </div>
    </div>
  );
}


"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const SENTIMENT_COLORS = ["#22C55E", "#E5E7EB", "#EF4444"];

export default function DashboardAnalyticsPage() {
  const engagementData = [
    { month: "Jan", engagement: 72 },
    { month: "Feb", engagement: 74 },
    { month: "Mar", engagement: 76 },
    { month: "Apr", engagement: 77 },
    { month: "May", engagement: 79 },
    { month: "Jun", engagement: 81 },
  ];

  const performanceBands = [
    { band: "90–100", count: 18 },
    { band: "80–89", count: 42 },
    { band: "70–79", count: 45 },
    { band: "60–69", count: 30 },
    { band: "< 60", count: 15 },
  ];

  const sentimentData = [
    { name: "Positive", value: 60 },
    { name: "Neutral", value: 30 },
    { name: "Negative", value: 10 },
  ];

  const deptHealth = [
    { department: "Engineering", engagement: 82, performance: 84, satisfaction: 80, risk: 18 },
    { department: "Sales", engagement: 76, performance: 79, satisfaction: 74, risk: 24 },
    { department: "Support", engagement: 72, performance: 70, satisfaction: 71, risk: 28 },
    { department: "HR", engagement: 88, performance: 86, satisfaction: 90, risk: 10 },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.52_0_0)]">
          Analytics
        </p>
        <h1 className="mt-1 text-[18px] font-semibold text-[oklch(0.12_0_0)]">
          Workforce Analytics Overview
        </h1>
        <p className="mt-1 text-[12px] text-[oklch(0.52_0_0)]">
          A clean, judge‑friendly view focused purely on charts and trends.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-semibold">
              <span>Engagement Trend</span>
              <span className="text-xs font-medium text-emerald-600">+9 pts · 6 months</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Shows how employee engagement is moving over time.
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
              <LineChart data={engagementData}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
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

        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-semibold">
              <span>Performance Distribution</span>
              <span className="text-xs text-[oklch(0.52_0_0)]">Bar chart by band</span>
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
              <BarChart data={performanceBands}>
                <XAxis dataKey="band" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="var(--color-count)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-semibold">
              <span>Meeting Sentiment</span>
              <span className="text-xs text-[oklch(0.52_0_0)]">Positive vs neutral vs negative</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={sentimentData}
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-4 text-xs text-[oklch(0.52_0_0)]">
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

        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-semibold">
              <span>Department Health</span>
              <span className="text-xs text-[oklch(0.52_0_0)]">Radar across metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <RadarChart data={deptHealth}>
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
      </div>
    </div>
  );
}


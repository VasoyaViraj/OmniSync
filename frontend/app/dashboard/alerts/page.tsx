"use client";

import { useEffect, useState } from "react";
import { getAlerts, getEmployees, type Alert, type Employee } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { AlertTriangle, AlertCircle, Info, Clock } from "lucide-react";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[oklch(0.92_0_0)] ${className}`} />;
}

function severityConfig(severity: Alert["severity"]) {
  if (severity === "critical" || severity === "high") {
    return {
      icon: AlertCircle,
      badge: "bg-[#EF4444]/10 text-[#B91C1C]",
      border: "border-[#FCA5A5]",
      label: severity.toUpperCase(),
    };
  }
  if (severity === "warning" || severity === "medium") {
    return {
      icon: AlertTriangle,
      badge: "bg-[#F59E0B]/10 text-[#92400E]",
      border: "border-[#FED7AA]",
      label: severity.toUpperCase(),
    };
  }
  return {
    icon: Info,
    badge: "bg-[#6366F1]/10 text-[#3730A3]",
    border: "border-[#C7D2FE]",
    label: severity.toUpperCase(),
  };
}

export default function DashboardAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [a, e] = await Promise.all([
          getAlerts().catch(() => []),
          getEmployees().catch(() => []),
        ]);
        setAlerts(a ?? []);
        setEmployees(e ?? []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const employeesById = new Map<string, Employee>();
  employees.forEach((e) => employeesById.set(e.id, e));

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.52_0_0)]">
          Risk Signals
        </p>
        <h1 className="mt-1 text-[18px] font-semibold text-[oklch(0.12_0_0)]">
          Alerts & Early Warnings
        </h1>
        <p className="mt-1 text-[12px] text-[oklch(0.52_0_0)]">
          Central place for your HR team to triage risk across the organization.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-semibold">All Alerts</CardTitle>
            <CardDescription className="text-xs">
              Sorted by newest first, with severity badges.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[oklch(0.52_0_0)]">
            <span className="rounded-full bg-[oklch(0.93_0_0)] px-3 py-1 font-medium">
              {alerts.length} total
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
          ) : alerts.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-[oklch(0.52_0_0)]">
              No alerts logged yet.
            </p>
          ) : (
            <div className="space-y-3">
              {alerts
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
                )
                .map((a) => {
                  const emp = a.employee ?? employeesById.get(a.employee_id);
                  const cfg = severityConfig(a.severity);
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={a.id}
                      className={`flex items-start justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-[12px] shadow-sm ${cfg.border}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[oklch(0.93_0_0)]">
                          <Icon className="h-3.5 w-3.5 text-[oklch(0.52_0_0)]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-semibold text-[oklch(0.18_0_0)]">
                              {emp?.name ?? "Employee"}
                            </p>
                            <Badge
                              variant="outline"
                              className={`border-0 px-2 py-0.5 text-[10px] font-semibold ${cfg.badge}`}
                            >
                              {cfg.label}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-[11px] text-[oklch(0.45_0_0)]">
                            {a.alert_type}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[oklch(0.52_0_0)]">
                            {a.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[oklch(0.52_0_0)]">
                        <Clock className="h-3 w-3" />
                        {new Date(a.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
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


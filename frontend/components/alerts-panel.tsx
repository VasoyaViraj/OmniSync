"use client";

import { Alert } from "../types/insights";
import { Employee } from "../types/employee";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle, AlertTriangle, Info, Clock } from "lucide-react";

interface AlertsPanelProps {
  alerts: Alert[];
  employees: Employee[];
}

export function AlertsPanel({ alerts, employees }: AlertsPanelProps) {
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-100",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-100",
        };
      case "info":
      default:
        return {
          icon: Info,
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100",
        };
    }
  };

  return (
    <Card className="h-full border-slate-100 bg-white rounded-xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BellIcon className="w-5 h-5 text-slate-700" />
          Early Warnings & Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => {
          const config = getSeverityConfig(alert.severity);
          const Icon = config.icon;
          const employee = employees.find((e) => e.id === alert.employeeId);

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border ${config.bg} ${config.border} flex flex-col gap-2 transition-transform hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className="font-semibold text-slate-800 text-sm">
                    {employee?.name || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center text-xs text-slate-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(alert.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <p className="text-sm text-slate-600 pl-6">{alert.type}</p>
            </div>
          );
        })}
        {alerts.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No active alerts
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

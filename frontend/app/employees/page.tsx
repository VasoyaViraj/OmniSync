"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEmployees } from "../../lib/api";
import type { Employee } from "../../lib/api";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-[oklch(0.92_0_0)] rounded-lg ${className}`} />;
}

const scoreColor = (s: number) =>
  s >= 80 ? "text-emerald-700 bg-emerald-50" :
  s >= 60 ? "text-amber-700 bg-amber-50" :
             "text-red-700 bg-red-50";

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployees()
      .then((data) => setEmployees(data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.department?.toLowerCase().includes(query.toLowerCase()) ||
      e.designation?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-semibold text-[oklch(0.12_0_0)]">Employee Directory</h2>
          <p className="text-[12px] text-[oklch(0.52_0_0)] mt-0.5">{employees.length} members</p>
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[oklch(0.62_0_0)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search employees..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-4 h-9 text-[13px] border border-[oklch(0.88_0_0)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.16_250)]/40 focus:border-[oklch(0.62_0.16_250)] w-64 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[oklch(0.88_0_0)] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[oklch(0.92_0_0)] bg-[oklch(0.97_0_0)]">
              {["Name", "Department", "Role", "Engagement", "Performance"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.45_0_0)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[oklch(0.93_0_0)]">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-3.5">
                        <Skeleton className="h-4" />
                      </td>
                    ))}
                  </tr>
                ))
              : filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => router.push(`/employees/${emp.id}`)}
                    className="cursor-pointer hover:bg-[oklch(0.97_0_0)] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[oklch(0.90_0_0)] flex items-center justify-center text-[11px] font-semibold text-[oklch(0.40_0_0)] shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="text-[13px] font-medium text-[oklch(0.18_0_0)]">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-[oklch(0.45_0_0)]">{emp.department}</td>
                    <td className="px-5 py-3.5 text-[12px] text-[oklch(0.45_0_0)]">{emp.designation}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md ${scoreColor(emp.engagement_score)}`}>
                        {emp.engagement_score ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md ${scoreColor(emp.performance_score)}`}>
                        {emp.performance_score ?? "—"}
                      </span>
                    </td>
                  </tr>
                ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-[13px] text-[oklch(0.52_0_0)]">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

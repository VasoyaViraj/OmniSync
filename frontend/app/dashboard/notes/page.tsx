"use client";

import { useEffect, useState } from "react";
import { getEmployees, getEmployeeNotes, type Employee, type Note } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[oklch(0.92_0_0)] ${className}`} />;
}

export default function DashboardNotesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(false);

  useEffect(() => {
    getEmployees()
      .then((e) => {
        setEmployees(e ?? []);
        if (e && e.length > 0) {
          setSelectedId(e[0].id);
        }
      })
      .finally(() => setLoadingEmployees(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingNotes(true);
    getEmployeeNotes(selectedId)
      .then((n) => setNotes(n ?? []))
      .finally(() => setLoadingNotes(false));
  }, [selectedId]);

  const selectedEmployee = employees.find((e) => e.id === selectedId);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.52_0_0)]">
          Institutional Memory
        </p>
        <h1 className="mt-1 text-[18px] font-semibold text-[oklch(0.12_0_0)]">
          HR Notes by Employee
        </h1>
        <p className="mt-1 text-[12px] text-[oklch(0.52_0_0)]">
          Quickly browse qualitative context captured by HR across your workforce.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-semibold">Notes Timeline</CardTitle>
            <CardDescription className="text-xs">
              Pick an employee to view their OmniSync notes.
            </CardDescription>
          </div>
          <div>
            {loadingEmployees ? (
              <Skeleton className="h-8 w-44" />
            ) : (
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="h-8 rounded-lg border border-[oklch(0.88_0_0)] bg-white px-3 text-[12px]"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} — {e.department}
                  </option>
                ))}
              </select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loadingNotes ? (
            <div className="space-y-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : !selectedEmployee ? (
            <p className="py-10 text-center text-[13px] text-[oklch(0.52_0_0)]">
              No employees loaded yet.
            </p>
          ) : notes.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-[oklch(0.52_0_0)]">
              No notes recorded for {selectedEmployee.name} yet.
            </p>
          ) : (
            <div className="space-y-3">
              {notes
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
                )
                .map((n) => (
                  <div
                    key={n.id}
                    className="rounded-xl border border-[oklch(0.88_0_0)] bg-white px-4 py-3 text-[12px]"
                  >
                    <p className="text-[oklch(0.30_0_0)]">{n.note}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-[oklch(0.52_0_0)]">
                      <span>{n.created_by}</span>
                      <span>
                        {new Date(n.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


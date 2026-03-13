"use client";

import { useEmployees } from "@/hooks/useEmployees";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MemoryPage() {
  const { data: employees, isLoading } = useEmployees();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Institutional Memory HQ</h1>
        <p className="text-muted-foreground mt-1">
          Access historical context, nuanced interactions, and career details.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Memory by Employee</CardTitle>
            <CardDescription>Select an employee to view or add to their context.</CardDescription>
          </div>
          <div className="relative max-w-sm w-full hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search talent..."
              className="pl-9 bg-slate-50/50"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))
            ) : employees?.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                No employees found.
              </div>
            ) : (
              employees?.map(employee => (
                <div key={employee.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                        {employee.name}
                      </h4>
                      <p className="text-sm text-slate-500">{employee.designation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="hidden sm:inline-flex">{employee.department}</Badge>
                    <Link 
                      href={`/employees/${employee.id}?tab=memory`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors opacity-80 group-hover:opacity-100"
                    >
                      View Memory <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

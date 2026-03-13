"use client";

import { use, useState } from "react";
import { useEmployee } from "@/hooks/useEmployees";
import { useEmployeeTimeline } from "@/hooks/useMemory";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, MapPin, Briefcase, Calendar, ChevronLeft, PhoneCall, History, MessageSquareHeart, AlertTriangle, Lightbulb, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { EmployeeTimelineTab } from "@/components/employee/EmployeeTimelineTab";
import { EmployeeMeetingsTab } from "@/components/employee/EmployeeMeetingsTab";
import { EmployeeAlertsTab } from "@/components/employee/EmployeeAlertsTab";
import { EmployeeMemoryTab } from "@/components/employee/EmployeeMemoryTab";
import { useSearchParams } from "next/navigation";

export default function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'timeline';
  
  const { data: employee, isLoading: isEmpLoading } = useEmployee(id);
  const { data: timeline, isLoading: isTimeLoading } = useEmployeeTimeline(id);

  if (isEmpLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-12 w-full max-w-md rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold text-slate-800">Employee not found</h2>
        <p className="text-slate-500 mt-2 text-center max-w-md">The employee profile you're looking for doesn't exist or you don't have access.</p>
        <Link 
          href="/employees"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-2 mb-2 text-sm text-slate-500">
        <Link href="/employees" className="hover:text-slate-900 transition-colors flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Employees
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{employee.name}</span>
      </div>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-slate-50/80 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10" />
        <CardContent className="px-6 pb-6 pt-0 sm:px-10">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 sm:-mt-16 mb-6">
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center shrink-0 overflow-hidden">
              <span className="text-4xl sm:text-5xl font-bold text-indigo-200">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 space-y-1.5 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{employee.name}</h1>
                  <p className="text-lg text-slate-600 font-medium flex items-center gap-2">
                    {employee.designation} <span className="text-slate-300">&bull;</span> {employee.department}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="gap-2 shrink-0">
                    <PhoneCall className="h-4 w-4" /> Schedule Sync
                  </Button>
                  <Button size="sm" className="gap-2 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <MessageSquareHeart className="h-4 w-4" /> AI Prep
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-md shrink-0"><Mail className="h-4 w-4 text-slate-500" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Email</p>
                <p className="text-sm font-medium text-slate-900 select-all">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-md shrink-0"><MapPin className="h-4 w-4 text-slate-500" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Location</p>
                <p className="text-sm font-medium text-slate-900">{employee.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-md shrink-0"><Calendar className="h-4 w-4 text-slate-500" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Tenure</p>
                <p className="text-sm font-medium text-slate-900">{employee.tenure_years} Years</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-md shrink-0"><Briefcase className="h-4 w-4 text-slate-500" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Engagement</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 w-16 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${employee.engagement_score >= 8 ? 'bg-emerald-500' : employee.engagement_score >= 6 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${(employee.engagement_score / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-none">{employee.engagement_score}/10</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start h-12 p-0 rounded-none mb-6">
          <TabsTrigger 
            value="timeline" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-6 font-medium text-slate-600 data-[state=active]:text-indigo-700 tracking-wide h-full gap-2"
          >
            <History className="h-4 w-4" /> Timeline
          </TabsTrigger>
          <TabsTrigger 
            value="meetings" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-6 font-medium text-slate-600 data-[state=active]:text-indigo-700 tracking-wide h-full gap-2"
          >
            <Calendar className="h-4 w-4" /> Meetings
          </TabsTrigger>
          <TabsTrigger 
            value="alerts" 
            className="relative data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-6 font-medium text-slate-600 data-[state=active]:text-indigo-700 tracking-wide h-full gap-2"
          >
            <AlertTriangle className="h-4 w-4" /> Alerts
          </TabsTrigger>
          <TabsTrigger 
            value="memory" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-6 font-medium text-slate-600 data-[state=active]:text-indigo-700 tracking-wide h-full gap-2"
          >
            <BrainCircuit className="h-4 w-4" /> Memory
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
          <div className="p-6 md:p-8">
            <TabsContent value="timeline" className="mt-0 outline-none">
              {isTimeLoading ? (
                <div className="space-y-8 pl-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                      <div className="space-y-2 w-full max-w-lg">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmployeeTimelineTab employeeId={id} timeline={timeline || []} />
              )}
            </TabsContent>
            
            <TabsContent value="meetings" className="mt-0 outline-none">
              <EmployeeMeetingsTab employeeId={id} />
            </TabsContent>
            
            <TabsContent value="alerts" className="mt-0 outline-none">
              <EmployeeAlertsTab employeeId={id} />
            </TabsContent>
            
            <TabsContent value="memory" className="mt-0 outline-none">
              <EmployeeMemoryTab employeeId={id} memory={timeline?.filter(t => t.event_type.toLowerCase() === 'note' || t.event_type.toLowerCase() === 'memory' || t.event_type.toLowerCase() === 'milestone') || []} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

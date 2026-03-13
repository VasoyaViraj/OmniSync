"use client";

import { useDashboardOverview } from "@/hooks/useDashboard";
import { useEmployees } from "@/hooks/useEmployees";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertCircle, Calendar, Lightbulb, Activity, ArrowUpRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: dashboard, isLoading: dashboardLoading } = useDashboardOverview();
  const { data: employees, isLoading: employeesLoading } = useEmployees();

  const getAlertColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500/10 text-red-700 hover:bg-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-700 hover:bg-orange-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-700 hover:bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Executive Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your organizational health and employee intelligence.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {employeesLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold">{employees?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Across 5 departments</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Check-ins</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold">{dashboard?.upcoming_checkins?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Scheduled for this month</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold">{dashboard?.latest_alerts?.filter(a => a.severity === 'critical' || a.severity === 'high').length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Critical or High priority</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Insights</CardTitle>
            <Lightbulb className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-2xl font-bold">24</div> // Mocked total insights
            )}
            <p className="text-xs text-muted-foreground mt-1">From recent meetings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm flex flex-col h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-500" />
                  Recent Critical Alerts
                </CardTitle>
                <CardDescription>Attention required for these employees</CardDescription>
              </div>
              <Link href="/alerts" className="text-sm text-primary flex items-center hover:underline">
                View all <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {dashboardLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : dashboard?.latest_alerts?.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground bg-slate-50/50 rounded-md border border-dashed">
                No active alerts
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard?.latest_alerts?.slice(0, 5).map(alert => (
                  <div key={alert.id} className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/employees/${alert.employee_id}`} className="font-medium hover:underline">
                          {alert.employee?.name || 'Unknown Employee'}
                        </Link>
                        <Badge variant="secondary" className={getAlertColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap ml-4 flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {format(new Date(alert.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm flex flex-col h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                  Upcoming Check-ins
                </CardTitle>
                <CardDescription>Scheduled employee meetings</CardDescription>
              </div>
              <Link href="/meetings" className="text-sm text-primary flex items-center hover:underline">
                Calendar <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {dashboardLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : dashboard?.upcoming_checkins?.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground bg-slate-50/50 rounded-md border border-dashed">
                No upcoming check-ins scheduled
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard?.upcoming_checkins?.map(meeting => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center bg-slate-100 rounded-md h-12 w-12 text-center text-slate-800 shrink-0">
                        <span className="text-xs font-semibold uppercase">{format(new Date(meeting.next_followup_date!), 'MMM')}</span>
                        <span className="text-lg font-bold leading-none mt-0.5">{format(new Date(meeting.next_followup_date!), 'd')}</span>
                      </div>
                      <div>
                        <Link href={`/employees/${meeting.employee_id}`} className="font-medium hover:underline block">
                          {meeting.employee?.name || 'Unknown Employee'}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-0.5 max-h-10 overflow-hidden text-ellipsis line-clamp-1">{meeting.summary || 'Follow-up meeting'}</p>
                      </div>
                    </div>
                    <Link 
                      href={`/employees/${meeting.employee_id}?tab=meetings`}
                      className="inline-flex h-8 shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-input bg-background px-3 text-xs font-medium hover:bg-muted hover:text-foreground transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
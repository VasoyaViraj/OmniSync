"use client";

import { useAlerts } from "@/hooks/useAlerts";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertTriangle, Filter, Eye } from "lucide-react";

export default function AlertsPage() {
  const { data: alerts, isLoading } = useAlerts();

  const getBadgeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500 hover:bg-red-600 font-bold';
      case 'high': return 'bg-orange-500 hover:bg-orange-600 font-bold';
      case 'medium': return 'bg-amber-500 hover:bg-amber-600 font-bold';
      case 'low': return 'bg-blue-500 hover:bg-blue-600 font-bold';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  const sortedAlerts = alerts?.sort((a, b) => {
    const sevMap: Record<string, number> = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    return (sevMap[b.severity.toLowerCase()] || 0) - (sevMap[a.severity.toLowerCase()] || 0);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Active Alerts</h1>
        <p className="text-muted-foreground mt-1">
          Unified view of all critical employee signals and risks.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-slate-100 bg-slate-50">All</Badge>
            <Badge variant="outline" className="px-3 py-1 cursor-pointer bg-red-50 text-red-700 border-red-200">Critical</Badge>
            <Badge variant="outline" className="px-3 py-1 cursor-pointer bg-orange-50 text-orange-700 border-orange-200">High</Badge>
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[100px] pl-6">Severity</TableHead>
                <TableHead className="w-[200px]">Employee</TableHead>
                <TableHead>Signal / Type</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : !sortedAlerts || sortedAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-muted-foreground bg-slate-50/50">
                    <div className="flex justify-center mb-2">
                      <AlertTriangle className="h-8 w-8 text-slate-300" />
                    </div>
                    No active alerts across the organization.
                  </TableCell>
                </TableRow>
              ) : (
                sortedAlerts.map((alert) => (
                  <TableRow key={alert.id} className="group hover:bg-slate-50/50">
                    <TableCell className="pl-6">
                      <Badge className={`uppercase text-[10px] tracking-wider px-2 py-0 ${getBadgeColor(alert.severity)} text-white`}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      <Link href={`/employees/${alert.employee_id}?tab=alerts`} className="hover:underline hover:text-primary transition-all">
                        {alert.employee?.name || `Employee ${alert.employee_id.substring(0, 5)}...`}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm mb-0.5 text-slate-800">
                        {alert.alert_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 max-w-md">
                        {alert.description}
                      </p>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">
                      {format(new Date(alert.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Link 
                        href={`/employees/${alert.employee_id}?tab=alerts`}
                        className="inline-flex h-8 items-center justify-center rounded-[min(var(--radius-md),12px)] px-3 text-xs font-medium hover:bg-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Eye className="h-4 w-4 mr-2" /> Examine
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

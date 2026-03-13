import { useEmployeeAlerts } from "@/hooks/useAlerts";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function EmployeeAlertsTab({ employeeId }: { employeeId: string }) {
  const { data: alerts, isLoading } = useEmployeeAlerts(employeeId);

  const getAlertColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'border-red-500/50 bg-red-50 text-red-900 dark:bg-red-950/20';
      case 'high': return 'border-orange-500/50 bg-orange-50 text-orange-900 dark:bg-orange-950/20';
      case 'medium': return 'border-amber-500/50 bg-amber-50 text-amber-900 dark:bg-amber-950/20';
      case 'low': return 'border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950/20';
      default: return 'border-slate-500/50 bg-slate-50 text-slate-900 dark:bg-slate-950/20';
    }
  };

  const getBadgeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500 hover:bg-red-600 text-white';
      case 'high': return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'medium': return 'bg-amber-500 hover:bg-amber-600 text-white';
      case 'low': return 'bg-blue-500 hover:bg-blue-600 text-white';
      default: return 'bg-slate-500 hover:bg-slate-600 text-white';
    }
  };

  if (isLoading) {
    return <div className="space-y-4">{[1, 2].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>;
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-dashed rounded-lg">
        <Activity className="h-10 w-10 text-emerald-400 mb-3" />
        <h3 className="text-lg font-medium text-slate-800">Healthy Profile</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1">No active alerts or risk flags for this employee. Everything looks good!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className={`rounded-lg border p-5 shadow-sm transition-all hover:shadow-md ${getAlertColor(alert.severity)}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 p-1.5 rounded-full ${getBadgeColor(alert.severity).split(' ')[0]} bg-opacity-20`}>
                <AlertTriangle className={`h-5 w-5 ${getBadgeColor(alert.severity).split(' ')[0].replace('bg-', 'text-')}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-base font-semibold tracking-tight">{alert.alert_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                  <Badge variant="secondary" className={`${getBadgeColor(alert.severity)} uppercase text-[10px] tracking-wider px-2 py-0`}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm opacity-90 leading-relaxed max-w-2xl">{alert.description}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3">
            <div className="flex items-center text-xs font-medium opacity-70">
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              Detected {format(new Date(alert.created_at), 'MMM d, yyyy \at h:mm a')}
            </div>
            <button className="text-xs font-semibold hover:underline opacity-80 transition-opacity hover:opacity-100">
              Acknowledge
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

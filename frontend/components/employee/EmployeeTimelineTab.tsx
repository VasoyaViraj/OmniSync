import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Clock, AlertCircle, FileText, BrainCircuit, Calendar as CalendarIcon, Lightbulb } from "lucide-react";

export function EmployeeTimelineTab({ employeeId, timeline }: { employeeId: string, timeline: any[] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-dashed rounded-lg">
        <Clock className="h-8 w-8 text-slate-300 mb-2" />
        <h3 className="font-semibold text-slate-700">No Timeline Events</h3>
        <p className="text-sm text-slate-500">Events, meetings, and insights will appear here chronologically.</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'meeting': return <CalendarIcon className="h-4 w-4 text-blue-500" />;
      case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'insight': return <Lightbulb className="h-4 w-4 text-emerald-500" />;
      case 'memory': return <BrainCircuit className="h-4 w-4 text-purple-500" />;
      default: return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  const getColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'meeting': return 'bg-blue-100 border-blue-200';
      case 'alert': return 'bg-red-100 border-red-200';
      case 'insight': return 'bg-emerald-100 border-emerald-200';
      case 'memory': return 'bg-purple-100 border-purple-200';
      default: return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="relative border-l border-slate-200 ml-3 md:ml-4 space-y-8 py-4">
      {timeline.map((event, idx) => (
        <div key={event.id || idx} className="relative pl-6 md:pl-8">
          <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border bg-white ${getColor(event.event_type)}`}>
            {getIcon(event.event_type)}
          </span>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{event.event_type}</span>
              <span className="text-xs text-slate-400">&bull; {format(new Date(event.created_at), 'MMM d, yyyy - h:mm a')}</span>
            </div>
            <h4 className="text-base font-medium text-slate-900 leading-tight">{event.title}</h4>
            {event.description && (
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{event.description}</p>
            )}
            {event.source && (
              <span className="text-xs text-slate-400 mt-2 bg-slate-100 px-2 py-0.5 rounded-md self-start border border-slate-200">
                Source: {event.source}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

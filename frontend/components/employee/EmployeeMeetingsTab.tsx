import { useEmployeeMeetings } from "@/hooks/useMeetings";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Lightbulb, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";

export function EmployeeMeetingsTab({ employeeId }: { employeeId: string }) {
  const { data: meetings, isLoading } = useEmployeeMeetings(employeeId);

  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';
      case 'neutral': return 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>;
  }

  if (!meetings || meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-dashed rounded-lg">
        <Calendar className="h-8 w-8 text-slate-300 mb-2" />
        <h3 className="font-semibold text-slate-700">No Meetings Recorded</h3>
        <p className="text-sm text-slate-500 mb-4">Schedule a check-in to start tracking interactions.</p>
        <Button variant="outline" size="sm">Schedule Meeting</Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Sentiment</TableHead>
            <TableHead>HR Partner</TableHead>
            <TableHead className="text-right">Insights</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((meeting) => (
            <TableRow key={meeting.id} className="group">
              <TableCell className="font-medium text-slate-700 align-top pt-4">
                {format(new Date(meeting.meeting_date), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="align-top pt-4">
                <p className="text-sm text-slate-800 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-lg">
                  {meeting.summary || "No summary provided."}
                </p>
                {meeting.next_followup_date && (
                  <div className="flex items-center text-xs text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded inline-flex">
                    <Calendar className="mr-1 h-3 w-3" />
                    Follow-up: {format(new Date(meeting.next_followup_date), 'MMM d, yyyy')}
                  </div>
                )}
              </TableCell>
              <TableCell className="align-top pt-4">
                {meeting.sentiment ? (
                  <Badge variant="outline" className={getSentimentColor(meeting.sentiment)}>
                    {meeting.sentiment}
                  </Badge>
                ) : (
                  <span className="text-xs text-slate-400">N/A</span>
                )}
              </TableCell>
              <TableCell className="align-top pt-4">
                <div className="flex items-center text-sm text-slate-600">
                  <User className="mr-1.5 h-3.5 w-3.5" />
                  {meeting.hr_id}
                </div>
              </TableCell>
              <TableCell className="text-right align-top pt-4 pr-4">
                <Link 
                  href={`/meetings/${meeting.id}`}
                  className="inline-flex h-8 -mt-1 items-center justify-center rounded-md px-3 text-xs font-medium hover:bg-muted hover:text-foreground transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <Lightbulb className="mr-1.5 h-3.5 w-3.5" />
                  View Details
                </Link>
                {meeting.insights && meeting.insights.length > 0 && (
                  <div className="text-xs text-emerald-600 font-medium group-hover:hidden flex items-center justify-end h-8 -mt-1">
                    {meeting.insights.length} insight(s)
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

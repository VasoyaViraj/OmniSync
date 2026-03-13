"use client";

import { useMeetings } from "@/hooks/useMeetings";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, User, Lightbulb, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MeetingsPage() {
  const { data: meetings, isLoading } = useMeetings();

  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Meetings</h1>
        <p className="text-muted-foreground mt-1">
          Review past employee check-ins and extracted insights.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search meetings..."
                className="pl-9 bg-slate-50/50"
              />
            </div>
            <Button className="ml-auto" variant="outline">
              <Calendar className="mr-2 h-4 w-4" /> Schedule New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="pl-6 w-[200px]">Employee</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead className="text-right pr-6">Insights</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : !meetings || meetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No meetings found.
                  </TableCell>
                </TableRow>
              ) : (
                meetings.map((meeting) => (
                  <TableRow key={meeting.id} className="group hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-900 pl-6">
                      <Link href={`/employees/${meeting.employee_id}`} className="hover:underline hover:text-primary">
                        {meeting.employee?.name || `Employee ${meeting.employee_id.substring(0, 5)}...`}
                      </Link>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {format(new Date(meeting.meeting_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-800 line-clamp-1 max-w-sm">
                        {meeting.summary || "No summary provided."}
                      </p>
                    </TableCell>
                    <TableCell>
                      {meeting.sentiment ? (
                        <Badge variant="outline" className={getSentimentColor(meeting.sentiment)}>
                          {meeting.sentiment}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Link 
                        href={`/meetings/${meeting.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-[min(var(--radius-md),12px)] px-3 text-xs font-medium hover:bg-muted hover:text-foreground transition-colors sm:opacity-0 group-hover:opacity-100"
                      >
                        View Details
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

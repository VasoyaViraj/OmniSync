"use client";

import { useMeetings } from "@/hooks/useMeetings";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Calendar, CheckCircle2, Clock, Flag, User } from "lucide-react";

export default function InsightsPage() {
  const { data: meetings, isLoading } = useMeetings();

  // Aggregate all meetings that have insights
  const meetingsWithInsights = meetings?.filter(m => m.insights && m.insights.length > 0) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">AI Insights Hub</h1>
        <p className="text-muted-foreground mt-1">
          Aggregated AI extractions from across your organization's check-ins.
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      ) : meetingsWithInsights.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-dashed rounded-lg h-64">
          <Lightbulb className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-800">No Insights Available</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">AI insights will appear here once they are generated from meetings.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetingsWithInsights.map(meeting => (
            meeting.insights?.map(insight => (
              <Card key={insight.id} className="shadow-sm flex flex-col hover:border-emerald-200 transition-colors">
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-base">
                        <Link href={`/employees/${meeting.employee_id}`} className="hover:underline hover:text-primary">
                          {meeting.employee?.name || `Employee ${meeting.employee_id.substring(0, 5)}`}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center text-xs text-slate-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(meeting.meeting_date), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shrink-0">
                      <Lightbulb className="h-3 w-3 mr-1" /> Insight
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1 space-y-4">
                  {insight.key_takeaways && (
                    <div>
                      <h4 className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" /> Key Takeaway
                      </h4>
                      <p className="text-sm text-slate-800 leading-relaxed line-clamp-3">{insight.key_takeaways}</p>
                    </div>
                  )}
                  {insight.risk_flags && (
                    <div>
                      <h4 className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        <Flag className="h-3 w-3 mr-1 text-red-500" /> Risk Flags
                      </h4>
                      <p className="text-sm text-red-800 font-medium line-clamp-2">{insight.risk_flags}</p>
                    </div>
                  )}
                  <div className="pt-3 border-t mt-auto">
                    <Link href={`/meetings/${meeting.id}`} className="text-xs font-medium text-primary hover:underline flex items-center">
                      View full meeting context &rarr;
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ))}
        </div>
      )}
    </div>
  );
}

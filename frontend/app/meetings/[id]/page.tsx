"use client";

import { use } from "react";
import { useMeeting } from "@/hooks/useMeetings";
import { useMeetingInsights } from "@/hooks/useInsights";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, User, Lightbulb, ChevronLeft, Flag, CheckCircle2, Clock } from "lucide-react";

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: meeting, isLoading: isMeetingLoading } = useMeeting(id);
  const { data: insights, isLoading: isInsightsLoading } = useMeetingInsights(id);

  if (isMeetingLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!meeting) {
    return <div>Meeting not found</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-2 mb-2 text-sm text-slate-500">
        <Link href="/meetings" className="hover:text-slate-900 transition-colors flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Meetings
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{format(new Date(meeting.meeting_date), 'MMM d, yyyy')}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Check-in Summary</h1>
          <div className="flex items-center gap-4 mt-3 text-slate-600 text-sm flex-wrap">
            <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {format(new Date(meeting.meeting_date), 'MMMM d, yyyy')}</span>
            <span className="flex items-center"><User className="h-4 w-4 mr-1" /> HR: {meeting.hr_id}</span>
            {meeting.sentiment && (
              <Badge variant="secondary" className="bg-slate-100">{meeting.sentiment} Sentiment</Badge>
            )}
          </div>
        </div>
        <Link 
          href={`/employees/${meeting.employee_id}`}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted hover:text-foreground transition-colors"
        >
          View Employee Profile
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <CardTitle className="text-lg">Meeting Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {meeting.summary || "No summary was generated for this meeting."}
              </p>
            </CardContent>
          </Card>

          {meeting.transcript && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <CardTitle className="text-lg">Transcript Excerpt</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-600 font-mono overflow-auto max-h-64 whitespace-pre-wrap">
                  {meeting.transcript}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-emerald-500" /> AI Extracts
          </h3>
          
          {isInsightsLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
          ) : !insights || insights.length === 0 ? (
            <div className="p-6 border border-dashed rounded-lg text-center bg-slate-50 text-slate-500 text-sm">
              No insights were extracted from this meeting.
            </div>
          ) : (
            insights.map(insight => (
              <div key={insight.id} className="space-y-4">
                {insight.key_takeaways && (
                  <Card className="shadow-sm border-emerald-100 bg-emerald-50/30">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm text-emerald-800 flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" /> Key Takeaways
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <p className="text-sm text-slate-700">{insight.key_takeaways}</p>
                    </CardContent>
                  </Card>
                )}
                
                {insight.action_items && (
                  <Card className="shadow-sm border-blue-100 bg-blue-50/30">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm text-blue-800 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" /> Action Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <p className="text-sm text-slate-700">{insight.action_items}</p>
                    </CardContent>
                  </Card>
                )}

                {insight.risk_flags && (
                  <Card className="shadow-sm border-red-100 bg-red-50/30">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm text-red-800 flex items-center">
                        <Flag className="h-4 w-4 mr-2 text-red-600" /> Risk Flags
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <p className="text-sm text-slate-700 font-medium text-red-900">{insight.risk_flags}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

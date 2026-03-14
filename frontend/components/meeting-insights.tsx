"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Sparkles, Activity } from "lucide-react";

interface MeetingInsightsProps {
  summary?: string;
  insights?: string[];
  sentiment?: "Positive" | "Neutral" | "Negative";
}

export function MeetingInsights({ summary, insights, sentiment }: MeetingInsightsProps) {
  
  const getSentimentStyles = (s?: string) => {
    switch(s) {
      case "Positive": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Negative": return "bg-rose-50 text-rose-700 border-rose-200";
      case "Neutral":
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <Card className="h-full border-slate-100 bg-white shadow-sm flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          AI Analysis
        </CardTitle>
        {sentiment && (
          <Badge variant="outline" className={`${getSentimentStyles(sentiment)} flex items-center gap-1.5 px-3 py-1 font-medium`}>
            <Activity className="w-3.5 h-3.5" />
            {sentiment}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Summary Section */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 tracking-wider">Executive Summary</h4>
          {summary ? (
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {summary}
            </p>
          ) : (
            <p className="text-sm text-slate-400 italic">No summary available.</p>
          )}
        </div>

        {/* Key Insights List */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-slate-400 mb-3 tracking-wider">Key Insights</h4>
          {insights && insights.length > 0 ? (
            <ul className="space-y-3">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold text-xs mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed pt-1">{insight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic">No extracted insights available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

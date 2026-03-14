"use client";

import { Employee } from "../types/employee";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function SentimentHeatmap({ employees }: { employees: Employee[] }) {
  // Aggregate by department
  const depts = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) acc[emp.department] = { eScore: 0, pScore: 0, count: 0 };
    acc[emp.department].eScore += emp.engagementScore;
    acc[emp.department].pScore += emp.performanceScore;
    acc[emp.department].count += 1;
    return acc;
  }, {} as Record<string, { eScore: number; pScore: number; count: number }>);

  const deptStats = Object.keys(depts).map((key) => ({
    department: key,
    avgEngagement: Math.round(depts[key].eScore / depts[key].count),
    avgPerformance: Math.round(depts[key].pScore / depts[key].count),
  }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white";
    if (score >= 60) return "bg-yellow-400 hover:bg-yellow-500 border-yellow-500 text-slate-900";
    return "bg-rose-500 hover:bg-rose-600 border-rose-600 text-white";
  };

  return (
    <Card className="h-full border-slate-100 bg-white rounded-xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Organization Sentiment Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <TooltipProvider>
            {deptStats.map((stat) => (
              <div key={stat.department} className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.department}</h4>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger className="flex-1">
                      <div className={`h-12 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm transition-colors border ${getScoreColor(stat.avgEngagement)}`}>
                        {stat.avgEngagement}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-slate-100 border-slate-700">
                      <p>Avg Engagement</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger className="flex-1">
                      <div className={`h-12 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm transition-colors border ${getScoreColor(stat.avgPerformance)}`}>
                        {stat.avgPerformance}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-slate-100 border-slate-700">
                      <p>Avg Performance</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </TooltipProvider>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Healthy (&ge;80)</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> Neutral (60-79)</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div> At Risk (&lt;60)</div>
        </div>
      </CardContent>
    </Card>
  );
}

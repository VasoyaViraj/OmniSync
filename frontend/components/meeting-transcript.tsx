"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { MessageSquare } from "lucide-react";

interface MeetingTranscriptProps {
  transcript?: string;
}

export function MeetingTranscript({ transcript }: MeetingTranscriptProps) {
  if (!transcript) {
    return (
      <Card className="h-full border-slate-100 bg-white shadow-sm flex flex-col pt-6 pb-12 w-full text-center items-center justify-center">
        <MessageSquare className="w-8 h-8 text-slate-300 mb-3" />
        <p className="text-slate-500">No transcript available for this meeting.</p>
      </Card>
    );
  }

  // Basic parsing assuming lines are "Speaker: text"
  const lines = transcript.split('\n').filter(l => l.trim().length > 0);

  return (
    <Card className="h-full border-slate-100 bg-white shadow-sm flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-400" />
          Full Transcript
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px] w-full p-6">
          <div className="space-y-6">
            {lines.map((line, i) => {
              const colonIndex = line.indexOf(':');
              if (colonIndex > -1) {
                const speaker = line.slice(0, colonIndex).trim();
                const text = line.slice(colonIndex + 1).trim();
                const isHR = speaker.toLowerCase().includes('hr');
                return (
                  <div key={i} className={`flex flex-col ${isHR ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs font-semibold text-slate-400 mb-1">{speaker}</span>
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                      isHR 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                    }`}>
                      {text}
                    </div>
                  </div>
                );
              }
              // Fallback
              return (
                <div key={i} className="text-slate-700 text-sm leading-relaxed p-2 bg-slate-50 rounded-lg">
                  {line}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

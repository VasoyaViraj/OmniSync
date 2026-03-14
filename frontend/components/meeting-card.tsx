"use client";

import { Meeting } from "../types/meeting";
import { Employee } from "../types/employee";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, User, Briefcase } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface MeetingCardProps {
  meeting: Meeting;
  employee?: Employee;
}

export function MeetingCard({ meeting, employee }: MeetingCardProps) {
  const [prepOpen, setPrepOpen] = useState(false);
  const [prepNotes, setPrepNotes] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrepare = async () => {
    setPrepOpen(true);
    setIsLoading(true);
    try {
      // Call dummy API
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/ai/meeting-prep`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId: meeting.id, employeeId: meeting.employeeId }),
      });
      const data = await res.json();
      setPrepNotes(data.prep_notes);
    } catch (e) {
      setPrepNotes("Error loading prep notes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow bg-white rounded-xl border-slate-100 flex flex-col h-full">
        <CardHeader className="pb-3 border-b border-slate-50">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold text-slate-800">
              {employee?.name || "Unknown Employee"}
            </CardTitle>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-medium border-0">
              {meeting.type}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <Briefcase className="w-4 h-4 mr-1 text-slate-400" />
            {employee?.department || "Unknown Dept"}
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-1">
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" />
              {new Date(meeting.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-slate-400" />
              {meeting.time}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 border-t border-slate-50 mt-4">
          <Button 
            onClick={handlePrepare} 
            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm"
          >
            Prepare with AI
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={prepOpen} onOpenChange={setPrepOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-800">AI Preparation Brief</DialogTitle>
          </DialogHeader>
          <div className="min-h-[150px] flex flex-col justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4 text-slate-500 py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p>Generating insights...</p>
              </div>
            ) : (
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Suggested Focus
                </h4>
                <p className="text-slate-700 leading-relaxed">{prepNotes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

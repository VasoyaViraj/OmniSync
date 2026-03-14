import { Employee } from "../types/employee";
import { Meeting } from "../types/meeting";
import { Note, Alert } from "../types/insights";

export const dummyEmployees: Employee[] = [
  {
    id: "e1",
    name: "Alex Johnson",
    department: "Engineering",
    role: "Senior Frontend Engineer",
    engagementScore: 65,
    performanceScore: 88,
  },
  {
    id: "e2",
    name: "Maria Garcia",
    department: "Design",
    role: "UX Researcher",
    engagementScore: 92,
    performanceScore: 95,
  },
  {
    id: "e3",
    name: "David Smith",
    department: "Marketing",
    role: "Growth Manager",
    engagementScore: 45,
    performanceScore: 70,
  },
  {
    id: "e4",
    name: "Sarah Lee",
    department: "Sales",
    role: "Account Executive",
    engagementScore: 80,
    performanceScore: 90,
  },
];

export const dummyMeetings: Meeting[] = [
  {
    id: "m1",
    employeeId: "e1",
    date: "2024-03-20",
    time: "10:00",
    type: "1-on-1",
    status: "Scheduled",
  },
  {
    id: "m2",
    employeeId: "e3",
    date: "2024-03-21",
    time: "14:30",
    type: "Performance Review",
    status: "Scheduled",
  },
  {
    id: "m3",
    employeeId: "e1",
    date: "2024-02-15",
    time: "11:00",
    type: "1-on-1",
    status: "Completed",
    transcript: "Alex: I've been feeling a bit overwhelmed with the recent sprint.\nHR: Can you elaborate on what's causing the stress?\nAlex: Just the sheer volume of UI tickets and the fast approaching deadline. I also want to make sure I'm on track for the team lead position.",
    summary: "Discussed recent sprint stress and workload. Alex expressed interest in the team lead position.",
    insights: [
      "Employee expressed burnout/workload pressure",
      "Promotion interest (Team Lead)",
    ],
    sentiment: "Neutral",
  },
];

export const dummyNotes: Note[] = [
  {
    id: "n1",
    employeeId: "e1",
    date: "2024-01-10",
    summary: "Alex mentioned during the Q1 kickoff that they would like to mentor junior developers this year.",
  },
  {
    id: "n2",
    employeeId: "e3",
    date: "2024-02-28",
    summary: "David seems disengaged during recent marketing syncs. Need to check in on his current project satisfaction.",
  },
];

export const dummyAlerts: Alert[] = [
  {
    id: "a1",
    employeeId: "e3",
    type: "Drop in Engagement Score",
    severity: "critical",
    createdAt: "2024-03-12T08:00:00Z",
  },
  {
    id: "a2",
    employeeId: "e1",
    type: "High Workload Sentiment",
    severity: "warning",
    createdAt: "2024-03-14T09:30:00Z",
  },
  {
    id: "a3",
    employeeId: "e2",
    type: "Outstanding Performance Review",
    severity: "info",
    createdAt: "2024-03-01T15:20:00Z",
  },
];

export const getEmployeeById = (id: string) => dummyEmployees.find(e => e.id === id);
export const getMeetingsByEmployeeId = (id: string) => dummyMeetings.filter(m => m.employeeId === id);
export const getNotesByEmployeeId = (id: string) => dummyNotes.filter(n => n.employeeId === id);
export const getMeetingById = (id: string) => dummyMeetings.find(m => m.id === id);

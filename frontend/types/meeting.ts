export interface Meeting {
  id: string;
  employeeId: string;
  date: string; // ISO string
  time: string; // HH:mm format
  type: string; // e.g. "1-on-1", "Performance Review"
  status: "Scheduled" | "Completed" | "Draft";
  transcript?: string;
  summary?: string;
  insights?: string[];
  sentiment?: "Positive" | "Neutral" | "Negative";
}

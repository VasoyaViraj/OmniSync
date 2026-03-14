export interface Note {
  id: string;
  employeeId: string;
  date: string;
  summary: string;
}

export interface Alert {
  id: string;
  employeeId: string;
  type: string;
  severity: "critical" | "warning" | "info";
  createdAt: string;
}

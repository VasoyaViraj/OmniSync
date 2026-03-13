export interface EmployeeNote {
  id: string;
  employee_id: string;
  note: string;
  created_by: string;
  created_at: string;
}

export interface NoteCreate {
  employee_id: string;
  note: string;
  created_by: string;
}

export interface NoteUpdate {
  note?: string;
  created_by?: string;
}

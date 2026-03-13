export interface InstitutionalMemory {
  id: string;
  employee_id: string;
  event_type: string;
  title: string;
  description: string | null;
  source: string | null;
  created_at: string;
}

export interface MemoryCreate {
  employee_id: string;
  event_type: string;
  title: string;
  description?: string;
  source?: string;
}

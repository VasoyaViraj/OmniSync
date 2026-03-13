export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  location: string;
  manager_id: string | null;
  tenure_years: number;
  performance_score: number;
  engagement_score: number;
  created_at: string;
}

export interface EmployeeCreate {
  name: string;
  email: string;
  department: string;
  designation: string;
  location: string;
  manager_id?: string;
  tenure_years?: number;
  performance_score?: number;
  engagement_score?: number;
}

export interface EmployeeUpdate extends Partial<EmployeeCreate> {}

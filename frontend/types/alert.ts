import { Employee } from "./employee";

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface EmployeeAlert {
  id: string;
  employee_id: string;
  alert_type: string;
  description: string;
  severity: AlertSeverity;
  created_at: string;

  employee?: Employee;
}

export interface AlertCreate {
  employee_id: string;
  alert_type: string;
  description: string;
  severity: AlertSeverity;
}

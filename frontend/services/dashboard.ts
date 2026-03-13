import { api } from './api';
import { ApiResponse } from '@/types/api';
import { Meeting } from '@/types/meeting';
import { EmployeeAlert } from '@/types/alert';

export interface DashboardData {
  upcoming_checkins: Meeting[];
  latest_alerts: EmployeeAlert[];
}

export const dashboardService = {
  getOverview: () => api.get<any, ApiResponse<DashboardData>>('/api/dashboard'),
};

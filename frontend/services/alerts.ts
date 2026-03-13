import { api } from './api';
import { EmployeeAlert, AlertCreate } from '@/types/alert';
import { ApiResponse } from '@/types/api';

export const alertsService = {
  getAll: () => api.get<any, ApiResponse<EmployeeAlert[]>>('/api/alerts'),
  
  getByEmployeeId: (employeeId: string) => 
    api.get<any, ApiResponse<EmployeeAlert[]>>(`/api/employees/${employeeId}/alerts`),
    
  create: (data: AlertCreate) => 
    api.post<any, ApiResponse<EmployeeAlert>>('/api/alerts', data),
    
  delete: (id: string) => 
    api.delete<any, ApiResponse<{ message: string }>>(`/api/alerts/${id}`),
};

import { api } from './api';
import { Employee, EmployeeCreate, EmployeeUpdate } from '@/types/employee';
import { ApiResponse } from '@/types/api';

export const employeesService = {
  getAll: () => api.get<any, ApiResponse<Employee[]>>('/api/employees'),
  
  getById: (id: string) => api.get<any, ApiResponse<Employee>>(`/api/employees/${id}`),
  
  create: (data: EmployeeCreate) => api.post<any, ApiResponse<Employee>>('/api/employees', data),
  
  update: (id: string, data: EmployeeUpdate) => api.put<any, ApiResponse<Employee>>(`/api/employees/${id}`, data),
  
  delete: (id: string) => api.delete<any, ApiResponse<{ message: string }>>(`/api/employees/${id}`),
};

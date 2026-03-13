import { api } from './api';
import { Meeting, MeetingCreate, MeetingUpdate } from '@/types/meeting';
import { ApiResponse } from '@/types/api';

export const meetingsService = {
  getAll: () => api.get<any, ApiResponse<Meeting[]>>('/api/meetings'),
  
  getById: (id: string) => api.get<any, ApiResponse<Meeting>>(`/api/meetings/${id}`),
  
  getByEmployeeId: (employeeId: string) => 
    api.get<any, ApiResponse<Meeting[]>>(`/api/employees/${employeeId}/meetings`),
  
  create: (data: MeetingCreate) => api.post<any, ApiResponse<Meeting>>('/api/meetings', data),
  
  update: (id: string, data: MeetingUpdate) => api.put<any, ApiResponse<Meeting>>(`/api/meetings/${id}`, data),
  
  delete: (id: string) => api.delete<any, ApiResponse<{ message: string }>>(`/api/meetings/${id}`),
};

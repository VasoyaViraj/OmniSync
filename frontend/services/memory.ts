import { api } from './api';
import { InstitutionalMemory, MemoryCreate } from '@/types/memory';
import { ApiResponse } from '@/types/api';

export const memoryService = {
  getByEmployeeId: (employeeId: string) => 
    api.get<any, ApiResponse<InstitutionalMemory[]>>(`/api/employees/${employeeId}/timeline`),
    
  create: (data: MemoryCreate) => 
    api.post<any, ApiResponse<InstitutionalMemory>>('/api/memory', data),
    
  delete: (id: string) => 
    api.delete<any, ApiResponse<{ message: string }>>(`/api/memory/${id}`),
};

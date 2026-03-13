import { api } from './api';
import { MeetingInsight } from '@/types/meeting';
import { ApiResponse } from '@/types/api';

export const insightsService = {
  getByMeetingId: (meetingId: string) => 
    api.get<any, ApiResponse<MeetingInsight[]>>(`/api/insights/${meetingId}`),
    
  create: (data: Partial<MeetingInsight>) => 
    api.post<any, ApiResponse<MeetingInsight>>('/api/insights', data),
    
  update: (id: string, data: Partial<MeetingInsight>) => 
    api.put<any, ApiResponse<MeetingInsight>>(`/api/insights/${id}`, data),
    
  delete: (id: string) => 
    api.delete<any, ApiResponse<{ message: string }>>(`/api/insights/${id}`),
};

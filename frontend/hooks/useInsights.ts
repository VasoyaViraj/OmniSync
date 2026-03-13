import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insightsService } from '@/services/insights';
import { MeetingInsight } from '@/types/meeting';

export const useMeetingInsights = (meetingId: string) => {
  return useQuery({
    queryKey: ['insights', 'meeting', meetingId],
    queryFn: async () => {
      const { data } = await insightsService.getByMeetingId(meetingId);
      return data || [];
    },
    enabled: !!meetingId,
  });
};

export const useCreateInsight = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<MeetingInsight>) => insightsService.create(data),
    onSuccess: (_, variables) => {
      if (variables.meeting_id) {
        queryClient.invalidateQueries({ queryKey: ['insights', 'meeting', variables.meeting_id] });
      }
    },
  });
};

export const useUpdateInsight = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MeetingInsight> }) =>
      insightsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
};

export const useDeleteInsight = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => insightsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
};

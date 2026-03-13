import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingsService } from '@/services/meetings';
import { MeetingCreate, MeetingUpdate } from '@/types/meeting';

export const useMeetings = () => {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const { data } = await meetingsService.getAll();
      return data || [];
    },
  });
};

export const useMeeting = (id: string) => {
  return useQuery({
    queryKey: ['meetings', id],
    queryFn: async () => {
      const { data } = await meetingsService.getById(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useEmployeeMeetings = (employeeId: string) => {
  return useQuery({
    queryKey: ['meetings', 'employee', employeeId],
    queryFn: async () => {
      const { data } = await meetingsService.getByEmployeeId(employeeId);
      return data || [];
    },
    enabled: !!employeeId,
  });
};

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MeetingCreate) => meetingsService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['meetings', 'employee', variables.employee_id] });
      // Invalidate timeline as well if needed
      queryClient.invalidateQueries({ queryKey: ['memory', 'employee', variables.employee_id] });
    },
  });
};

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MeetingUpdate }) =>
      meetingsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['meetings', variables.id] });
    },
  });
};

export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => meetingsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
};

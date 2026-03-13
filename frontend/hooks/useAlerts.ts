import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsService } from '@/services/alerts';
import { AlertCreate } from '@/types/alert';

export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data } = await alertsService.getAll();
      return data || [];
    },
  });
};

export const useEmployeeAlerts = (employeeId: string) => {
  return useQuery({
    queryKey: ['alerts', 'employee', employeeId],
    queryFn: async () => {
      const { data } = await alertsService.getByEmployeeId(employeeId);
      return data || [];
    },
    enabled: !!employeeId,
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AlertCreate) => alertsService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts', 'employee', variables.employee_id] });
    },
  });
};

export const useDeleteAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

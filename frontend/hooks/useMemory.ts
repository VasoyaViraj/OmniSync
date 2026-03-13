import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memoryService } from '@/services/memory';
import { MemoryCreate } from '@/types/memory';

export const useEmployeeTimeline = (employeeId: string) => {
  return useQuery({
    queryKey: ['memory', 'employee', employeeId],
    queryFn: async () => {
      const { data } = await memoryService.getByEmployeeId(employeeId);
      return data || [];
    },
    enabled: !!employeeId,
  });
};

export const useCreateMemory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MemoryCreate) => memoryService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['memory', 'employee', variables.employee_id] });
    },
  });
};

export const useDeleteMemory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => memoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memory'] });
    },
  });
};

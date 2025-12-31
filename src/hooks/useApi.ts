import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';

// User profile hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await apiService.getCurrentUser();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData: { name?: string; email?: string }) => {
      const response = await apiService.updateUserProfile(profileData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: {
      notificationsEnabled?: boolean;
      appLockEnabled?: boolean;
      cycleLength?: number;
    }) => {
      const response = await apiService.updateUserSettings(settings);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

// Cycle hooks
export const useCycles = () => {
  return useQuery({
    queryKey: ['cycles'],
    queryFn: async () => {
      const response = await apiService.getCycles();
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateCycle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cycleData: {
      date: string;
      phase: string;
      flow?: string;
      symptoms?: string[];
      mood?: string;
      notes?: string;
    }) => {
      const response = await apiService.createCycle(cycleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles'] });
    },
  });
};

export const useUpdateCycle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, cycleData }: {
      id: string;
      cycleData: Partial<{
        date: string;
        phase: string;
        flow: string;
        symptoms: string[];
        mood: string;
        notes: string;
      }>;
    }) => {
      const response = await apiService.updateCycle(id, cycleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles'] });
    },
  });
};

export const useDeleteCycle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.deleteCycle(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles'] });
    },
  });
};

// Analytics hooks
export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await apiService.getAnalytics();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
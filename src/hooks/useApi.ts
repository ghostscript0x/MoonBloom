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
    retry: false, // Disable retries for auth endpoints to avoid rate limiting
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
      date: string | Date;
      phase: string;
      flow?: string;
      symptoms?: string[];
      mood?: string;
      notes?: string;
      // Health tracking fields
      painIntensity?: number;
      energyLevel?: number;
      sleepQuality?: string;
      temperature?: number;
      waterIntake?: number;
      exercise?: string;
      medications?: string[];
      supplements?: string[];
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
        // Health tracking fields
        painIntensity?: number;
        energyLevel?: number;
        sleepQuality?: string;
        temperature?: number;
        waterIntake?: number;
        exercise?: string;
        medications?: string[];
        supplements?: string[];
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

export const useInsights = () => {
  return useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      try {
        const response = await apiService.getInsights();
        clearTimeout(timeoutId);
        return response.data;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - AI insights temporarily unavailable');
        }
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - insights don't change often
    retry: (failureCount, error) => {
      // Don't retry on timeout or auth errors
      if (error?.message?.includes('timeout') || error?.message?.includes('401')) {
        return false;
      }
      return failureCount < 2; // Retry up to 2 times for other errors
    },
    retryDelay: 1000, // 1 second delay between retries
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiService.deleteAccount();
      return response;
    },
  });
};
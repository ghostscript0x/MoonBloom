import { getAuthToken } from './offlineStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check for rate limiting
      if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }

      // Check for auth errors
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('bloom_auth_token');
        throw new Error('Session expired. Please log in again.');
      }

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if ((error as any).name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection.');
      }

      // Log the error message to aid debugging (non-sensitive)
      console.error('API request failed:', (error as any).message || error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request<{ success: boolean; token: string; data: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { name: string; email: string; password: string }) {
    return this.request<{ success: boolean; token: string; data: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async forgotPassword(email: string) {
    return this.request<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: { token: string; newPassword: string }) {
    return this.request<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser() {
    return this.request<{ success: boolean; data: any }>('/auth/me');
  }

  // User endpoints
  async getUserProfile() {
    return this.request<{ success: boolean; data: any }>('/users/profile');
  }

  async updateUserProfile(profileData: { name?: string; email?: string }) {
    return this.request<{ success: boolean; data: any }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateUserSettings(settings: {
    notificationsEnabled?: boolean;
    appLockEnabled?: boolean;
    cycleLength?: number;
    lastPeriodStart?: Date;
  }) {
    return this.request<{ success: boolean; data: any }>('/users/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Cycle endpoints
  async getCycles() {
    return this.request<{ success: boolean; count: number; data: any[] }>('/cycles');
  }

  async getCycle(id: string) {
    return this.request<{ success: boolean; data: any }>(`/cycles/${id}`);
  }

  async createCycle(cycleData: {
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
  }) {
    return this.request<{ success: boolean; data: any }>('/cycles', {
      method: 'POST',
      body: JSON.stringify(cycleData),
    });
  }

  async updateCycle(id: string, cycleData: Partial<{
    date: string;
    phase: string;
    flow: string;
    symptoms: string[];
    mood: string;
    notes: string;
  }>) {
    return this.request<{ success: boolean; data: any }>(`/cycles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cycleData),
    });
  }

  async deleteCycle(id: string) {
    return this.request<{ success: boolean; data: {} }>(`/cycles/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics endpoints
  async getAnalytics() {
    return this.request<{ success: boolean; data: any }>('/analytics');
  }

  async getInsights() {
    return this.request<{ success: boolean; data: any }>('/analytics/insights');
  }

  async deleteAccount() {
    return this.request<{ success: boolean; message: string }>('/users', {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);
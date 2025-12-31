import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '../lib/api';
import { saveAuthToken, getAuthToken, removeAuthToken } from '../lib/offlineStorage';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  cycleLength?: number;
  periodLength?: number;
  lastPeriodStart?: Date;
  notificationsEnabled?: boolean;
  appLockEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();

      if (token) {
        try {
          console.log('Verifying stored token...');

          // Get fresh user data from backend
          const response = await apiService.getCurrentUser();
          const backendUser = response.data;

          console.log('Backend user data:', backendUser);

          setUser({
            ...backendUser,
            lastPeriodStart: backendUser.lastPeriodStart ? new Date(backendUser.lastPeriodStart) : undefined,
          });
        } catch (error: any) {
          console.log('Token invalid or user not found, logging out:', error.message);
          // Token invalid or user not found, clear stored data and log out
          logout();
          // Force redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } else {
        console.log('No stored token');
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.login({ email, password });
      const { token, data: userData } = response;

      saveAuthToken(token);

      setUser({
        ...userData,
        lastPeriodStart: userData.lastPeriodStart ? new Date(userData.lastPeriodStart) : undefined,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.register({ name, email, password });
      const { token, data: userData } = response;

      saveAuthToken(token);

      setUser({
        ...userData,
        lastPeriodStart: userData.lastPeriodStart ? new Date(userData.lastPeriodStart) : undefined,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ otp }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }

    // Update user as verified
    if (user) {
      const updatedUser = { ...user, emailVerified: true };
      setUser(updatedUser);
    }
  };

  const resendOTP = async () => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to resend OTP');
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
// Simple authentication storage - only for JWT tokens
export const saveAuthToken = (token: string): void => {
  localStorage.setItem('bloom_auth_token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('bloom_auth_token');
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('bloom_auth_token');
};

// Theme storage
export const saveTheme = (theme: 'light' | 'dark' | 'system'): void => {
  localStorage.setItem('bloom_theme', theme);
};

export const getTheme = (): 'light' | 'dark' | 'system' => {
  return (localStorage.getItem('bloom_theme') as 'light' | 'dark' | 'system') || 'system';
};

// Clear all auth data
export const clearAuthData = (): void => {
  removeAuthToken();
};
// Offline-first storage utilities
// Uses localStorage as a simple mock for IndexedDB behavior

const STORAGE_KEYS = {
  USER: 'bloom_user',
  MOOD_LOGS: 'bloom_mood_logs',
  SYMPTOM_LOGS: 'bloom_symptom_logs',
  PERIOD_LOGS: 'bloom_period_logs',
  SYNC_STATUS: 'bloom_sync_status',
  ONBOARDING_COMPLETE: 'bloom_onboarding_complete',
  AUTH_TOKEN: 'bloom_auth_token',
};

export interface SyncStatus {
  lastSynced: Date | null;
  pendingChanges: number;
  isOnline: boolean;
}

// Check if we're online
export const checkOnlineStatus = (): boolean => {
  return navigator.onLine;
};

// Simple encryption for sensitive data
const encrypt = (text: string): string => {
  try {
    // Use a simple XOR encryption with a fixed key for demo
    // In production, use proper encryption like AES
    const key = 'moonbloom_secret_key';
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result); // Base64 encode
  } catch {
    return text; // Fallback to plain text
  }
};

const decrypt = (encryptedText: string): string => {
  try {
    const decoded = atob(encryptedText); // Base64 decode
    const key = 'moonbloom_secret_key';
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch {
    return encryptedText; // Fallback to encrypted text
  }
};

// Sensitive keys that should be encrypted
const SENSITIVE_KEYS = [STORAGE_KEYS.AUTH_TOKEN];

// Save data locally with encryption for sensitive data
export const saveLocally = <T>(key: string, data: T): void => {
  try {
    let dataToStore = JSON.stringify(data);

    // Encrypt sensitive data
    if (SENSITIVE_KEYS.includes(key)) {
      dataToStore = encrypt(dataToStore);
    }

    localStorage.setItem(key, dataToStore);
    updatePendingChanges(1);
  } catch (error) {
    console.error('Failed to save locally:', error);
  }
};

// Get data from local storage with decryption for sensitive data
export const getLocally = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;

    let parsedData: string;
    if (SENSITIVE_KEYS.includes(key)) {
      parsedData = decrypt(data);
    } else {
      parsedData = data;
    }

    return JSON.parse(parsedData);
  } catch (error) {
    console.error('Failed to get local data:', error);
    return null;
  }
};

// Remove data from local storage
export const removeLocally = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove local data:', error);
  }
};

// Update pending changes count
const updatePendingChanges = (delta: number): void => {
  const status = getSyncStatus();
  status.pendingChanges = Math.max(0, status.pendingChanges + delta);
  localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify(status));
};

// Get sync status
export const getSyncStatus = (): SyncStatus => {
  const stored = localStorage.getItem(STORAGE_KEYS.SYNC_STATUS);
  if (stored) {
    const status = JSON.parse(stored);
    return {
      ...status,
      lastSynced: status.lastSynced ? new Date(status.lastSynced) : null,
      isOnline: checkOnlineStatus(),
    };
  }
  return {
    lastSynced: null,
    pendingChanges: 0,
    isOnline: checkOnlineStatus(),
  };
};

// Mock sync function (would connect to real backend)
export const syncWithServer = async (): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!checkOnlineStatus()) {
    return false;
  }
  
  // Mock successful sync
  const status: SyncStatus = {
    lastSynced: new Date(),
    pendingChanges: 0,
    isOnline: true,
  };
  localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify(status));
  
  return true;
};

// User storage
export const saveUser = (user: any): void => saveLocally(STORAGE_KEYS.USER, user);
export const getUser = (): any => getLocally(STORAGE_KEYS.USER);
export const removeUser = (): void => removeLocally(STORAGE_KEYS.USER);

// Mood logs storage
export const saveMoodLogs = (logs: any[]): void => saveLocally(STORAGE_KEYS.MOOD_LOGS, logs);
export const getMoodLogs = (): any[] => getLocally(STORAGE_KEYS.MOOD_LOGS) || [];

// Symptom logs storage
export const saveSymptomLogs = (logs: any[]): void => saveLocally(STORAGE_KEYS.SYMPTOM_LOGS, logs);
export const getSymptomLogs = (): any[] => getLocally(STORAGE_KEYS.SYMPTOM_LOGS) || [];

// Period logs storage
export const savePeriodLogs = (logs: any[]): void => saveLocally(STORAGE_KEYS.PERIOD_LOGS, logs);
export const getPeriodLogs = (): any[] => getLocally(STORAGE_KEYS.PERIOD_LOGS) || [];

// Onboarding status
export const setOnboardingComplete = (complete: boolean): void => {
  saveLocally(STORAGE_KEYS.ONBOARDING_COMPLETE, complete);
};
export const isOnboardingComplete = (): boolean => {
  return getLocally(STORAGE_KEYS.ONBOARDING_COMPLETE) || false;
};

// Auth token
export const saveAuthToken = (token: string): void => saveLocally(STORAGE_KEYS.AUTH_TOKEN, token);
export const getAuthToken = (): string | null => getLocally(STORAGE_KEYS.AUTH_TOKEN);
export const removeAuthToken = (): void => removeLocally(STORAGE_KEYS.AUTH_TOKEN);

// Export all data as JSON
export const exportData = (): string => {
  const data = {
    user: getUser(),
    moodLogs: getMoodLogs(),
    symptomLogs: getSymptomLogs(),
    periodLogs: getPeriodLogs(),
    syncStatus: getSyncStatus(),
    exportDate: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
};

// Clear all data (for logout or delete account)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

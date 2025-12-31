# API Documentation

## Overview

Moon Bloom Tracker uses a hybrid architecture combining local storage with optional cloud synchronization. This document outlines the internal API structure and data models.

## Architecture

### Storage Strategy
- **Primary**: IndexedDB for local storage
- **Secondary**: Optional cloud sync via REST API
- **Offline-First**: All core functionality works offline

### Data Flow
```
User Input → Validation → Local Storage → Optional Cloud Sync → Analytics
```

## Data Models

### User Profile
```typescript
interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  cycleLength: number; // 21-45 days
  periodLength: number; // 3-7 days
  lastPeriodStart: Date;
  notificationsEnabled: boolean;
  appLockEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Period Entry
```typescript
interface PeriodEntry {
  id: string;
  userId: string;
  date: Date;
  flow: 'light' | 'medium' | 'heavy';
  symptoms: string[];
  notes?: string;
  createdAt: Date;
}
```

### Mood Entry
```typescript
interface MoodEntry {
  id: string;
  userId: string;
  date: Date;
  mood: 1 | 2 | 3 | 4 | 5; // 1=Very Low, 5=Very High
  energy: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  createdAt: Date;
}
```

### Cycle Prediction
```typescript
interface CyclePrediction {
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  ovulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  confidence: number; // 0-100
  basedOnCycles: number;
}
```

## Core Functions

### Cycle Calculations

#### Predict Next Period
```typescript
function predictNextPeriod(
  lastPeriodStart: Date,
  cycleLength: number,
  historicalCycles: PeriodEntry[]
): CyclePrediction
```

**Parameters:**
- `lastPeriodStart`: Date of last period start
- `cycleLength`: Average cycle length in days
- `historicalCycles`: Array of past period entries

**Returns:** CyclePrediction object with dates and confidence

#### Calculate Cycle Phase
```typescript
function getCurrentCyclePhase(
  lastPeriodStart: Date,
  cycleLength: number,
  today: Date = new Date()
): 'menstrual' | 'follicular' | 'ovulation' | 'luteal'
```

**Parameters:**
- `lastPeriodStart`: Date of last period start
- `cycleLength`: Average cycle length in days
- `today`: Current date (defaults to today)

**Returns:** Current cycle phase string

### Data Management

#### Save Local Data
```typescript
function saveLocally<T>(key: string, data: T): void
```

**Parameters:**
- `key`: Storage key (e.g., 'user_profile', 'period_logs')
- `data`: Data to store (must be JSON serializable)

#### Load Local Data
```typescript
function getLocally<T>(key: string): T | null
```

**Parameters:**
- `key`: Storage key

**Returns:** Stored data or null if not found

#### Export All Data
```typescript
function exportData(): string
```

**Returns:** JSON string containing all user data

## Hooks API

### useUserProfile
```typescript
const { data: userProfile, isLoading, error } = useUserProfile();
```

**Returns:**
- `data`: UserProfile object
- `isLoading`: Boolean loading state
- `error`: Error object if request failed

### useCycles
```typescript
const { data: cycles, isLoading, error } = useCycles();
```

**Returns:**
- `data`: Array of PeriodEntry objects
- `isLoading`: Boolean loading state
- `error`: Error object if request failed

### useAnalytics
```typescript
const { data: analytics, isLoading, error } = useAnalytics();
```

**Returns:**
- `data`: Analytics object with trends and insights
- `isLoading`: Boolean loading state
- `error`: Error object if request failed

## Storage Keys

```typescript
const STORAGE_KEYS = {
  USER: 'bloom_user',
  MOOD_LOGS: 'bloom_mood_logs',
  SYMPTOM_LOGS: 'bloom_symptom_logs',
  PERIOD_LOGS: 'bloom_period_logs',
  SYNC_STATUS: 'bloom_sync_status',
  ONBOARDING_COMPLETE: 'bloom_onboarding_complete',
  AUTH_TOKEN: 'bloom_auth_token',
} as const;
```

## Error Handling

### Common Error Types
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Error Codes
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  SYNC_ERROR: 'SYNC_ERROR',
} as const;
```

## Security

### Data Encryption
- All sensitive data encrypted with AES-256
- Encryption keys derived from user PIN/biometric
- End-to-end encryption for cloud sync

### Authentication
- JWT tokens for API authentication
- Biometric/PIN for local app access
- Secure token storage and refresh

## Performance

### Optimization Strategies
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive calculations cached
- **Background Sync**: Non-blocking data synchronization
- **IndexedDB**: Fast local queries

### Bundle Analysis
- Core bundle: ~150KB gzipped
- Vendor libraries: ~350KB gzipped
- Total: ~500KB (under 1MB target)

## Testing

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## Deployment

### Build Process
```bash
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
```

### Environment Variables
```env
VITE_API_URL=https://api.moonbloomtracker.com
VITE_APP_VERSION=1.0.0
VITE_SENTRY_DSN=your_sentry_dsn
```

## Monitoring

### Analytics
- User engagement tracking
- Error reporting via Sentry
- Performance monitoring
- Privacy-compliant analytics

### Logging
- Structured logging with levels
- Error tracking and alerting
- Performance metrics collection

---

For more technical details, see the source code in the `src/` directory.
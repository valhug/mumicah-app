// Common types used across the ecosystem
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  preferredLanguages: string[];
  nativeLanguage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EcosystemApp {
  id: string;
  name: 'conversate' | 'devmentor' | 'contentflow';
  displayName: string;
  description: string;
  icon: string;
  color: string;
}

export const ECOSYSTEM_APPS: EcosystemApp[] = [
  {
    id: 'conversate',
    name: 'conversate',
    displayName: 'Conversate',
    description: 'Learn languages through AI conversations',
    icon: '🗣️',
    color: '#3B82F6',
  },
  {
    id: 'devmentor',
    name: 'devmentor',
    displayName: 'DevMentor',
    description: 'Master software engineering skills',
    icon: '💻',
    color: '#10B981',
  },
  {
    id: 'contentflow',
    name: 'contentflow',
    displayName: 'ContentFlow',
    description: 'Create and share multilingual content',
    icon: '📝',
    color: '#F59E0B',
  },
];

// Learning progress shared across apps
export interface LearningProgress {
  userId: string;
  appId: string;
  level: number;
  xp: number;
  streakDays: number;
  lastActiveDate: Date;
}

// Common API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Re-export all shared modules
export * from './utils'
export * from './validations'
export * from './constants'
export * from './database'

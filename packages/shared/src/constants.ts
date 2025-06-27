// Application constants
export const APP_NAME = 'Mumicah'
export const APP_VERSION = '1.0.0'

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
] as const

// Learning levels
export const LEARNING_LEVELS = [
  { level: 1, name: 'Beginner', xpRequired: 0 },
  { level: 2, name: 'Elementary', xpRequired: 100 },
  { level: 3, name: 'Intermediate', xpRequired: 300 },
  { level: 4, name: 'Upper Intermediate', xpRequired: 600 },
  { level: 5, name: 'Advanced', xpRequired: 1000 },
  { level: 6, name: 'Proficient', xpRequired: 1500 },
] as const

// API routes
export const API_ROUTES = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  CONVERSATIONS: '/api/conversations',
  COMMUNITIES: '/api/communities',
  PROGRESS: '/api/progress',
} as const

// Database collection names
export const COLLECTIONS = {
  USERS: 'users',
  CONVERSATIONS: 'conversations',
  COMMUNITIES: 'communities',
  POSTS: 'posts',
  ACTIVITIES: 'activities',
  NOTIFICATIONS: 'notifications',
  RESOURCES: 'resources',
  MEDIA: 'media',
} as const

// Export types
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]
export type LearningLevel = typeof LEARNING_LEVELS[number]

export const PERSONAS = [
  { id: 'mia', name: 'Mia', description: 'A friendly and patient language tutor.', color: '#3B82F6' },
  { id: 'alex', name: 'Alex', description: 'A native speaker to practice conversation with.', color: '#10B981' },
  { id: 'sara', name: 'Sara', description: 'A cultural guide to learn about traditions.', color: '#F59E0B' },
] as const;

export type Persona = typeof PERSONAS[number];

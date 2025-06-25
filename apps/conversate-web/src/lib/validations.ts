// lib/validations.ts
import { z } from 'zod'

// Post validation schemas
export const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  community_id: z.string().uuid('Invalid community ID'),
  tags: z.array(z.string()).optional(),
  media: z.array(z.object({
    url: z.string().url(),
    type: z.enum(['image', 'video', 'audio']),
    alt: z.string().optional()
  })).optional()
})

export const updatePostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  tags: z.array(z.string()).optional()
})

// Profile validation schemas
export const updateProfileSchema = z.object({
  display_name: z.string().min(1, 'Display name is required').max(50, 'Display name too long'),
  bio: z.string().max(500, 'Bio too long').optional(),
  native_language: z.string().optional(),
  learning_languages: z.array(z.string()).optional(),
  timezone: z.string().optional()
})

// Community validation schemas
export const createCommunitySchema = z.object({
  name: z.string().min(3, 'Community name must be at least 3 characters').max(100, 'Community name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description too long'),
  language: z.string().min(2, 'Language is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']),
  is_private: z.boolean().default(false),
  rules: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
})

// Message validation schemas
export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(1000, 'Message too long'),
  conversation_id: z.string().optional(),
  recipient_id: z.string().uuid().optional(),
  type: z.enum(['text', 'image', 'audio', 'file']).default('text'),
  media_url: z.string().url().optional()
}).refine(
  (data) => data.conversation_id || data.recipient_id,
  {
    message: "Either conversation_id or recipient_id must be provided",
    path: ["conversation_id"]
  }
)

// Resource validation schemas
export const createResourceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  content_type: z.enum(['video', 'audio', 'pdf', 'article', 'interactive', 'quiz', 'flashcards']),
  language: z.string().min(2, 'Language is required'),
  target_language: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  topics: z.array(z.string()),
  tags: z.array(z.string()),
  url: z.string().url().optional(),
  is_premium: z.boolean().default(false)
})

// Authentication validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
})

// Learning progress validation schemas
export const updateProgressSchema = z.object({
  lesson_id: z.string().uuid('Invalid lesson ID'),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  score: z.number().min(0).max(100).optional(),
  time_spent: z.number().min(0).optional()
})

// Search validation schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  type: z.enum(['communities', 'posts', 'users', 'resources']).optional(),
  language: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20)
})

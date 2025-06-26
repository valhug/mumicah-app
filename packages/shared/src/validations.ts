import { z } from "zod"

// Common validation schemas
export const emailSchema = z.string().email("Invalid email address")

export const userSchema = z.object({
  id: z.string(),
  email: emailSchema,
  name: z.string().optional(),
  avatar: z.string().url().optional(),
  preferredLanguages: z.array(z.string()).default([]),
  nativeLanguage: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const learningProgressSchema = z.object({
  userId: z.string(),
  appId: z.string(),
  level: z.number().min(0),
  xp: z.number().min(0),
  streakDays: z.number().min(0),
  lastActiveDate: z.date(),
})

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

// Export types
export type User = z.infer<typeof userSchema>
export type LearningProgress = z.infer<typeof learningProgressSchema>
export type ApiResponse<T = any> = z.infer<typeof apiResponseSchema> & { data?: T }
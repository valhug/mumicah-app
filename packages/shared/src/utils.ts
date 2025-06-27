// Common utility functions shared across the Mumicah ecosystem

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines CSS classes using clsx and tailwind-merge
 * Useful for conditional styling and Tailwind class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a full name from first and last name parts
 */
export function formatFullName(firstName?: string, lastName?: string): string {
  return `${firstName || ''} ${lastName || ''}`.trim() || 'User'
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Format a number as a compact string (1.2k, 1.5M, etc.)
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return Math.floor(num / 100000) / 10 + 'M'
  }
  if (num >= 1000) {
    return Math.floor(num / 100) / 10 + 'k'
  }
  return num.toString()
}

/**
 * Generate a random ID string
 */
export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2) + Date.now().toString(36)
  return prefix ? `${prefix}_${id}` : id
}

/**
 * Safe JSON parse that returns null on error
 */
export function safeJsonParse<T = any>(str: string): T | null {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

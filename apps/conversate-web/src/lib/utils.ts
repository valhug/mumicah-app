import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export shared utilities for backwards compatibility
export { formatFullName, capitalize, formatCompactNumber, generateId, safeJsonParse, debounce, sleep } from '@mumicah/shared'

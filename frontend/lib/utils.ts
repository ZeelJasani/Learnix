// ============================================================================
// Learnix LMS - Utility Functions (ઉપયોગિતા ફંક્શન્સ)
// ============================================================================
// Aa file general utility functions provide kare chhe.
// This file provides general utility functions.
// ============================================================================

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Tailwind CSS class merge utility / Tailwind CSS class merge utility
// clsx conditional classes handle kare chhe, twMerge conflicts resolve kare chhe
// clsx handles conditional classes, twMerge resolves conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
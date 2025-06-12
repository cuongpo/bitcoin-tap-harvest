
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Polyfill for crypto.randomUUID for mobile browsers
export function generateUUID(): string {
  // Check if crypto.randomUUID is available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (error) {
      // Fall back to manual generation if crypto.randomUUID fails
    }
  }

  // Fallback UUID generation for mobile browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function formatNumber(value: number): string {
  if (value === 0) return '0';
  
  if (value < 1000) {
    return value.toFixed(value < 10 ? 1 : 0);
  }

  const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];
  const tier = Math.floor(Math.log10(value) / 3);
  
  if (tier >= units.length) {
    return value.toExponential(2);
  }
  
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;
  
  return scaled.toFixed(scaled < 10 ? 1 : 0) + units[tier];
}

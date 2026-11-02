import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple CSS class values cleanly, resolving conditional classes with `clsx`
 * and deduplicating Tailwind CSS conflicts with `tailwind-merge`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for combining Tailwind CSS classes with conditional logic and conflict resolution.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

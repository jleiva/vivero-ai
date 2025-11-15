/**
 * Date utility functions for local timezone handling
 */

/**
 * Get today's date in YYYY-MM-DD format using local timezone
 */
export function getTodayLocal(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a date to YYYY-MM-DD in local timezone
 */
export function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get tomorrow's date in YYYY-MM-DD format using local timezone
 */
export function getTomorrowLocal(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateLocal(tomorrow);
}

/**
 * Get date N days from now in local timezone
 */
export function getDateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDateLocal(date);
}

/**
 * Check if a date string is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayLocal();
}

/**
 * Check if a date string is tomorrow
 */
export function isTomorrow(dateString: string): boolean {
  return dateString === getTomorrowLocal();
}

/**
 * Check if a date string is in the past
 */
export function isPast(dateString: string): boolean {
  return dateString < getTodayLocal();
}

/**
 * Check if a date string is in the future
 */
export function isFuture(dateString: string): boolean {
  return dateString > getTodayLocal();
}
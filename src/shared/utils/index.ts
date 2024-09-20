import { SUPPORTED_IMAGE_FORMATS } from 'src/shared/constants/index';
import { v4 as uuidv4 } from 'uuid';
import { format as formatDateFns } from 'date-fns';

export function formatCurrency(amount: number, currencyCode: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });
  return formatter.format(amount);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function generateUniqueId(): string {
  return uuidv4();
}

export function debounce<F extends (...args: any[]) => any>(func: F, wait: number): (...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<F>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<F extends (...args: any[]) => any>(func: F, wait: number): (...args: Parameters<F>) => void {
  let lastCall = 0;
  return (...args: Parameters<F>) => {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      func(...args);
    }
  };
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function formatDate(date: Date | string, format: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDateFns(dateObj, format);
}

export function calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
  const discountAmount = originalPrice * (discountPercentage / 100);
  return Number((originalPrice - discountAmount).toFixed(2));
}

export function isValidImageFormat(fileExtension: string): boolean {
  return SUPPORTED_IMAGE_FORMATS.includes(fileExtension.toLowerCase());
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
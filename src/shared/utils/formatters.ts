import dayjs from 'dayjs';
import { Currency } from 'src/shared/types/index';

export const formatCurrency = (amount: number, currency: Currency): string => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(amount);
};

export const formatDate = (date: string | Date, format: string): string => {
  return dayjs(date).format(format);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength - 3) + '...';
  }
  return text;
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  return phoneNumber;
};

export const capitalizeFirstLetter = (str: string): string => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
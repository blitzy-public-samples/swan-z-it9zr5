import { z } from 'zod';

export const validateEmail = (email: string): boolean => {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  const passwordSchema = z.string()
    .min(12)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/);
  return passwordSchema.safeParse(password).success;
};

export const validateUsername = (username: string): boolean => {
  const usernameSchema = z.string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9]+$/);
  return usernameSchema.safeParse(username).success;
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneSchema = z.string()
    .regex(/^\+?[1-9]\d{1,14}$/); // E.164 format
  return phoneSchema.safeParse(phoneNumber).success;
};

export const validateProductName = (productName: string): boolean => {
  const productNameSchema = z.string()
    .min(1)
    .max(100);
  return productNameSchema.safeParse(productName).success;
};

export const validatePrice = (price: number): boolean => {
  const priceSchema = z.number()
    .positive()
    .multipleOf(0.01);
  return priceSchema.safeParse(price).success;
};

export const validateDesignName = (designName: string): boolean => {
  const designNameSchema = z.string()
    .min(1)
    .max(50);
  return designNameSchema.safeParse(designName).success;
};
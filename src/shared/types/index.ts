// This file contains shared TypeScript type definitions used across the Swan-Z Style App.
// It defines interfaces and types for common data structures, API responses, and application state.

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  styleProfile: StyleProfile | null;
}

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  images: string[];
  styleLineId: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  items: CartItem[];
}

export interface CustomDesign {
  id: string;
  userId: string;
  productId: string;
  designParameters: object;
  previewUrl: string;
  createdAt: Date;
}

export interface StyleProfile {
  id: string;
  userId: string;
  quizResponses: object;
  preferences: StylePreference[];
}

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface CartItem {
  productId: string;
  quantity: number;
  customDesignId: string | null;
  unitPrice: number;
}

export interface StylePreference {
  styleLineId: string;
  preferenceScore: number;
}
// API Configuration
export const API_BASE_URL = 'https://api.swan-z-style.com/v1';
export const AUTH_TOKEN_KEY = 'swan_z_auth_token';

// File Upload Configuration
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];

// Pagination
export const PAGINATION_LIMIT = 20;

// Color Palette
export const COLOR_PALETTE = {
  primary: '#4A90E2',
  secondary: '#50E3C2',
  accent: '#F5A623',
  background: '#F8F8F8',
  text: '#333333',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action. Please log in and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  INVALID_INPUT: 'Please check your input and try again.',
};

// Enums
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum StyleLines {
  CASUAL = 'CASUAL',
  FORMAL = 'FORMAL',
  SPORTY = 'SPORTY',
  BOHEMIAN = 'BOHEMIAN',
  VINTAGE = 'VINTAGE',
  MINIMALIST = 'MINIMALIST',
}

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DESIGNER = 'DESIGNER',
}

// Add more constants and enums as needed for the Swan-Z Style App
import { api } from 'src/mobile/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_KEY } from 'src/shared/constants/index';
import { User, ApiResponse } from 'src/shared/types/index';

export const login = async (email: string, password: string): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>('/auth/login', { email, password });
    if (response.data.success) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.data.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error('Login failed. Please check your credentials and try again.');
  }
};

export const register = async (userData: object): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>('/auth/register', userData);
    if (response.data.success) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.data.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error('Registration failed. Please try again.');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    // Clear any cached user data here if necessary
  } catch (error) {
    console.error('Logout failed:', error);
    // Even if the API call fails, we should still remove the local token
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const getCurrentUser = async (): Promise<ApiResponse<User | null>> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      return { success: false, data: null };
    }
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return { success: false, data: null };
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

// TODO: Implement token refresh mechanism
// TODO: Add support for social media authentication
// TODO: Implement proper error handling for network issues
// TODO: Add two-factor authentication support
// TODO: Implement secure storage for sensitive user data
// TODO: Add support for password reset functionality
// TODO: Implement proper logging for authentication events
// TODO: Add unit tests for all authentication functions
// TODO: Implement rate limiting for login attempts
// TODO: Add support for device management
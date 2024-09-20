import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from 'src/shared/constants';
import { User } from 'src/shared/types';

const AUTH_TOKEN_KEY = 'auth_token';

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    const { token, user } = response.data;
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    return user;
  } catch (error) {
    // TODO: Implement proper error handling for network issues or invalid credentials
    console.error('Login failed:', error);
    throw error;
  }
};

export const register = async (email: string, password: string, name: string): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, { email, password, name });
    return response.data;
  } catch (error) {
    // TODO: Implement proper error handling
    console.error('Registration failed:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    // TODO: Clear any user-related data from the app's state
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  return !!token;
  // TODO: Implement token expiration check
};

// TODO: Implement social media authentication (OAuth) integration
// TODO: Add two-factor authentication support
// TODO: Implement secure token storage for iOS using Keychain and for Android using Secure Shared Preferences
// TODO: Set up proper error handling and user-friendly error messages for authentication failures
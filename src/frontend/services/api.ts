import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from 'src/shared/constants';
import { ApiResponse } from 'src/shared/types';

const api = axios.create({ baseURL: API_BASE_URL });

export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const handleApiError = (error: AxiosError): never => {
  const status = error.response?.status;
  const errorData = error.response?.data;
  throw new Error(`API Error ${status}: ${JSON.stringify(errorData)}`);
};

export const get = async <T>(endpoint: string, params?: object): Promise<ApiResponse<T>> => {
  try {
    const response = await api.get<ApiResponse<T>>(endpoint, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

export const post = async <T>(endpoint: string, data: object): Promise<ApiResponse<T>> => {
  try {
    const response = await api.post<ApiResponse<T>>(endpoint, data);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

export const put = async <T>(endpoint: string, data: object): Promise<ApiResponse<T>> => {
  try {
    const response = await api.put<ApiResponse<T>>(endpoint, data);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

export const del = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  try {
    const response = await api.delete<ApiResponse<T>>(endpoint);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

// Initialize auth token from AsyncStorage
AsyncStorage.getItem('authToken').then((token) => {
  if (token) {
    setAuthToken(token);
  }
});

export default {
  setAuthToken,
  get,
  post,
  put,
  delete: del,
};
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from 'src/shared/constants/index';

export const setItem = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
};

export const getItem = async (key: string): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

export const clear = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

export const setUserToken = async (token: string): Promise<void> => {
  await setItem(StorageKeys.USER_TOKEN, token);
};

export const getUserToken = async (): Promise<string | null> => {
  return await getItem(StorageKeys.USER_TOKEN);
};

export const removeUserToken = async (): Promise<void> => {
  await removeItem(StorageKeys.USER_TOKEN);
};
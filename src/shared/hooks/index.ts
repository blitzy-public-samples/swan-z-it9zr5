import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from 'src/shared/constants/index';
import { ApiResponse } from 'src/shared/types/index';
import { debounce } from 'src/shared/utils/index';

export const useApi = <T>(endpoint: string, options?: object) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<T>>(`${API_BASE_URL}${endpoint}`, options);
      setData(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
};

export const useForm = <T extends object>(initialValues: T, validateFunction: (values: T) => Partial<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prevValues => ({ ...prevValues, [name]: value }));
  }, []);

  const handleSubmit = useCallback((onSubmit: (values: T) => void) => {
    return (event: React.FormEvent) => {
      event.preventDefault();
      const validationErrors = validateFunction(values);
      if (Object.keys(validationErrors).length === 0) {
        onSubmit(values);
      } else {
        setErrors(validationErrors);
      }
    };
  }, [values, validateFunction]);

  return { values, errors, handleChange, handleSubmit };
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedValue(value);
    }, delay);

    handler();

    return () => {
      handler.cancel();
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const useInfiniteScroll = (loadMore: () => void, hasMore: boolean) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true);
          loadMore();
          setLoading(false);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return { loading, error, lastElementRef };
};
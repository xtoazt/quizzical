
"use client";

import { useState, useEffect, useCallback } from 'react';

// Helper to get initial value, ensures it runs only on client or returns initialValue
function getStoredValue<T>(key: string, initialValue: T | (() => T)): T {
  if (typeof window === 'undefined') {
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch (e) {
        console.warn(`Error parsing localStorage key "${key}", using initial value.`);
        return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
      }
    }
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getStoredValue(key, initialValue);
  });

  // Effect to update storedValue if the key or initialValue prop changes.
  // This is useful if the hook is used with dynamic keys or initialValues that might change post-mount.
  useEffect(() => {
    setStoredValue(getStoredValue(key, initialValue));
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue] // Add storedValue to dependencies
  );

  return [storedValue, setValue] as const;
}

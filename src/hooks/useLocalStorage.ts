"use client";

import { useState, useEffect, useCallback } from 'react';

function getInitialValue<T>(key: string, initialValue: T | (() => T)): T {
  if (typeof window === 'undefined') {
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch (e) {
        // If JSON.parse fails, it might be a plain string or corrupted data.
        // Fallback to initialValue or the item itself if it's a string and T is string.
        // This part might need adjustment based on expected types.
        console.warn(`Error parsing localStorage key "${key}", returning initial value.`);
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
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    // Effect to sync with localStorage after mount on client-side
    // This avoids hydration mismatch if server renders initialValue but localStorage has a different value
    setStoredValue(getInitialValue(key, initialValue));
  }, [key, initialValue]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(getInitialValue(key, initialValue)) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue] as const;
}

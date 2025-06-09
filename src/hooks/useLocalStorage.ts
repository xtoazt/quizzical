
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

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

export function useLocalStorage<T>(key: string, initialValueProp: T | (() => T)) {
  // Use a ref to hold the initialValueProp. This helps stabilize its identity
  // if it's a non-primitive literal passed to the hook, preventing unnecessary
  // effect re-runs if the parent component re-renders.
  const initialValueRef = useRef(initialValueProp);

  const [storedValue, setStoredValue] = useState<T>(() => {
    return getStoredValue(key, initialValueRef.current);
  });

  // Effect to update storedValue if the `key` prop changes.
  useEffect(() => {
    setStoredValue(getStoredValue(key, initialValueRef.current));
  }, [key]);


  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Use the functional update form of setStoredValue to ensure we're working with the latest state.
        setStoredValue(currentStoredValue => {
          const valueToStore = value instanceof Function ? value(currentStoredValue) : value;
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            // Note: Native 'storage' events are not fired for the same document that made the change.
            // If same-document sync is needed between multiple instances of this hook for the same key,
            // a custom event system or a shared state (like Zustand/Redux) would be more robust.
            // For cross-tab sync, the browser's native 'storage' event (handled below) is sufficient.
          }
          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key] // `setStoredValue` from useState is stable. `key` is primitive. `setValue` is now stable.
  );

  // Effect to listen to actual 'storage' events from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === localStorage) {
        try {
          if (event.newValue === null) { // Item was deleted from localStorage
            setStoredValue(initialValueRef.current instanceof Function ? initialValueRef.current() : initialValueRef.current);
          } else {
            setStoredValue(JSON.parse(event.newValue));
          }
        } catch (e) {
          console.warn(`Error parsing stored value for ${key} from storage event:`, e);
          // Fallback to initial value on parsing error
          setStoredValue(initialValueRef.current instanceof Function ? initialValueRef.current() : initialValueRef.current);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]); // initialValueRef.current is stable for the hook instance's lifetime.

  return [storedValue, setValue] as const;
}

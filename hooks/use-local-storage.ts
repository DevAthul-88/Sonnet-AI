import { useEffect, useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    // Retrieve from localStorage
    const item = window.localStorage.getItem(key);
    if (item !== null) {
      try {
        setStoredValue(JSON.parse(item));
      } catch (error) {
        // If the item is not a valid JSON string, use the initial value
        setStoredValue(initialValue);
      }
    }
  }, [key, initialValue]);

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value);
    // Save to localStorage
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
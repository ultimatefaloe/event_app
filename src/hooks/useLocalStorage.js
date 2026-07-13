import { useState } from "react";
import { getItem, setItem } from "../utils/localStorage.util";

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() =>
    getItem(key, initialValue)
  );

  const setValue = (value) => {
    const valueToStore =
      value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    setItem(key, valueToStore);
  };

  return [storedValue, setValue];
};

export default useLocalStorage;

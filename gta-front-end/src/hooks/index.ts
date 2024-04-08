import { useEffect, useState } from "react";

export const useDebounce = (text: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(text);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(text);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [text]);

  return debouncedValue;
};

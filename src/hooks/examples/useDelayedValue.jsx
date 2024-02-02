import { useEffect, useState } from "react";

export function useDelayedValue(value, delay = 100) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDelayedValue(value);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);

  return delayedValue;
}

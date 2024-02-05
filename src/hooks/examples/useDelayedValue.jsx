import { useDeferredValue, useEffect, useState } from "react";

export function useDelayedValue(value, delay = 100) {
  const deferredValue = useDeferredValue(value);

  const [delayedValue, setDelayedValue] = useState(deferredValue);

  useEffect(() => {
    const id = setTimeout(() => {
      setDelayedValue(deferredValue);
    }, delay);

    return () => clearTimeout(id);
  }, [deferredValue, delay]);

  return delayedValue;
}

import { startTransition, useCallback, useState } from "react";

import { useDelayedValue } from "./examples/useDelayedValue";

export const useResponsiveState = (initialValue) => {
  const [value, valueSetter] = useState(initialValue);

  const setValue = useCallback(
    (param) => startTransition(() => valueSetter(param)),
    []
  );

  const delayedValue = useDelayedValue(value);

  const isLoading = value !== delayedValue;

  return [value, setValue, delayedValue, isLoading];
};

import { useTransition, useCallback, useState } from "react";

export function useNonBlockingState(initialState) {
  const [state, setState] = useState(initialState);

  const [isPending, startTransition] = useTransition();

  const updateState = useCallback(
    (argument) => startTransition(() => setState(argument)),
    []
  );

  return [state, updateState, isPending];
}

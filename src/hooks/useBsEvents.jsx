import { startTransition, useCallback, useState } from "react";

import { useWindowListener } from "./examples/useWindowListener";

export const useBsEvents = ({ bsComponent = `collapse`, ref }) => {
  const [currentEvent, setCurrentEvent] = useState();

  const state = currentEvent?.type.split(".")[0];

  const eventHandler = useCallback(
    (event) =>
      event.target === ref.current &&
      startTransition(() => setCurrentEvent(event)),
    [ref]
  );

  useWindowListener(`show.bs.${bsComponent}`, eventHandler);
  useWindowListener(`hide.bs.${bsComponent}`, eventHandler);
  useWindowListener(`shown.bs.${bsComponent}`, eventHandler);
  useWindowListener(`hidden.bs.${bsComponent}`, eventHandler);

  return state;
};

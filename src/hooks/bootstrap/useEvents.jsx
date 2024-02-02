import { startTransition, useCallback, useState } from "react";

import { useWindowListener } from "../examples/useWindowListener";

export const useEvents = ({ component, ref }) => {
  const [event, setEvent] = useState();

  const eventHandler = useCallback(
    (thisEvent) =>
      thisEvent.target === ref.current &&
      startTransition(() => setEvent(thisEvent)),
    [ref]
  );

  useWindowListener(`show.bs.${component}`, eventHandler);
  useWindowListener(`hide.bs.${component}`, eventHandler);
  useWindowListener(`shown.bs.${component}`, eventHandler);
  useWindowListener(`hidden.bs.${component}`, eventHandler);

  const state = event?.type.split(".")[0];

  return state;
};

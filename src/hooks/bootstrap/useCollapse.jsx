import { Collapse as BootstrapCollapse } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useCallback, useEffect, useRef } from "react";

import { useEvents } from "./useEvents";

export const useCollapse = ({ parentRef, toggle }) => {
  const collapseRef = useRef();

  useEffect(() => {
    const options = { parent: parentRef.current, toggle };

    const bsCollapse = new BootstrapCollapse(collapseRef.current, options);

    return () => {
      bsCollapse.dispose();
    };
  }, [parentRef, toggle]);

  const toggler = useCallback(
    () => BootstrapCollapse.getInstance(collapseRef.current).toggle(),
    []
  );

  const state = useEvents({
    component: "collapse",
    ref: collapseRef,
  });

  const collapsed = !["shown", "show"].includes(state);

  return { ref: collapseRef, collapsed, toggler };
};

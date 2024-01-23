import { useCallback, useState, useRef } from "react";

import { useWindowListener } from "./examples/useWindowListener";

export const useBsDropdowns = () => {
  const targetsRef = useRef(null);

  const getTargetsMap = useCallback(() => {
    if (!targetsRef.current) {
      // Initialize the Map on first usage.
      targetsRef.current = new Map();
    }

    return targetsRef.current;
  }, []);

  const targetStorer = useCallback(
    (name, target) => {
      const map = getTargetsMap();

      if (target) {
        // Add to the Map
        map.set(name, target);
      } else {
        // Remove from the Map
        map.delete(name);
      }
    },
    [getTargetsMap]
  );

  const [dropdownEvents, setDropdownsEvents] = useState([]);

  const menuShownChecker = useCallback(
    (name) => {
      const map = getTargetsMap();

      const currentTarget = map.get(name);

      return dropdownEvents.find(({ target }) => target === currentTarget);
    },
    [getTargetsMap, dropdownEvents]
  );

  const handleEvent = useCallback(
    (recentEvent) => {
      const { target, type } = recentEvent;

      const targetsMap = getTargetsMap();

      const allTargets = Array.from(targetsMap.values());

      const isValidTarget = allTargets.includes(target);

      if (isValidTarget) {
        setDropdownsEvents((previousArray) => {
          const willBeHidden = type.split(".")[0] === "hidden";

          if (willBeHidden) {
            return previousArray.filter(
              ({ target: thisTarget }) => thisTarget !== target
            );
          }

          return [...previousArray, recentEvent];
        });
      }
    },
    [getTargetsMap]
  );

  useWindowListener("show.bs.dropdown", handleEvent);

  useWindowListener("shown.bs.dropdown", handleEvent);

  useWindowListener("hide.bs.dropdown", handleEvent);

  useWindowListener("hidden.bs.dropdown", handleEvent);

  return { menuShownChecker, targetStorer };
};

import { useCallback, useState, useRef } from "react";

import { useWindowListener } from "./examples/useWindowListener";

export const useBsDropdowns = () => {
  // ! will be Map of dropdown targets (dropdown buttons--dropdown button is "taSrget" in event)
  const targetsRef = useRef(null);

  // ! helper function--used to get Map from ref or initialize Map if not initialized
  const getTargetsMap = useCallback(() => {
    if (!targetsRef.current) {
      // Initialize the Map on first usage.
      targetsRef.current = new Map();
    }

    return targetsRef.current;
  }, []);

  // ! dropdown button callback ref
  // ! get targets Map, then set dropdown identifier -> dropdown target if target (node) if target attached to DOM
  const storeDropdownTarget = useCallback(
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

  // ! state used to maintain relevant dropdown events
  // ! removes events with target of currently occurring event when currently occurring event type is "hidden"
  // ! as a result, state will always only contain events for dropdowns that are still open
  // ! therefore, this state can be used to dynamically render dropdown menu descendants of only opened dropdowns
  const [dropdownEvents, setDropdownsEvents] = useState([]);

  // ! function to be used in JSX to opt in to dynamic rendering
  // ! find target by pointing to dropdown identifier in targets map
  // ! if some stored dropdown event matches found target, dropdown is open
  const checkIfDropdownShown = useCallback(
    (name) => {
      const map = getTargetsMap();

      const currentTarget = map.get(name);

      return dropdownEvents.find(({ target }) => target === currentTarget);
    },
    [getTargetsMap, dropdownEvents]
  );

  // ! handle each dropdown event that gets fired when dropdown opens and closes--implementation of logic described of dropdown events useState hook
  const handleEvent = useCallback(
    (recentEvent) => {
      const { target, type } = recentEvent;

      const targetsMap = getTargetsMap();

      const allTargets = Array.from(targetsMap.values());

      const isValidTarget = allTargets.includes(target);

      if (isValidTarget) {
        setDropdownsEvents((previousArray) => {
          const dropdownHidden = type.split(".")[0] === "hidden";

          if (dropdownHidden) {
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

  // ! listen to bootstrap events fired when a dropdown opens & closes
  useWindowListener("show.bs.dropdown", handleEvent);

  useWindowListener("shown.bs.dropdown", handleEvent);

  useWindowListener("hide.bs.dropdown", handleEvent);

  useWindowListener("hidden.bs.dropdown", handleEvent);

  // ! return dropdown button ref callback & function to opt in to dynamic rendering
  return { checkIfDropdownShown, storeDropdownTarget };
};

import { useCallback, useState, useRef } from "react";

import { useWindowListener } from "./examples/useWindowListener";

export const useBsDropdowns = () => {
  // ! will be Map of dropdown targets (dropdown buttons--dropdown button is "taSrget" in event)
  const dropdownsRef = useRef(null);

  // ! helper function--used to get Map from ref or initialize Map if not initialized
  const getDropdownsMap = useCallback(() => {
    if (!dropdownsRef.current) {
      // Initialize the Map on first usage.
      dropdownsRef.current = new Map();
    }

    return dropdownsRef.current;
  }, []);

  // ! dropdown button callback ref
  // ! get targets Map, then set dropdown identifier -> dropdown target if target (node) if target attached to DOM
  const storeDropdownById = useCallback(
    (dropdownID, dropdownButtonNode) => {
      const map = getDropdownsMap();

      if (dropdownButtonNode) {
        // Add to the Map
        map.set(dropdownID, dropdownButtonNode);
      } else {
        // Remove from the Map
        map.delete(dropdownID);
      }
    },
    [getDropdownsMap]
  );

  // ! state used to maintain relevant dropdown events
  // ! removes events with target of currently occurring event when currently occurring event type is "hidden"
  // ! as a result, state will always only contain events for dropdowns that are still open
  // ! therefore, this state can be used to dynamically render dropdown menu descendants of only opened dropdowns
  const [events, setEvents] = useState([]);

  // ! function to be used in JSX to opt in to dynamic rendering
  // ! find target by pointing to dropdown identifier in targets map
  // ! if some stored dropdown event matches found target, dropdown is open
  const isDropdownWithIdOpen = useCallback(
    (dropdownID) => {
      const map = getDropdownsMap();

      const dropdownButtonNode = map.get(dropdownID);

      return events.find(({ target }) => target === dropdownButtonNode);
    },
    [getDropdownsMap, events]
  );

  // ! handle each dropdown event that gets fired when dropdown opens and closes--implementation of logic described of dropdown events useState hook
  const handleEvent = useCallback(
    (recentEvent) => {
      const { target, type } = recentEvent;

      const dropdownsMap = getDropdownsMap();

      const dropdownButtonNodes = Array.from(dropdownsMap.values());

      const targetIsStoredNode = dropdownButtonNodes.includes(target);

      if (targetIsStoredNode) {
        setEvents((previousArray) => {
          const hiddenEventFired = type.split(".")[0] === "hidden";

          if (hiddenEventFired) {
            return previousArray.filter(
              ({ target: thisTarget }) => thisTarget !== target
            );
          }

          return [...previousArray, recentEvent];
        });
      }
    },
    [getDropdownsMap]
  );

  // ! listen to bootstrap events fired when a dropdown opens & closes
  useWindowListener("show.bs.dropdown", handleEvent);

  useWindowListener("shown.bs.dropdown", handleEvent);

  useWindowListener("hide.bs.dropdown", handleEvent);

  useWindowListener("hidden.bs.dropdown", handleEvent);

  // ! return dropdown button ref callback & function to opt in to dynamic rendering
  return { isDropdownWithIdOpen, storeDropdownById };
};

export const adjustDropdowns = ({
  defaultDropdowns,
  nextDropdowns,
  setState,
}) =>
  setState((previousDropdowns) => {
    // next dropdowns gets manipulated based on previous dropdowns
    Object.entries(previousDropdowns).forEach(([field, { search, items }]) => {
      // if a prior field also appears in current data
      if (field in nextDropdowns) {
        // is new obj in state
        const nextDropdown = nextDropdowns[field];

        // maintain prior search value
        nextDropdown.search = search;

        // for prior dropdown's items
        Object.entries(items).forEach(([value, { checked }]) => {
          // is new obj in state
          const nextItems = nextDropdown.items;

          // prior item is relevant if appears in next items due to being derived from next data
          const dataRelevance = value in nextItems;

          // is new obj in state
          // dataRelevance is dynamic; checked is consistent
          nextItems[value] = { dataRelevance, checked };
        });
      } else {
        // set prior dropdown in next dropdown if not found in next data
        nextDropdowns[field] = { dataRelevance: false, search, items };

        // is new obj in state
        const nextDropdown = nextDropdowns[field];

        // is new obj in state
        const nextItems = nextDropdown.items;

        // this prior dropdown's items cannot be relevant if the dropdown itself is not relevant
        Object.entries(items).forEach(
          ([value, item]) =>
            // each item becomes a new obj in state
            (nextItems[value] = { ...item, dataRelevance: false })
        );
      }
    });

    // merge with default dropdowns
    Object.entries(defaultDropdowns).forEach(([key, { items = {} }]) => {
      if (key in nextDropdowns) {
        const { items: nextItems } = nextDropdowns[key];

        Object.entries(items).forEach(([itemKey, { checked }]) => {
          if (itemKey in nextItems) {
            const nextItem = nextItems[itemKey];

            nextItem.checked = checked;
          } else {
            nextItems[itemKey] = { dataRelevance: false, checked };
          }
        });
      } else {
        nextDropdowns[key] = {
          items: Object.fromEntries(
            Object.entries(items).map(([thisKey, { checked }]) => [
              thisKey,
              { dataRelevance: false, checked },
            ])
          ),
          dataRelevance: false,
          search: "",
        };
      }
    });

    // after being manipulated by previous dropdowns
    return nextDropdowns;
  });

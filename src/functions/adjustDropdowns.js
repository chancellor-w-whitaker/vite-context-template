export const adjustDropdowns = ({ nextDropdowns, setState }) =>
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

    // after being manipulated by previous dropdowns
    return nextDropdowns;
  });

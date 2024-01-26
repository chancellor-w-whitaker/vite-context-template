import {
  useDeferredValue,
  createContext,
  useCallback,
  useState,
  useMemo,
} from "react";

import { updateDropdownSelections } from "./functions/updateDropdownSelections";
import { initializeDashboardData } from "./functions/initializeDashboardData";
import { useSetBsBgVariantOfBody } from "./hooks/useSetBsBgVariantOfBody";
import { findRelevanceData } from "./functions/findRelevanceData";
import { useBsDropdowns } from "./hooks/useBsDropdowns";
import { useData } from "./hooks/examples/useData";

export const AppContext = createContext(null);

// what is "dropdowns"?
// each dropdown has a field
// each field has a relevance boolean to current data
// each field has values
// each value has a relevance boolean to current data
// each value has a relevance boolean to filtered data

// what components should be made to control rendering?

// what about "All" buttons having a different onChange handler?

// need to achieve structures below
// how?
// need to include field data relevance & value data relevance in state & state setting
// should you implement the logic for this now as well?
// your App jsx doesn't matter right now--work on implementing the dropdown data structures below and the dropdown state updating processes
// how does dropdown search change what you have described?
// should dropdown search just be another key in value object? (probably)

// ! dropdown data structures
/*
const dropdownState = {
  field1: {
    items: {
      value1: { dataRelevant: true, checked: true },
      valueN: { dataRelevant: true, checked: true },
    },
    dataRelevant: true,
  },
  fieldN: {
    items: {
      valueN: { dataRelevant: true, checked: true },
      value1: { dataRelevant: true, checked: true },
    },
    dataRelevant: true,
  },
};

const allDropdownInformationVisualized = {
  field1: {
    items: {
      value1: {
        filteredDataRelevant: true,
        dataRelevant: true,
        checked: true,
      },
      valueN: {
        filteredDataRelevant: true,
        dataRelevant: true,
        checked: true,
      },
    },
    dataRelevant: true,
  },
  fieldN: {
    items: {
      valueN: {
        filteredDataRelevant: true,
        dataRelevant: true,
        checked: true,
      },
      value1: {
        filteredDataRelevant: true,
        dataRelevant: true,
        checked: true,
      },
    },
    dataRelevant: true,
  },
};

const finalDropdownsToRender = {
  dataRelevant: [
    {
      items: {
        filteredDataIrrelevant: [
          { checked: true, value: "..." },
          { checked: true, value: "..." },
        ],
        filteredDataRelevant: [
          { checked: true, value: "..." },
          { checked: true, value: "..." },
        ],
        dataIrrelevant: [
          { checked: true, value: "..." },
          { checked: true, value: "..." },
        ],
      },
      field: "...",
    },
  ],
  dataIrrelevant: [
    {
      items: [
        { checked: true, value: "..." },
        { checked: true, value: "..." },
      ],
      field: "...",
    },
  ],
};
*/

export const AppContextProvider = ({ children }) => {
  const appContext = useProvideAppContext();

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

// ! main method
// ! what you return from here gets provided to App and can be consumed by App or any of its descendants
const useProvideAppContext = () => {
  // ! specify `bg-${variant}` to add to body classList
  useSetBsBgVariantOfBody("primary-subtle");

  // ! opt in to dynamically rendering content of dropdown menus only as dropdowns are opened
  // ! dropdown button: ref={(node) => targetStorer(dropdownID, node)}
  // ! place menuShownChecker(dropdownID) before dropdown menu descendant (if more than one descendant, wrap all in Fragment)
  const { checkIfDropdownShown, storeDropdownTarget } = useBsDropdowns();

  // ! fetch json from url param
  // ! place url or segment of url in state if need to fetch data dynamically
  const currentData = useData("data/fall.json");

  const {
    dropdownData: currentDropdownData,
    columnData: currentColumnData,
    rowData: currentRowData,
  } = useMemo(() => initializeDashboardData(currentData), [currentData]);

  // ! save previous dropdown data to compare with current dropdown data--dropdown selections needs to handle differences
  const [previousDropdownData, setPreviousDropdownData] =
    useState(currentDropdownData);

  // ! structure designed for easy locating of dropdown items--find item state by looking up dropdownState[dropdownID][item] (will be true or false)
  // ! depending on application, dropdown selections may be set up to remember every value of every dropdownID (field) that has ever appeared in data (assuming fetched data is dynamic)
  const [dropdownSelections, setDropdownSelections] =
    useState(currentDropdownData);

  // ! create deferred value of dropdown selections so can be passed to expensive calculation (keeps changing dropdown selections state responsive--expensive calculation happens later)
  const deferredDropdownSelections = useDeferredValue(dropdownSelections);

  // ! compare previous & current dropdown data in component body so no need to use effect
  if (previousDropdownData !== currentDropdownData) {
    // ! keep previous dropdown data synchronized
    setPreviousDropdownData(currentDropdownData);

    // ! reset dropdown selections (or handle differences in previous & current dropdown data)
    setDropdownSelections(currentDropdownData);
  }

  // ! handler that gets passed to dropdown items
  // ! dropdown items are input elements so field & value can just be passed as name & value respectively, allowing these variables to be extracted from event.target
  // ! means handler doesn't need to be passed parameters when used
  const onDropdownItemChange = useCallback(
    ({ target: { name: field, value } }) =>
      setDropdownSelections(updateDropdownSelections(field, value)),
    []
  );

  // ! dropdown list data recorded to separate relevant & irrelevant values as dropdown selection changes causes filtered data to change
  // ! depends on deferred dropdown state so making changes to dropdowns remains responsive & so loading state of this memoization can be derived
  const { dropdownListData, filteredRowData } = useMemo(
    () =>
      findRelevanceData(
        currentRowData,
        currentColumnData,
        deferredDropdownSelections
      ),
    [currentRowData, currentColumnData, deferredDropdownSelections]
  );

  return {
    dropdowns: {
      storeTarget: storeDropdownTarget,
      checkShown: checkIfDropdownShown,
      onChange: onDropdownItemChange,
      state: dropdownSelections,
      lists: dropdownListData,
      inputType: "checkbox",
    },
    rows: {
      filtered: {
        loading: dropdownSelections !== deferredDropdownSelections,
        data: filteredRowData,
      },
      current: { data: currentRowData },
    },
  };
};

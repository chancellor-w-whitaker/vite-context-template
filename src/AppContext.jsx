import {
  useDeferredValue,
  createContext,
  useCallback,
  useState,
  useMemo,
} from "react";

import { useSetBsBgVariantOfBody } from "./hooks/useSetBsBgVariantOfBody";
import { standardizeKey } from "./functions/standardizeKey";
import { useBsDropdowns } from "./hooks/useBsDropdowns";
import { useData } from "./hooks/examples/useData";

export const AppContext = createContext(null);

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
  const { storeDropdownTarget, checkIfDropdownOpen } = useBsDropdowns();

  // ! fetch json from url param
  // ! place url or segment of url in state if need to fetch data dynamically
  const currentData = useData("data/fall.json");

  const {
    dropdownData: currentDropdownData,
    columnData: currentColumnData,
    rowData: currentRowData,
  } = useMemo(() => {
    // ! if data is not lengthy array
    if (!(Array.isArray(currentData) && currentData.length > 0)) {
      // ! handle return values & their types early
      return { dropdownData: {}, columnData: {}, rowData: [] };
    }

    // ! initialize row data (rebuild with standardized keys while looping data)
    const rowData = [];

    /* 
    ! for every key found in data, derive...
    {
      key1: {
        types: { type1: timesCounted, ..., typeN: timesCounted },
        values: Set(...),
        field: "...",
      },
      ...,
      keyN: { ... }
    }
    */
    let columnData = {};

    currentData.forEach((row) => {
      // ! row that will have standardized keys
      const newRow = {};

      // ! iterate keys for every row in case some rows are missing keys
      Object.keys(row).forEach((key) => {
        // ! don't overwrite key in columnData once saved
        if (!(key in columnData)) {
          columnData[key] = {
            field: standardizeKey(key),
            values: new Set(),
            types: {},
          };
        }

        const { values, field, types } = columnData[key];

        const value = row[key];

        values.add(value);

        const type = typeof value;

        if (!(type in types)) types[type] = 0;

        types[type]++;

        newRow[field] = value;
      });

      rowData.push(newRow);
    });

    // ! wrote to a variable in case this changes
    const validTypes = ["string", "number"];

    // ! turn values to array to sort
    // ! narrow type down to most frequently occurring valid type
    // ! map field to respective info object instead of key
    // ! return columnData as an object so it can be used as a lookup
    columnData = Object.fromEntries(
      Object.values(columnData).map(({ values, field, types }) => [
        field,
        {
          type: Object.keys(types)
            .filter((type) => validTypes.includes(type))
            .sort((typeA, typeB) => types[typeB] - types[typeA])[0],
          values: Array.from(values).sort(),
        },
      ])
    );

    // ! derive dropdown state structure from columnData as if they dropdown state is being initialized for the first time
    const dropdownData = Object.fromEntries(
      Object.entries(columnData)
        .filter((entry) => entry[1].type === "string")
        .map(([field, { values }]) => [
          field,
          Object.fromEntries(values.map((value) => [value, true])),
        ])
    );

    // ! return each value that will be used elsewhere
    return { dropdownData, columnData, rowData };
  }, [currentData]);

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
      setDropdownSelections((prevState) => {
        // ! new state reference
        const nextState = { ...prevState };

        // ! new dropdown reference
        nextState[field] = { ...nextState[field] };

        // ! clicked "All" button
        // ! if value prop is undefined or "" (undefined prop arrives as empty string--means can't have specifically have a "" in list)
        if (value === "") {
          // ! if not some item unchecked
          const allChecked = !Object.values(nextState[field]).some(
            (condition) => !condition
          );

          // ! only when all are checked should you set all false--otherwise, set all true
          if (allChecked) {
            Object.keys(nextState[field]).forEach(
              (v) => (nextState[field][v] = false)
            );
          } else {
            Object.keys(nextState[field]).forEach(
              (v) => (nextState[field][v] = true)
            );
          }

          // ! if clicked all, return next state early so rest of code doesn't run
          return nextState;
        }

        // ! didn't click "All" button (clicked any item)
        // ! flip condition (checked)
        nextState[field][value] = !nextState[field][value];

        return nextState;
      }),
    []
  );

  // ! dropdown list data recorded to separate relevant & irrelevant values as dropdown selection changes causes filtered data to change
  // ! depends on deferred dropdown state so making changes to dropdowns remains responsive & so loading state of this memoization can be derived
  const { dropdownListData, filteredRowData } = useMemo(() => {
    // ! for each row -> for each field -> if some row[field] value not checked (state[field][value]), filter row out of data
    const getFilteredRowData = (rowData, fields) => {
      return rowData.filter((row) => {
        for (const field of fields) {
          const value = row[field];

          // ! precede condition in case dropdown doesn't exist (may be logic error)
          if (
            deferredDropdownSelections[field] &&
            !deferredDropdownSelections[field][value]
          ) {
            return false;
          }
        }

        return true;
      });
    };

    // ! in passed row data, field all unique values of every field passed
    const getRelevantValueData = (rowData, fields) => {
      const relevantValueData = {};

      rowData.forEach((row) => {
        fields.forEach((field) => {
          if (!(field in relevantValueData))
            relevantValueData[field] = new Set();

          const value = row[field];

          relevantValueData[field].add(value);
        });
      });

      return relevantValueData;
    };

    // ! string fields of current column data--only columns that can be dropdowns with values relevant to current data
    const currentFields = Object.entries(currentColumnData)
      .filter((entry) => entry[1].type === "string")
      .map(([field]) => field);

    // ! of current fields, find fields in dropdown state where some values are unchecked
    const modifiedDropdownFields = currentFields.filter(
      (field) =>
        deferredDropdownSelections[field] &&
        Object.values(deferredDropdownSelections[field]).some(
          (checked) => !checked
        )
    );

    // ! entire filtered row data--derived from current row data, string fields found in current column data, & deferred dropdown state
    const filteredRowData = getFilteredRowData(currentRowData, currentFields);

    // ! find relevant values of every current string field
    // ! relevant value data of modified dropdown fields will get overwritten--relevant values of those is being calculated here unnecessarily
    const relevantValueData = getRelevantValueData(
      filteredRowData,
      currentFields
    );

    // ! for each relevant modified dropdown field, get filtered row data where all values of field are assumed to be checked
    modifiedDropdownFields.forEach((field, index) => {
      // ! don't need to consider field of current iteration in row data filtering algorithm
      const currentOneRemoved = [
        ...modifiedDropdownFields.slice(0, index),
        ...modifiedDropdownFields.slice(index + 1),
      ];

      const thisFilteredRowData = getFilteredRowData(
        currentRowData,
        currentOneRemoved
      );

      // ! from this filtered row data, find every unique value found only for field of current iteration
      const thisRelevantValueData = getRelevantValueData(thisFilteredRowData, [
        field,
      ]);

      // ! for every modified dropdown field,
      // ! overwrite its unique values with its unique values found from a filtered row data where the field's dropdown selections are removed from the entire dropdown selections
      relevantValueData[field] = thisRelevantValueData[field];
    });

    // ! for each current field, differentiate relevant & irrelevant values of field's values in current row data
    const dropdownListData = Object.fromEntries(
      currentFields.map((field) => [
        field,
        {
          irrelevant: currentColumnData[field].values.filter(
            (value) => !relevantValueData[field]?.has(value)
          ),
          relevant: currentColumnData[field].values.filter((value) =>
            relevantValueData[field]?.has(value)
          ),
        },
      ])
    );

    // ! return dropdown list data to be used when rendering dropdowns & filtered row data to be used when rendering Visualization or Data Grid
    return { dropdownListData, filteredRowData };
  }, [currentRowData, currentColumnData, deferredDropdownSelections]);

  return {
    dropdowns: {
      storeTarget: storeDropdownTarget,
      checkShown: checkIfDropdownOpen,
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

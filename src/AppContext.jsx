import {
  useDeferredValue,
  createContext,
  useCallback,
  useState,
  useMemo,
} from "react";
import { Str } from "@supercharge/strings";

import { useSetBsBgVariantOfBody } from "./hooks/useSetBsBgVariantOfBody";
import { useBsDropdowns } from "./hooks/useBsDropdowns";
import { useData } from "./hooks/examples/useData";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const appContext = useProvideAppContext();

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

const standardizeKey = (key) =>
  Str(key)
    .camel()
    .words()
    .filter((word) => word.toLowerCase() !== "desc")
    .join("");

/* 

! relevant dropdowns algorithm

what is the algorithm? (
setDataDropdowns(getAllRelevantDropdowns(data, dropdowns, history))
)
- get secondary relevant dropdowns (
getSecRelevantDropdowns(data, dropdowns, history, keys=Object.keys(dropdowns))
)
	- create copy of dropdowns where everything checked
	- modify dropdowns from history
		- each item in history contains field, action, option
		- if option is undefined, means "all"
		- based on item properties, assign actions to each field[option] in dropdowns
	- then get relevant data using standard process
	- then get relevant dropdowns (using relevant data & dropdowns & keys passed, mark which options for each field actually appear in the relevant data)
- then get stack (reverse history, for each history obj, only traverse each field once) (determines order in which each field was modified)
- for each field in stack, 
	- get primary relevant dropdowns by (data, dropdowns, history, field)
		- filtering field from history, then get secondary relevant dropdowns using data, dropdowns, filtered history, and sending field as the only item in keys
	- assign field's secondary relevant dropdown to this newfound primary relevant dropdown
- for each field in secondary relevant dropdowns, sort keys in dropdown

*/

// ! main method
const useProvideAppContext = () => {
  useSetBsBgVariantOfBody("primary-subtle");

  const { menuShownChecker, targetStorer } = useBsDropdowns();

  const data = useData("data/fall.json");

  const { dropdownData, columnData, rowData } = useMemo(() => {
    if (!(Array.isArray(data) && data.length > 0)) {
      return { dropdownData: {}, columnData: {}, rowData: [] };
    }

    const rowData = [];

    let columnData = {};

    data.forEach((row) => {
      const newRow = {};

      Object.keys(row).forEach((key) => {
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

    const validTypes = ["string", "number"];

    columnData = Object.fromEntries(
      Object.values(columnData).map(({ values, field, types }) => [
        field,
        {
          type: Object.keys(types)
            .filter((type) => validTypes.includes(type))
            .sort((a, b) => types[b] - types[a])[0],
          values: Array.from(values).sort(),
        },
      ])
    );

    const dropdownData = Object.fromEntries(
      Object.entries(columnData)
        .filter((arr) => arr[1].type === "string")
        .map(([field, { values }]) => [
          field,
          Object.fromEntries(values.map((value) => [value, true])),
        ])
    );

    return { dropdownData, columnData, rowData };
  }, [data]);

  const [prevDropdownData, setPrevDropdownData] = useState(dropdownData);

  const [dropdowns, setDropdowns] = useState({});

  const deferredDropdowns = useDeferredValue(dropdowns);

  if (prevDropdownData !== dropdownData) {
    setPrevDropdownData(dropdownData);

    setDropdowns(dropdownData);
  }

  const onDropdownChange = useCallback(
    ({ target: { value, name } }) =>
      setDropdowns((previousState) => {
        const nextState = { ...previousState };

        nextState[name] = { ...nextState[name] };

        if (value === "") {
          const allAreChecked = !Object.values(nextState[name]).some(
            (condition) => !condition
          );

          if (allAreChecked) {
            Object.keys(nextState[name]).forEach(
              (key) => (nextState[name][key] = false)
            );
          } else {
            Object.keys(nextState[name]).forEach(
              (key) => (nextState[name][key] = true)
            );
          }

          return nextState;
        }

        nextState[name][value] = !nextState[name][value];

        return nextState;
      }),
    []
  );

  const { dropdownLists, filteredRows } = useMemo(() => {
    const getFilteredRows = (rows, fields) => {
      return rows.filter((row) => {
        for (const field of fields) {
          const value = row[field];

          if (deferredDropdowns[field] && !deferredDropdowns[field][value]) {
            return false;
          }
        }

        return true;
      });
    };

    const getFilteredValues = (rows, fields) => {
      const filteredValues = {};

      rows.forEach((row) => {
        fields.forEach((field) => {
          if (!(field in filteredValues)) filteredValues[field] = new Set();

          const value = row[field];

          filteredValues[field].add(value);
        });
      });

      return filteredValues;
    };

    const fields = Object.entries(columnData)
      .filter((arr) => arr[1].type === "string")
      .map(([field]) => field);

    const modifiedFields = fields.filter(
      (field) =>
        deferredDropdowns[field] &&
        Object.values(deferredDropdowns[field]).some((checked) => !checked)
    );

    const filteredRows = getFilteredRows(rowData, fields);

    const filteredValues = getFilteredValues(filteredRows, fields);

    modifiedFields.forEach((field, index) => {
      const modFieldsWithoutCurrent = [
        ...modifiedFields.slice(0, index),
        ...modifiedFields.slice(index + 1),
      ];

      const theseFilteredRows = getFilteredRows(
        rowData,
        modFieldsWithoutCurrent
      );

      const theseFilteredValues = getFilteredValues(theseFilteredRows, [field]);

      filteredValues[field] = theseFilteredValues[field];
    });

    const dropdownLists = Object.fromEntries(
      fields.map((field) => [
        field,
        {
          irrelevant: columnData[field].values.filter(
            (value) => !filteredValues[field]?.has(value)
          ),
          relevant: columnData[field].values.filter((value) =>
            filteredValues[field]?.has(value)
          ),
        },
      ])
    );

    return { dropdownLists, filteredRows };
  }, [rowData, columnData, deferredDropdowns]);

  // sticky all buttons
  // checked fractions

  // dropdowns?
  // column data where type === "string"
  // how should dropdowns data structure be set up?
  // what to consider?
  // when changing state of value of field, should be quick to locate
  // how about dropdowns[field][value] = ? (true or false) ✅
  // how about maintaining history?
  // do you need history? what if there is a simpler way?
  // ! when data gets filtered, relevant values for each field is subject to change
  // ! you can find filtered rows from updated dropdowns,
  // ! and then find relevant values from filtered rows
  // what if you repeated a similar process for every field?
  // imagine

  // ! think about this!
  // const data = useData(url);
  // const [prevData, setPrevData] = useState(data);
  // const [someState, setSomeState] = useState(null);
  // if (prevData !== data) {
  //   setPrevData(data);
  //   setSomeState(data > prevData ? "increasing" : "decreasing");
  // }

  return {
    dropdowns: {
      onChange: onDropdownChange,
      inputType: "checkbox",
      lists: dropdownLists,
      state: dropdowns,
      menuShownChecker,
      targetStorer,
    },
    rows: {
      filtered: {
        loading: dropdowns !== deferredDropdowns,
        data: filteredRows,
      },
      all: {
        data: rowData,
      },
    },
  };
};

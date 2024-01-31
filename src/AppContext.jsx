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
import { usePrevious } from "./hooks/usePrevious";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const appContext = useMainMethod();

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

const dataOptions = [
  { displayName: "Fall Enrollment", id: "fall" },
  { displayName: "Spring Enrollment", id: "spring" },
  { displayName: "Summer Enrollment", id: "summer" },
  { displayName: "Degrees Awarded", id: "degrees" },
  { displayName: "Retention Rates", id: "retention" },
  { displayName: "Graduation Rates", id: "graduation" },
  { displayName: "Credit Hours", id: "hours" },
];

const useMainMethod = () => {
  useSetBsBgVariantOfBody("primary-subtle");

  const { isDropdownWithIdOpen, storeDropdownById } = useBsDropdowns();

  const [selectedData, setSelectedData] = useState(dataOptions[0].id);

  const deferredSelectedData = useDeferredValue(selectedData);

  const dataIsLoading = selectedData !== deferredSelectedData;

  const onSelectedDataChange = useCallback(
    ({ target: { value } }) => setSelectedData(value),
    []
  );

  const data = useData(`data/${deferredSelectedData}.json`);

  const [dropdowns, setDropdowns] = useState({});

  const deferredDropdowns = useDeferredValue(dropdowns);

  const filteredRowsIsLoading = dropdowns !== deferredDropdowns;

  const onDropdownItemChange = useCallback(
    ({ target: { value, name } }) =>
      setDropdowns((previousDropdowns) => {
        // ! name is `${field}-items`
        const field = name.split("-")[0];

        const nextDropdowns = { ...previousDropdowns };

        nextDropdowns[field] = { ...nextDropdowns[field] };

        nextDropdowns[field].items = { ...nextDropdowns[field].items };

        nextDropdowns[field].items[value] = {
          ...nextDropdowns[field].items[value],
        };

        nextDropdowns[field].items[value].checked =
          !nextDropdowns[field].items[value].checked;

        return nextDropdowns;
      }),
    []
  );

  const onDropdownAllItemsChange = useCallback(
    ({ target: { name } }) =>
      setDropdowns((previousDropdowns) => {
        // ! name is `${field}-items`
        const field = name.split("-")[0];

        const nextDropdowns = { ...previousDropdowns };

        nextDropdowns[field] = { ...nextDropdowns[field] };

        const noneUnchecked = !Object.values(nextDropdowns[field].items).some(
          ({ checked }) => !checked
        );

        if (noneUnchecked) {
          nextDropdowns[field].items = Object.fromEntries(
            Object.entries(nextDropdowns[field].items).map(
              ([value, object]) => [value, { ...object, checked: false }]
            )
          );
        } else {
          nextDropdowns[field].items = Object.fromEntries(
            Object.entries(nextDropdowns[field].items).map(([value, object]) =>
              !object.checked
                ? [value, { ...object, checked: true }]
                : [value, object]
            )
          );
        }

        return nextDropdowns;
      }),
    []
  );

  // ! can you pass 'name' prop to search input?
  // ! do you need to distinguish between the search input & item inputs?
  // ! for example, pass `${field}-items` to item inputs &
  // ! pass `${field}-search` to search input
  // ! remove '-items' & remove '-search' in onChange handlers
  const onDropdownSearchChange = useCallback(
    ({ target: { value, name } }) =>
      setDropdowns((previousDropdowns) => {
        // ! name is `${field}-search`
        const field = name.split("-")[0];

        const nextDropdowns = { ...previousDropdowns };

        nextDropdowns[field] = { ...nextDropdowns[field] };

        nextDropdowns[field].search = value;

        return nextDropdowns;
      }),
    []
  );

  const { columns, rows } = useMemo(() => {
    if (!(Array.isArray(data) && data.length > 0)) {
      return { relevantDropdowns: {}, columns: {}, rows: [] };
    }

    const rows = [];

    let columns = {};

    data.forEach((object) => {
      const row = {};

      Object.keys(object).forEach((key) => {
        if (!(key in columns)) {
          columns[key] = {
            field: standardizeKey(key),
            values: new Set(),
            types: {},
          };
        }

        const { values, types, field } = columns[key];

        const value = object[key];

        const type = typeof value;

        values.add(value);

        if (!(type in types)) {
          types[type] = 0;
        }

        types[type]++;

        row[field] = value;
      });

      rows.push(row);
    });

    columns = Object.fromEntries(
      Object.values(columns).map(({ values, field, types }) => [
        field,
        {
          type: Object.keys(types)
            .sort((typeA, typeB) => types[typeB] - types[typeA])
            .filter((type) => ["string", "number"].includes(type))[0],
          values: Array.from(values).sort(),
        },
      ])
    );

    return { columns, rows };
  }, [data]);

  // ! get filtered data and derived dropdown information here
  // ! dropdown state & rows should be enough to get you what you need
  // ! dropdown state tells you which options are data relevant--then you derive filtered data relevance
  /*
  const valueRelevanceLookup = {
    field1: {
      filteredDataIrrelevant: ["...", "..."],
      filteredDataRelevant: ["...", "..."],
      dataIrrelevant: ["...", "..."],
    },
    fieldN: {
      filteredDataIrrelevant: ["...", "..."],
      filteredDataRelevant: ["...", "..."],
      dataIrrelevant: ["...", "..."],
    },
  };
  */
  const { dropdownItems, filteredRows } = useMemo(() => {
    const dataRelevantFields = Object.keys(deferredDropdowns).filter(
      (field) => deferredDropdowns[field].dataRelevance
    );

    const dataRelevantModifiedFields = dataRelevantFields.filter((field) =>
      // deferredDropdowns[field] &&
      Object.values(deferredDropdowns[field].items).some(
        ({ checked }) => !checked
      )
    );

    const getFilteredRows = ({ dropdowns, fields, rows }) => {
      return rows.filter((row) => {
        for (const field of fields) {
          const value = row[field];

          // ! precede condition in case dropdown doesn't exist (may be logic error)
          if (
            dropdowns[field].items[value] &&
            !dropdowns[field].items[value].checked
          ) {
            return false;
          }
        }

        return true;
      });
    };

    const findSetOfValuesPerField = ({ fields, rows }) => {
      const valueSets = {};

      rows.forEach((row) => {
        fields.forEach((field) => {
          if (!(field in valueSets)) valueSets[field] = new Set();

          const value = row[field];

          valueSets[field].add(value);
        });
      });

      return valueSets;
    };

    const filteredRows = getFilteredRows({
      dropdowns: deferredDropdowns,
      fields: dataRelevantFields,
      rows,
    });

    const fieldValueSets = findSetOfValuesPerField({
      fields: dataRelevantFields,
      rows: filteredRows,
    });

    dataRelevantModifiedFields.forEach((thisField, index) => {
      const thisFieldRemoved = [
        ...dataRelevantModifiedFields.slice(0, index),
        ...dataRelevantModifiedFields.slice(index + 1),
      ];

      const thisFilteredRows = getFilteredRows({
        dropdowns: deferredDropdowns,
        fields: thisFieldRemoved,
        rows,
      });

      const thisFieldValueSets = findSetOfValuesPerField({
        rows: thisFilteredRows,
        fields: [thisField],
      });

      fieldValueSets[thisField] = thisFieldValueSets[thisField];
    });

    const booleanToBinary = (boolean) => (boolean ? 1 : 0);

    const findQueryInValue = (query, value) =>
      booleanToBinary(value.toLowerCase().includes(query.toLowerCase()));

    const sortBySearch = (search) => (valueA, valueB) =>
      findQueryInValue(search, valueB) - findQueryInValue(search, valueA);

    const dropdownItems = Object.fromEntries(
      Object.entries(deferredDropdowns).map(([field, { search, items }]) => [
        field,
        {
          irrelevant: (!(field in fieldValueSets)
            ? Object.entries(items)
                .filter((entry) => entry[1].dataRelevance)
                .map(([value]) => value)
            : Object.entries(items)
                .filter(
                  ([value, { dataRelevance }]) =>
                    dataRelevance && !fieldValueSets[field]?.has(value)
                )
                .map(([value]) => value)
          ).sort(sortBySearch(search)),
          relevant: (!(field in fieldValueSets)
            ? []
            : Object.entries(items)
                .filter(
                  ([value, { dataRelevance }]) =>
                    dataRelevance && fieldValueSets[field]?.has(value)
                )
                .map(([value]) => value)
          ).sort(sortBySearch(search)),
          unavailable: Object.entries(items)
            .filter((entry) => !entry[1].dataRelevance)
            .map(([value]) => value)
            .sort(sortBySearch(search)),
        },
      ])
    );

    return { dropdownItems, filteredRows };
  }, [deferredDropdowns, rows]);

  const onDropdownSubListChange = useCallback(
    ({ target: { name } }, subset = "relevant") =>
      setDropdowns((previousDropdowns) => {
        // ! name is `${field}-items`
        const field = name.split("-")[0];

        const nextDropdowns = { ...previousDropdowns };

        nextDropdowns[field] = { ...nextDropdowns[field] };

        const setOfSubsetValues = new Set(dropdownItems[field][subset]);

        const noneUnchecked = !Object.entries(nextDropdowns[field].items).some(
          ([value, { checked }]) => !checked && setOfSubsetValues.has(value)
        );

        if (noneUnchecked) {
          nextDropdowns[field].items = Object.fromEntries(
            Object.entries(nextDropdowns[field].items).map(([value, object]) =>
              setOfSubsetValues.has(value)
                ? [value, { ...object, checked: false }]
                : [value, object]
            )
          );
        } else {
          nextDropdowns[field].items = Object.fromEntries(
            Object.entries(nextDropdowns[field].items).map(([value, object]) =>
              !object.checked && setOfSubsetValues.has(value)
                ? [value, { ...object, checked: true }]
                : [value, object]
            )
          );
        }

        return nextDropdowns;
      }),
    [dropdownItems]
  );

  const handleDataChangeInDropdowns = useCallback(() => {
    const nextDropdowns = Object.fromEntries(
      Object.entries(columns)
        .filter((entry) => entry[1].type === "string")
        .map(([field, { values }]) => [
          field,
          {
            items: Object.fromEntries(
              values.map((value) => [
                value,
                { dataRelevance: true, checked: true },
              ])
            ),
            dataRelevance: true,
            search: "",
          },
        ])
    );

    setDropdowns((previousDropdowns) => {
      // next dropdowns gets manipulated based on previous dropdowns
      Object.entries(previousDropdowns).forEach(
        ([field, { search, items }]) => {
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
        }
      );

      // after being manipulated by previous dropdowns
      return nextDropdowns;
    });
  }, [columns]);

  usePrevious(columns, handleDataChangeInDropdowns);

  // ! start working with asana first thing tomorrow!
  // ! need to disable enter of search form
  // ! disable some dropdown items (lower opacity ones)
  // ! change appearance of all or subset buttons
  // ! some visual indicator of modified dropdowns (on button)
  // ! less padding between dropdown items (list group items)

  return {
    onDropdownAllItemsChange,
    onDropdownSubListChange,
    onDropdownSearchChange,
    filteredRowsIsLoading,
    isDropdownWithIdOpen,
    onDropdownItemChange,
    onSelectedDataChange,
    storeDropdownById,
    dropdownItems,
    dataIsLoading,
    selectedData,
    filteredRows,
    dataOptions,
    dropdowns,
    columns,
    rows,
  };
};

import {
  startTransition,
  createContext,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";

import { useSetBsBgVariantOfBody } from "./hooks/useSetBsBgVariantOfBody";
import { useDelayedValue } from "./hooks/examples/useDelayedValue";
import { standardizeKey } from "./functions/standardizeKey";
import { useBsDropdowns } from "./hooks/useBsDropdowns";
import { useData } from "./hooks/examples/useData";
import { usePrevious } from "./hooks/usePrevious";
import { pivotData } from "./functions/pivotData";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const appContext = useMainMethod();

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

const fileNames = [
  { displayName: "Fall Enrollment", pivotField: "term", id: "fall" },
  { displayName: "Spring Enrollment", pivotField: "term", id: "spring" },
  { displayName: "Summer Enrollment", pivotField: "term", id: "summer" },
  { displayName: "Degrees Awarded", pivotField: "year", id: "degrees" },
  {
    displayName: "Retention Rates",
    pivotField: "retentionYear",
    id: "retention",
  },
  {
    displayName: "Graduation Rates",
    pivotField: "cohortTerm",
    id: "graduation",
  },
  { displayName: "Credit Hours", pivotField: "year", id: "hours" },
];

const pivotFields = new Set(fileNames.map(({ pivotField }) => pivotField));

const regressionTypes = [
  "linear",
  "exponential",
  "logarithmic",
  "power",
  "polynomial",
];

// ! filter out rows where selected rate is 0
// ! yr grad numbers are not percentages

const useMainMethod = () => {
  const gridRef = useRef();

  useSetBsBgVariantOfBody("primary-subtle");

  const { isDropdownWithIdOpen, storeDropdownById } = useBsDropdowns();

  const [fileName, setFileName] = useState(fileNames[0].id);

  const [measure, setMeasure, delayedMeasure] = useResponsiveState();

  const [groupBy, setGroupBy, delayedGroupBy, groupByIsLoading] =
    useResponsiveState([]);

  const [regressionType, setRegressionType] = useResponsiveState(
    regressionTypes[0]
  );

  const onFileNameChange = useCallback(
    ({ target: { value } }) => setFileName(value),
    []
  );

  const onMeasureChange = useCallback(
    ({ target: { value } }) => setMeasure(value),
    [setMeasure]
  );

  const onGroupByChange = useCallback(
    ({ target: { value } }) =>
      setGroupBy((previousGroupBy) => {
        const nextGroupBy = previousGroupBy.filter(
          (anyField) => anyField !== value
        );

        return previousGroupBy.length !== nextGroupBy.length
          ? nextGroupBy
          : [...nextGroupBy, value];
      }),
    [setGroupBy]
  );

  const onRegressionTypeChange = useCallback(
    ({ target: { value } }) => setRegressionType(value),
    [setRegressionType]
  );

  const data = useData(`data/${fileName}.json`);

  const dataIsLoading = false;

  const [dropdowns, setDropdowns, delayedDropdowns, dropdownsIsLoading] =
    useResponsiveState({});

  const filteredRowsIsLoading = dropdownsIsLoading;

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
    [setDropdowns]
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
    [setDropdowns]
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
    [setDropdowns]
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

  console.log(rows);

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
    const dataRelevantFields = Object.keys(delayedDropdowns).filter(
      (field) => delayedDropdowns[field].dataRelevance
    );

    const dataRelevantModifiedFields = dataRelevantFields.filter((field) =>
      // delayedDropdowns[field] &&
      Object.values(delayedDropdowns[field].items).some(
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
      dropdowns: delayedDropdowns,
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
        dropdowns: delayedDropdowns,
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
      Object.entries(delayedDropdowns).map(([field, { search, items }]) => [
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
  }, [delayedDropdowns, rows]);

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
    [dropdownItems, setDropdowns]
  );

  const onDropdownAllRelevantChange = useCallback(
    (e) => onDropdownSubListChange(e, "relevant"),
    [onDropdownSubListChange]
  );

  const onDropdownAllIrrelevantChange = useCallback(
    (e) => onDropdownSubListChange(e, "irrelevant"),
    [onDropdownSubListChange]
  );

  const onDropdownAllUnavailableChange = useCallback(
    (e) => onDropdownSubListChange(e, "unavailable"),
    [onDropdownSubListChange]
  );

  const handleDataChange = useCallback(() => {
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

    setMeasure((previousMeasure) => {
      const nextRelevantOptions = Object.entries(columns)
        .filter((array) => array[1].type === "number")
        .map(([field]) => field);

      return !nextRelevantOptions.includes(previousMeasure)
        ? nextRelevantOptions[0]
        : previousMeasure;
    });

    setGroupBy((previousGroupBy) => {
      const nextRelevantOptions = Object.entries(columns)
        .filter(
          ([field, { type }]) => type === "string" && !pivotFields.has(field)
        )
        .map(([field]) => field);

      const relevantOptionsSet = new Set(nextRelevantOptions);

      const filteredGroupBy = previousGroupBy.filter((option) =>
        relevantOptionsSet.has(option)
      );

      return filteredGroupBy.length === 0
        ? [...previousGroupBy, nextRelevantOptions[0]]
        : previousGroupBy;
    });
  }, [columns, setDropdowns, setMeasure, setGroupBy]);

  usePrevious(columns, handleDataChange);

  const measures = useMemo(
    () =>
      Object.entries(columns)
        .filter((entry) => entry[1].type === "number")
        .map(([field]) => field),
    [columns]
  );

  const groupBys = useMemo(
    () =>
      Object.entries(columns)
        .filter(
          ([field, { type }]) => type === "string" && !pivotFields.has(field)
        )
        .map(([field]) => field),
    [columns]
  );

  const relevantGroupBys = useMemo(
    () => delayedGroupBy.filter((field) => field in columns),
    [columns, delayedGroupBy]
  );

  const { pivotField } = fileNames.find(({ id }) => id === fileName);

  const { rowData: pivotedData, topRowData: totalRow } = useMemo(
    () =>
      pivotData({
        groupBy: relevantGroupBys,
        data: filteredRows,
        pivotField,
        measures,
      }),
    [measures, relevantGroupBys, filteredRows, pivotField]
  );

  const columnDefs = useMemo(
    () =>
      !(Array.isArray(pivotedData) && pivotedData.length > 0)
        ? []
        : [
            {
              valueGetter: (e) =>
                !("rowPinned" in e.node) ? e.node.rowIndex + 1 : "Total",
              headerName: "Row",
            },
            ...Object.entries(pivotedData[0]).map(([field, stringOrObject]) =>
              typeof stringOrObject === "string"
                ? { field }
                : {
                    valueGetter: ({ colDef: { field }, data }) =>
                      data[field]?.[delayedMeasure],
                    valueFormatter: ({ value }) =>
                      Math.round(value).toLocaleString(),
                    type: "numericColumn",
                    field,
                  }
            ),
          ],
    [pivotedData, delayedMeasure]
  );

  const defaultColDef = useMemo(() => ({ suppressMovable: true }), []);

  const pivotedDataIsLoading = filteredRowsIsLoading || groupByIsLoading;

  const onSortChanged = useCallback((e) => e.api.refreshCells(), []);

  const exportDataAsCsv = useCallback(
    () => gridRef.current.api.exportDataAsCsv(),
    []
  );

  return {
    onChange: {
      dropdowns: {
        unavailableItems: onDropdownAllUnavailableChange,
        irrelevantItems: onDropdownAllIrrelevantChange,
        relevantItems: onDropdownAllRelevantChange,
        allItems: onDropdownAllItemsChange,
        singleItem: onDropdownItemChange,
        search: onDropdownSearchChange,
      },
      regressionType: onRegressionTypeChange,
      fileName: onFileNameChange,
      groupBy: onGroupByChange,
      measure: onMeasureChange,
    },
    state: {
      loading: {
        filteredRows: filteredRowsIsLoading,
        pivotedData: pivotedDataIsLoading,
        data: dataIsLoading,
      },
      regressionType,
      dropdowns,
      fileName,
      measure,
      groupBy,
    },
    grid: {
      pinnedTopRowData: totalRow,
      columnDefs: columnDefs,
      rowData: pivotedData,
      exportDataAsCsv,
      defaultColDef,
      onSortChanged,
      ref: gridRef,
    },
    lists: { regressionTypes, dropdownItems, fileNames, measures, groupBys },
    initializers: { isDropdownWithIdOpen, storeDropdownById },
  };
};

const useResponsiveState = (initialValue) => {
  const [value, valueSetter] = useState(initialValue);

  const setValue = useCallback(
    (param) => startTransition(() => valueSetter(param)),
    []
  );

  const delayedValue = useDelayedValue(value);

  const isLoading = value !== delayedValue;

  return [value, setValue, delayedValue, isLoading];
};

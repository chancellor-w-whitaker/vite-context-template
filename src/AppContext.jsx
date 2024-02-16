import {
  createContext,
  useTransition,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";

import { handleAllDropdownItemsChange } from "./functions/handleAllDropdownItemsChange";
import { handleDropdownSubListChange } from "./functions/handleDropdownSubListChange";
import { handleDropdownSearchChange } from "./functions/handleDropdownSearchChange";
import { handleDropdownStateChanges } from "./functions/handleDropdownStateChanges";
import { useAutoSizeOnRowDataUpdated } from "./hooks/useAutoSizeOnRowDataUpdated";
import { handleDropdownItemChange } from "./functions/handleDropdownItemChange";
import { useSetBsBgVariantOfBody } from "./hooks/useSetBsBgVariantOfBody";
import { performPivotOperation } from "./functions/performPivotOperation";
import { findRelevantMeasures } from "./functions/findRelevantMeasures";
import { handleGroupByChange } from "./functions/handleGroupByChange";
import { formatMeasureValue } from "./functions/formatMeasureValue";
import { findRegressionData } from "./functions/findRegressionData";
import { getMeasureFraction } from "./functions/getMeasureFraction";
import { getRowsAndColumns } from "./functions/getRowsAndColumns";
import { findNextDropdowns } from "./functions/findNextDropdowns";
import { formatMeasureRate } from "./functions/formatMeasureRate";
import { useResponsiveState } from "./hooks/useResponsiveState";
import { regressionTypes } from "./constants/regressionTypes";
import { adjustDropdowns } from "./functions/adjustDropdowns";
import { getMeasureValue } from "./functions/getMeasureValue";
import { getMeasureRate } from "./functions/getMeasureRate";
import { getColumnDefs } from "./functions/getColumnDefs";
import { adjustMeasure } from "./functions/adjustMeasure";
import { adjustGroupBy } from "./functions/adjustGroupBy";
import { useBsDropdowns } from "./hooks/useBsDropdowns";
import { brandColors } from "./constants/brandColors";
import { useData } from "./hooks/examples/useData";
import { usePrevious } from "./hooks/usePrevious";
import { fileNames } from "./constants/fileNames";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const appContext = useMainMethod();

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

const pivotFields = new Set(fileNames.map(({ pivotField }) => pivotField));

const fileDefaults = { rowRemovalLogic: {}, measuresToOmit: [] };

// what about a js linter?

// download un-pivoted data (just including selected measure & rate data handle differently)
// all values are downloading as strings (fix)
// rates should download as numerical (value getter result not value formatter result)

// check bethany email about data page addition

function useNonBlockingState(initialState) {
  const [state, setState] = useState(initialState);

  const [isPending, startTransition] = useTransition();

  const updateState = useCallback(
    (argument) => startTransition(() => setState(argument)),
    []
  );

  return [state, updateState, isPending];
}

const useMainMethod = () => {
  const gridRef = useRef();

  useSetBsBgVariantOfBody("primary-subtle");

  const { isDropdownWithIdOpen, storeDropdownById } = useBsDropdowns();

  const [fileName, setFileName] = useNonBlockingState(fileNames[0].id);

  const {
    rowRemovalLogic = fileDefaults.rowRemovalLogic,
    measuresToOmit = fileDefaults.measuresToOmit,
    shouldFindRates,
    pivotField,
  } = fileNames.find(({ id }) => id === fileName);

  const [measure, setMeasure, delayedMeasure] = useResponsiveState();

  const [groupBy, setGroupBy, delayedGroupBy, groupByIsLoading] =
    useResponsiveState([]);

  const [regressionType, setRegressionType, delayedRegressionType] =
    useResponsiveState(regressionTypes[0]);

  const onFileNameChange = useCallback(
    ({ target: { value } }) => setFileName(value),
    [setFileName]
  );

  const onMeasureChange = useCallback(
    ({ target: { value } }) => setMeasure(value),
    [setMeasure]
  );

  const onGroupByChange = useCallback(
    ({ target: { value } }) =>
      handleGroupByChange({ setState: setGroupBy, value }),
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
      handleDropdownItemChange({ setState: setDropdowns, value, name }),
    [setDropdowns]
  );

  const onDropdownAllItemsChange = useCallback(
    ({ target: { name } }) =>
      handleAllDropdownItemsChange({ setState: setDropdowns, name }),
    [setDropdowns]
  );

  // ! can you pass 'name' prop to search input?
  // ! do you need to distinguish between the search input & item inputs?
  // ! for example, pass `${field}-items` to item inputs &
  // ! pass `${field}-search` to search input
  // ! remove '-items' & remove '-search' in onChange handlers
  const onDropdownSearchChange = useCallback(
    ({ target: { value, name } }) =>
      handleDropdownSearchChange({ setState: setDropdowns, value, name }),
    [setDropdowns]
  );

  const { rows: allRows, columns } = useMemo(
    () => getRowsAndColumns(data),
    [data]
  );

  const rows = useMemo(
    () =>
      allRows.filter((row) => {
        if (delayedMeasure in rowRemovalLogic) {
          const { value, key } = rowRemovalLogic[delayedMeasure];

          if (row[key] === value) return false;
        }

        return true;
      }),
    [allRows, delayedMeasure, rowRemovalLogic]
  );

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
  const { dropdownItems, filteredRows } = useMemo(
    () => handleDropdownStateChanges({ dropdowns: delayedDropdowns, rows }),
    [delayedDropdowns, rows]
  );

  const onDropdownSubListChange = useCallback(
    ({ target: { name } }, subset = "relevant") =>
      handleDropdownSubListChange({
        setState: setDropdowns,
        dropdownItems,
        subset,
        name,
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
    const nextDropdowns = findNextDropdowns(columns);

    adjustDropdowns({ setState: setDropdowns, nextDropdowns });

    adjustMeasure({ setState: setMeasure, measuresToOmit, columns });

    adjustGroupBy({ setState: setGroupBy, pivotFields, columns });
  }, [columns, setDropdowns, setMeasure, setGroupBy, measuresToOmit]);

  usePrevious(columns, handleDataChange);

  const measures = useMemo(
    () =>
      Object.entries(columns)
        .filter((entry) => entry[1].type === "number")
        .map(([field]) => field),
    [columns]
  );

  const nonOmittedMeasures = useMemo(
    () => findRelevantMeasures({ measuresToOmit, columns }),
    [columns, measuresToOmit]
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

  const { rowData: pivotedData, topRowData: totalRow } = useMemo(
    () =>
      performPivotOperation({
        groupBy: relevantGroupBys,
        pivotField: pivotField,
        data: filteredRows,
        measures,
      }),
    [measures, relevantGroupBys, filteredRows, pivotField]
  );

  const { tooltipItems, chartData } = useMemo(() => {
    const chartData = Object.entries(totalRow[0]).map(
      ([pivotValue, measuresObject]) => {
        const object = {
          [delayedMeasure]: !shouldFindRates
            ? getMeasureValue(measuresObject, delayedMeasure)
            : getMeasureRate(measuresObject, delayedMeasure),
          [pivotField]: pivotValue,
        };

        if (shouldFindRates) {
          object.fraction = {
            value: getMeasureFraction(measuresObject, delayedMeasure),
            key: delayedMeasure,
          };
        }

        return object;
      }
    );

    const regressionData = findRegressionData({
      type: delayedRegressionType,
      keyName: delayedMeasure,
      data: chartData,
    });

    const tooltipItems = [
      { color: brandColors.kentuckyBluegrass, value: regressionData.string },
      {
        value: (
          <>
            R<sup>2</sup> = {regressionData.r2.toLocaleString()}
          </>
        ),
        color: brandColors.kentuckyBluegrass,
      },
    ];

    const finalChartData = chartData.map((object, index) => ({
      ...object,
      predicted: regressionData.outputPoints[index][1],
    }));

    return { chartData: finalChartData, tooltipItems };
  }, [
    totalRow,
    delayedMeasure,
    pivotField,
    shouldFindRates,
    delayedRegressionType,
  ]);

  const csvData = useMemo(
    () =>
      pivotedData
        .map((row) =>
          Object.values(row).filter((value) => typeof value === "object")
        )
        .flat(),
    [pivotedData]
  );

  const waiting = useAutoSizeOnRowDataUpdated({
    rowData: pivotedData,
    ref: gridRef,
  });

  const columnDefs = useMemo(
    () =>
      getColumnDefs({
        measure: delayedMeasure,
        data: pivotedData,
        shouldFindRates,
      }),
    [pivotedData, delayedMeasure, shouldFindRates]
  );

  const defaultColDef = useMemo(() => ({ suppressMovable: true }), []);

  const pivotedDataIsLoading = filteredRowsIsLoading || groupByIsLoading;

  const onSortChanged = useCallback((e) => e.api.refreshCells(), []);

  const onBodyScrollEnd = useCallback((e) => e.api.autoSizeAllColumns(), []);

  console.log(allRows);

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
        autoSize: waiting,
      },
      regressionType,
      dropdowns,
      fileName,
      measure,
      groupBy,
    },
    chart: {
      valueFormatter: !shouldFindRates ? formatMeasureValue : formatMeasureRate,
      barDataKey: delayedMeasure,
      xAxisDataKey: pivotField,
      data: chartData,
      tooltipItems,
    },
    grid: {
      pinnedTopRowData: totalRow,
      columnDefs: columnDefs,
      rowData: pivotedData,
      onBodyScrollEnd,
      defaultColDef,
      onSortChanged,
      ref: gridRef,
    },
    lists: {
      measures: nonOmittedMeasures,
      regressionTypes,
      dropdownItems,
      fileNames,
      groupBys,
    },
    initializers: { isDropdownWithIdOpen, storeDropdownById },
    csvData,
  };
};

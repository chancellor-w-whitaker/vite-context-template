import { createContext, useCallback, useMemo, useRef } from "react";

import {
  findOriginalRegressionResult,
  findNewEquation,
} from "./functions/findRegressionData";
import {
  confidentialityString,
  isConfidential,
} from "./constants/confidentialityNumber";
import { handleAllDropdownItemsChange } from "./functions/handleAllDropdownItemsChange";
import { handleDropdownSubListChange } from "./functions/handleDropdownSubListChange";
import { handleDropdownSearchChange } from "./functions/handleDropdownSearchChange";
import { handleDropdownStateChanges } from "./functions/handleDropdownStateChanges";
import { formatGradRateXValue } from "./functions/formatters/formatGradRateXValue";
import { useAutoSizeOnRowDataUpdated } from "./hooks/useAutoSizeOnRowDataUpdated";
import { getRegressionTooltipItems } from "./functions/getRegressionTooltipItems";
import { handleDropdownItemChange } from "./functions/handleDropdownItemChange";
import { performPivotOperation } from "./functions/performPivotOperation";
import { findRelevantMeasures } from "./functions/findRelevantMeasures";
import { handleGroupByChange } from "./functions/handleGroupByChange";
import { formatMeasureValue } from "./functions/formatMeasureValue";
import { getMeasureFraction } from "./functions/getMeasureFraction";
import { getRowsAndColumns } from "./functions/getRowsAndColumns";
import { findNextDropdowns } from "./functions/findNextDropdowns";
import { formatMeasureRate } from "./functions/formatMeasureRate";
import { useNonBlockingState } from "./hooks/useNonBlockingState";
import { toTitleCase } from "./functions/formatters/toTitleCase";
import { toKebabCase } from "./functions/formatters/toKebabCase";
import { regNames, regTypes } from "./constants/regressionTypes";
import { useResponsiveState } from "./hooks/useResponsiveState";
import { adjustDropdowns } from "./functions/adjustDropdowns";
import { getMeasureValue } from "./functions/getMeasureValue";
import { getMeasureRate } from "./functions/getMeasureRate";
import { getColumnDefs } from "./functions/getColumnDefs";
import { adjustMeasure } from "./functions/adjustMeasure";
import { useBsDropdowns } from "./hooks/useBsDropdowns";
import { getNextTerm } from "./functions/getNextTerm";
import { totalField } from "./constants/totalField";
import { getBaseLog } from "./functions/getBaseLog";
import { useData } from "./hooks/examples/useData";
import { usePrevious } from "./hooks/usePrevious";
import { fileNames } from "./constants/fileNames";
import { fieldDefs } from "./constants/fieldDefs";

export const AppContext = createContext(null);

export const AppContextProvider = ({ initialDropdowns, children }) => {
  const appContext = useMainMethod(initialDropdowns);

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

// first gen, low income, honors, athletes

// add chad to repos

const pivotFields = new Set(fileNames.map(({ pivotField }) => pivotField));

const fileDefaults = {
  defaultDropdowns: {},
  rowRemovalLogic: {},
  measuresToOmit: [],
};

// what about a js linter?

// download un-pivoted data (just including selected measure & rate data handle differently)
// all values are downloading as strings (fix)
// rates should download as numerical (value getter result not value formatter result)

// check bethany email about data page addition

// const columnDefs = [
//   { field: "minority", headerName: "URM" },
//   { headerName: "FT/PT", field: "ftpt" },
//   { headerName: "FT/PT", field: "time" },
//   { headerName: "Retained", field: "numRetained" },
//   { headerName: "Graduated", field: "numGraduated" },
//   { headerName: "Did Not Return", field: "numNotRet" },
//   { headerName: "Course Type", field: "schedule" },
//   { headerName: "4 Year Rate", field: "4YrGraduate" },
//   { headerName: "5 Year Rate", field: "5YrGraduate" },
//   { headerName: "6 Year Rate", field: "6YrGraduate" },
//   {
//     valueFormatter: ({ value }) =>
//       value === "ECampus Online" ? "EKU Online" : value,
//     field: "online",
//   },
// ];

const useMainMethod = (initialDropdowns) => {
  const gridRef = useRef();

  const autoSizeAllColumns = useCallback(
    () => gridRef.current.api.autoSizeAllColumns(),
    []
  );

  const { isDropdownWithIdOpen, storeDropdownById } = useBsDropdowns();

  const [fileName, setFileName] = useNonBlockingState(fileNames[0].id);

  const {
    defaultDropdowns = fileDefaults.defaultDropdowns,
    rowRemovalLogic = fileDefaults.rowRemovalLogic,
    measuresToOmit = fileDefaults.measuresToOmit,
    defaultMeasure = "",
    shouldFindRates,
    displayName,
    pivotField,
  } = fileNames.find(({ id }) => id === fileName);

  const [measure, setMeasure, delayedMeasure] = useResponsiveState();

  const [groupBy, setGroupBy, delayedGroupBy, groupByIsLoading] =
    useResponsiveState([]);

  const [regressionType, setRegressionType, delayedRegressionType] =
    useResponsiveState(regTypes[0].name);

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
    useResponsiveState(initialDropdowns);

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

  const pivotValues = useMemo(() => {
    const set = new Set();

    rows.forEach((row) => set.add(row[pivotField]));

    return set;
  }, [rows, pivotField]);

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

    adjustDropdowns({
      setState: setDropdowns,
      defaultDropdowns,
      nextDropdowns,
    });

    adjustMeasure({
      setState: setMeasure,
      measuresToOmit,
      defaultMeasure,
      columns,
    });

    // adjustGroupBy({ setState: setGroupBy, pivotFields, columns });
  }, [
    columns,
    setMeasure,
    // setGroupBy,
    setDropdowns,
    measuresToOmit,
    defaultMeasure,
    defaultDropdowns,
  ]);

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

  const regressionInformation = useMemo(() => {
    // simpler usage
    const [xKey, yKey] = [pivotField, delayedMeasure];

    // all available data points
    const availableData = Object.entries(totalRow[0]).map(
      ([pivotValue, measuresObject]) => {
        const object = {
          [yKey]: !shouldFindRates
            ? getMeasureValue(measuresObject, yKey)
            : getMeasureRate(measuresObject, yKey),
          [xKey]: pivotValue,
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

    const pivotArray = [...pivotValues];

    const lastTerm = pivotArray[pivotArray.length - 1];

    const predictionTerm = lastTerm
      ? getNextTerm(lastTerm, fileName)
      : `Next ${toTitleCase(pivotField)}`;

    // find data point by term
    const dataByTerm = Object.fromEntries(
      availableData.map((object) => [object[xKey], object])
    );

    // all data points (data point for every term; null for every y value to be predicted)
    const dataPoints = [
      ...pivotArray.map((term) =>
        term in dataByTerm
          ? dataByTerm[term]
          : { [yKey]: shouldFindRates ? null : 0, [xKey]: term }
      ),
      { [xKey]: predictionTerm, [yKey]: null },
    ];

    // data points converted to [x, y] regression input
    const xyValues = dataPoints.map((element, index) => [
      index + 1,
      element[yKey],
    ]);

    // regression input where null y values are removed
    const regressionInput = xyValues.filter(
      ([xValue, yValue]) => yValue !== null
    );

    const regressionResults = regTypes
      .map(({ settings, type, name }) => ({
        ...findOriginalRegressionResult(type, settings, regressionInput),
        type,
        name,
      }))
      .sort((a, b) => b.r2 - a.r2);

    console.log(regressionResults);

    return { regressionResults, dataPoints, xyValues, yKey };
  }, [
    fileName,
    totalRow,
    pivotField,
    pivotValues,
    delayedMeasure,
    shouldFindRates,
  ]);

  const bestRegressionType = regressionInformation.regressionResults[0].name;

  if (regressionType !== bestRegressionType) {
    setRegressionType(bestRegressionType);
  }

  const { tooltipItems, chartData } = useMemo(() => {
    const { regressionResults, dataPoints, xyValues, yKey } =
      regressionInformation;

    // regression result found using regression type and actual regression input
    const regressionResult = regressionResults.find(
      ({ name }) => name === delayedRegressionType
    );

    // easier usage of regression properties
    const { predict, points, r2 } = regressionResult;

    // extract all x values where y value should be predicted
    const predictWhereXEquals = xyValues
      .filter(([xValue, yValue]) => yValue === null)
      .map(([xValue]) => xValue);

    // predicted points include
    // - points in regression result
    // - points calculated from passing each x value with missing a y value to the predict function
    const predictedPoints = [
      ...points,
      ...predictWhereXEquals.map((x) => predict(x)),
    ].sort((a, b) => a[0] - b[0]);

    const chartData = dataPoints.map((point, index) => {
      const prediction = predictedPoints[index][1];

      const isNull = point[yKey] === null;

      const inFuture = isNull ? yKey : false;

      return {
        ...point,
        [yKey]: isNull ? prediction : point[yKey],
        prediction: prediction,
        inFuture,
      };
    });

    const equation = findNewEquation(regressionResult, 1).string;

    const tooltipItems = getRegressionTooltipItems(equation, r2);

    return { tooltipItems, chartData };
  }, [delayedRegressionType, regressionInformation]);

  const domain = useMemo(() => {
    const allValues = [
      ...chartData.map(({ [delayedMeasure]: value }) => value),
      ...chartData.map(({ prediction }) => prediction),
    ];

    const [min, max] = [Math.min(...allValues), Math.max(...allValues)];

    const base = 2;

    const power = Math.floor(getBaseLog(base, min));

    const multiple = Math.pow(base, power);

    const domain = [Math.floor(min / multiple) * multiple, "auto"];

    return domain;
  }, [chartData, delayedMeasure]);

  const nonSelectedMeasures = useMemo(() => {
    const active = new Set([delayedMeasure]);

    if (shouldFindRates) active.add(totalField);

    return measures.filter((string) => !active.has(string));
  }, [measures, delayedMeasure, shouldFindRates]);

  const rowData = useMemo(
    () =>
      filteredRows.length === 0
        ? []
        : relevantGroupBys.length > 0
        ? pivotedData
        : totalRow,
    [totalRow, pivotedData, filteredRows, relevantGroupBys]
  );

  const pinnedTopRowData = useMemo(
    () =>
      filteredRows.length === 0
        ? []
        : relevantGroupBys.length > 0
        ? totalRow
        : [],
    [totalRow, filteredRows, relevantGroupBys]
  );

  const csvData = useMemo(() => {
    const flattenedRows = rowData
      .map((row) =>
        Object.values(row).filter((value) => typeof value === "object")
      )
      .flat();

    return flattenedRows.map((object) => {
      const newObject = { ...object };

      for (const key of nonSelectedMeasures) {
        delete newObject[key];
      }

      if (shouldFindRates) {
        newObject[`${delayedMeasure} / ${totalField}`] =
          newObject[delayedMeasure] / newObject[totalField];
      } else if (
        isConfidential({
          value: newObject[delayedMeasure],
          inFuture: false,
          isRate: false,
        })
      ) {
        newObject[delayedMeasure] = confidentialityString;
      }

      return newObject;
    });
  }, [rowData, nonSelectedMeasures, delayedMeasure, shouldFindRates]);

  // console.log(csvData);

  const waiting = useAutoSizeOnRowDataUpdated({
    rowData: pivotedData,
    ref: gridRef,
  });

  const xAxisTickFormatter = useCallback(
    (tickValue) => {
      if (fileName !== "graduation") return tickValue;

      return formatGradRateXValue(delayedMeasure, tickValue);
    },
    [fileName, delayedMeasure]
  );

  const columnDefs = useMemo(
    () =>
      getColumnDefs({
        headerValueGetter: ({ colDef: { field } }) => xAxisTickFormatter(field),
        measure: delayedMeasure,
        data: pivotedData,
        shouldFindRates,
        fieldDefs,
        totalRow,
      }),
    [pivotedData, totalRow, delayedMeasure, shouldFindRates, xAxisTickFormatter]
  );

  const defaultColDef = useMemo(() => ({ suppressMovable: true }), []);

  const pivotedDataIsLoading = filteredRowsIsLoading || groupByIsLoading;

  const onSortChanged = useCallback((e) => e.api.refreshCells(), []);

  const onBodyScrollEnd = useCallback((e) => e.api.autoSizeAllColumns(), []);

  return {
    state: {
      dropdowns: {
        relevantEntries:
          dropdowns === initialDropdowns
            ? []
            : Object.entries(dropdowns).filter(
                ([key, value]) => value.dataRelevance && !pivotFields.has(key)
              ),
        dropdowns: dropdowns === initialDropdowns ? {} : dropdowns,
      },
      loading: {
        filteredRows: filteredRowsIsLoading,
        pivotedData: pivotedDataIsLoading,
        data: dataIsLoading,
        autoSize: waiting,
      },
      regressionType,
      fileName,
      measure,
      groupBy,
    },
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
    chart: {
      valueFormatter: !shouldFindRates ? formatMeasureValue : formatMeasureRate,
      noRowsToShow: filteredRows.length === 0,
      barDataKey: delayedMeasure,
      xAxisDataKey: pivotField,
      xAxisTickFormatter,
      data: chartData,
      shouldFindRates,
      tooltipItems,
      domain,
    },
    grid: {
      pinnedTopRowData,
      onBodyScrollEnd,
      defaultColDef,
      onSortChanged,
      ref: gridRef,
      columnDefs,
      rowData,
    },
    csv: {
      filename: `${toKebabCase(displayName)}-${toKebabCase(
        toTitleCase(delayedMeasure)
      )}`,

      data: csvData,
    },
    lists: {
      measures: nonOmittedMeasures,
      regressionTypes: regNames,
      dropdownItems,
      fileNames,
      groupBys,
    },
    initializers: { isDropdownWithIdOpen, storeDropdownById },
    autoSizeAllColumns,
    fieldDefs,
  };
};

// const chartValueFormatter = (value, onAxis) =>
//   onAxis ? formatMeasureValue(value) : standardValueFormatter({ value });

import { createContext, useCallback, useState, useMemo, useRef } from "react";

import {
  findOriginalRegressionResult,
  findNewEquation,
} from "./functions/findRegressionData";
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
import { dataFilterCallback } from "./functions/dataFilterCallback";
import { getRowsAndColumns } from "./functions/getRowsAndColumns";
import { findNextDropdowns } from "./functions/findNextDropdowns";
import { formatMeasureRate } from "./functions/formatMeasureRate";
import { useNonBlockingState } from "./hooks/useNonBlockingState";
import { getTicksAndDomain } from "./functions/getTicksAndDomain";
import { toTitleCase } from "./functions/formatters/toTitleCase";
import { regNames, regTypes } from "./constants/regressionTypes";
import { useResponsiveState } from "./hooks/useResponsiveState";
import { adjustDropdowns } from "./functions/adjustDropdowns";
import { getMeasureValue } from "./functions/getMeasureValue";
import { getMeasureRate } from "./functions/getMeasureRate";
import { getColumnDefs } from "./functions/getColumnDefs";
import { adjustMeasure } from "./functions/adjustMeasure";
import { getNextTerm } from "./functions/getNextTerm";
import { isEkuOnline } from "./constants/isEkuOnline";
import { useData } from "./hooks/examples/useData";
import { usePrevious } from "./hooks/usePrevious";
import { fileNames } from "./constants/fileNames";
import { fieldDefs } from "./constants/fieldDefs";

export const AppContext = createContext(null);

const stretchGoalAmount = 8000;

const stretchGoalYear = 2028;

const stretchGoalLabel = `Fall ${stretchGoalYear} Goal`;

export const AppContextProvider = ({ initialDropdowns, children }) => {
  const appContext = useMainMethod(initialDropdowns);

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

const pivotFields = new Set(fileNames.map(({ pivotField }) => pivotField));

const fileDefaults = {
  defaultDropdowns: {},
  rowRemovalLogic: {},
  dropdownsToOmit: [],
  measuresToOmit: [],
};

const useMainMethod = (initialDropdowns) => {
  const gridRef = useRef();

  const [autoSelectReg, setAutoSelectReg] = useState(true);

  const autoSizeAllColumns = useCallback(
    () => gridRef.current.api.autoSizeAllColumns(),
    []
  );

  const [fileName, setFileName] = useNonBlockingState(fileNames[0].id);

  const {
    defaultDropdowns = fileDefaults.defaultDropdowns,
    rowRemovalLogic = fileDefaults.rowRemovalLogic,
    dropdownsToOmit = fileDefaults.dropdownsToOmit,
    measuresToOmit = fileDefaults.measuresToOmit,
    defaultMeasure = "",
    shouldFindRates,
    pivotField,
    note,
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
    ({ target: { value } }) => {
      setAutoSelectReg(false);
      setRegressionType(value);
    },
    [setRegressionType]
  );

  const fetched = useData(`data/${fileName}.json`);

  const data = useMemo(
    () => (Array.isArray(fetched) ? fetched : []).filter(dataFilterCallback),
    [fetched]
  );

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

  const noRowsFilteredOut = filteredRows.length === rows.length;

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
  }, [
    columns,
    setMeasure,
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

  const showStretchGoal =
    delayedMeasure === "total" &&
    fileName === "fall" &&
    noRowsFilteredOut &&
    isEkuOnline;

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
            numerator: getMeasureValue(measuresObject, yKey),
            value: getMeasureFraction(measuresObject, yKey),
            key: yKey,
          };
        }

        return object;
      }
    );

    const pivotArray = [...pivotValues];

    const lastTerm = pivotArray[pivotArray.length - 1];

    const iterations =
      lastTerm && showStretchGoal
        ? stretchGoalYear - Number(lastTerm.split(" ")[1])
        : 1;

    const predictionTerms = Array.from(Array(iterations)).map(
      (element, index) =>
        lastTerm
          ? getNextTerm(lastTerm, fileName, index + 1)
          : `Next ${toTitleCase(pivotField)}`
    );

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
      ...predictionTerms.map((xValue) => ({ [xKey]: xValue, [yKey]: null })),
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

    return { regressionResults, dataPoints, xyValues, yKey };
  }, [
    fileName,
    totalRow,
    pivotField,
    pivotValues,
    delayedMeasure,
    shouldFindRates,
    showStretchGoal,
  ]);

  const bestRegressionType = regressionInformation.regressionResults[0].name;

  if (regressionType !== bestRegressionType && autoSelectReg) {
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

  const { domain: yAxisDomain, ticks: yAxisTicks } = useMemo(() => {
    const dataValues = [
      ...chartData.map(({ [delayedMeasure]: value }) => value),
      ...chartData.map(({ prediction }) => prediction),
    ];

    if (showStretchGoal) dataValues.push(stretchGoalAmount);

    return getTicksAndDomain({ dataValues });
  }, [chartData, delayedMeasure, showStretchGoal]);

  // const domain = useMemo(() => {
  //   const allValues = [
  //     ...chartData.map(({ [delayedMeasure]: value }) => value),
  //     ...chartData.map(({ prediction }) => prediction),
  //   ];

  //   const [min, max] = [Math.min(...allValues), Math.max(...allValues)];

  //   const base = 2;

  //   const power = Math.floor(getBaseLog(base, min));

  //   const multiple = Math.pow(base, power);

  //   const domain = [Math.floor(min / multiple) * multiple, "auto"];

  //   return domain;
  // }, [chartData, delayedMeasure]);

  // const nonSelectedMeasures = useMemo(() => {
  //   const active = new Set([delayedMeasure]);

  //   if (shouldFindRates) active.add(totalField);

  //   return measures.filter((string) => !active.has(string));
  // }, [measures, delayedMeasure, shouldFindRates]);

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

  // const csvData = useMemo(() => {
  //   const flattenedRows = rowData
  //     .map((row) =>
  //       Object.values(row).filter((value) => typeof value === "object")
  //     )
  //     .flat();

  //   return flattenedRows.map((object) => {
  //     const newObject = { ...object };

  //     for (const key of nonSelectedMeasures) {
  //       delete newObject[key];
  //     }

  //     if (shouldFindRates) {
  //       newObject[`${delayedMeasure} / ${totalField}`] =
  //         newObject[delayedMeasure] / newObject[totalField];
  //     } else if (
  //       isConfidential({
  //         value: newObject[delayedMeasure],
  //         inFuture: false,
  //         isRate: false,
  //       })
  //     ) {
  //       newObject[delayedMeasure] = confidentialityString;
  //     }

  //     return newObject;
  //   });
  // }, [rowData, nonSelectedMeasures, delayedMeasure, shouldFindRates]);

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
                ([key, value]) =>
                  value.dataRelevance &&
                  !pivotFields.has(key) &&
                  !dropdownsToOmit.includes(key)
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
      note,
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
      stretchGoal: showStretchGoal && {
        amount: stretchGoalAmount,
        label: stretchGoalLabel,
      },
      valueFormatter: !shouldFindRates ? formatMeasureValue : formatMeasureRate,
      noRowsToShow: filteredRows.length === 0,
      barDataKey: delayedMeasure,
      xAxisDataKey: pivotField,
      xAxisTickFormatter,
      data: chartData,
      shouldFindRates,
      tooltipItems,
      yAxisDomain,
      yAxisTicks,
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
    // csv: {
    //   filename: `${toKebabCase(displayName)}-${toKebabCase(
    //     toTitleCase(delayedMeasure)
    //   )}`,

    //   data: csvData,
    // },
    lists: {
      measures: nonOmittedMeasures,
      regressionTypes: regNames,
      dropdownItems,
      fileNames,
      groupBys,
    },
    autoSizeAllColumns,
    fieldDefs,
  };
};

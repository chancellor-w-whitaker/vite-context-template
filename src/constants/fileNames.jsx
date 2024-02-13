import { RateCellRenderer } from "../components/RateCellRenderer";
import { isNumber } from "../functions/isNumber";

const validateFraction = ({ denominator, numerator, field, data }) =>
  field in data && numerator in data[field] && denominator in data[field];

const rateValueGetter =
  (numerator, denominator) =>
  ({ colDef: { field }, data }) => {
    if (validateFraction({ denominator, numerator, field, data })) {
      const quotient = data[field][numerator] / data[field][denominator];

      return quotient;
    }
  };

const rateValueFormatter =
  (numerator, denominator) =>
  ({ colDef: { field }, value, data }) => {
    if (isNumber(value)) {
      const percentage = value.toLocaleString("en", {
        minimumFractionDigits: 1,
        style: "percent",
      });

      if (validateFraction({ denominator, numerator, field, data })) {
        const fractionString = `(${data[field][
          numerator
        ].toLocaleString()}/${data[field][denominator].toLocaleString()})`;

        return [percentage, fractionString];
      }

      return [percentage];
    }
  };

// rates stuff
// grid specs

export const fileNames = [
  {
    displayName: "Fall Enrollment",
    pivotField: "term",
    colDefs: {},
    id: "fall",
  },
  {
    displayName: "Spring Enrollment",
    pivotField: "term",
    id: "spring",
    colDefs: {},
  },
  {
    displayName: "Summer Enrollment",
    pivotField: "term",
    id: "summer",
    colDefs: {},
  },
  {
    displayName: "Degrees Awarded",
    pivotField: "year",
    id: "degrees",
    colDefs: {},
  },
  {
    colDefs: {
      numGraduated: {
        valueFormatter: rateValueFormatter("numGraduated", "total"),
        valueGetter: rateValueGetter("numGraduated", "total"),
        cellRenderer: RateCellRenderer,
      },
      numRetained: {
        valueFormatter: rateValueFormatter("numRetained", "total"),
        valueGetter: rateValueGetter("numRetained", "total"),
        cellRenderer: RateCellRenderer,
      },
      numNotRet: {
        valueFormatter: rateValueFormatter("numNotRet", "total"),
        valueGetter: rateValueGetter("numNotRet", "total"),
        cellRenderer: RateCellRenderer,
      },
    },
    displayName: "Retention Rates",
    pivotField: "retentionYear",
    measuresToOmit: ["total"],
    id: "retention",
  },
  {
    colDefs: {
      "4YrGraduate": {
        valueFormatter: rateValueFormatter("4YrGraduate", "total"),
        valueGetter: rateValueGetter("4YrGraduate", "total"),
        cellRenderer: RateCellRenderer,
      },
      "5YrGraduate": {
        valueFormatter: rateValueFormatter("5YrGraduate", "total"),
        valueGetter: rateValueGetter("5YrGraduate", "total"),
        cellRenderer: RateCellRenderer,
      },
      "6YrGraduate": {
        valueFormatter: rateValueFormatter("6YrGraduate", "total"),
        valueGetter: rateValueGetter("6YrGraduate", "total"),
        cellRenderer: RateCellRenderer,
      },
    },
    measuresToOmit: ["total", "4YrRate", "5YrRate", "6YrRate"],
    displayName: "Graduation Rates",
    pivotField: "cohortTerm",
    id: "graduation",
  },
  { displayName: "Credit Hours", pivotField: "year", id: "hours", colDefs: {} },
];

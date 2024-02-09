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
      const percentage = value.toLocaleString("en", { style: "percent" });

      if (validateFraction({ denominator, numerator, field, data })) {
        const fractionString = `(${data[field][
          numerator
        ].toLocaleString()} / ${data[field][denominator].toLocaleString()})`;

        return [percentage, fractionString].join(" ");
      }

      return percentage;
    }
  };

// rates stuff
// grid specs

export const fileNames = [
  { displayName: "Fall Enrollment", pivotField: "term", id: "fall" },
  { displayName: "Spring Enrollment", pivotField: "term", id: "spring" },
  { displayName: "Summer Enrollment", pivotField: "term", id: "summer" },
  { displayName: "Degrees Awarded", pivotField: "year", id: "degrees" },
  {
    valueFormatters: {
      numGraduated: rateValueFormatter("numGraduated", "total"),
      numRetained: rateValueFormatter("numRetained", "total"),
      numNotRet: rateValueFormatter("numNotRet", "total"),
    },
    valueGetters: {
      numGraduated: rateValueGetter("numGraduated", "total"),
      numRetained: rateValueGetter("numRetained", "total"),
      numNotRet: rateValueGetter("numNotRet", "total"),
    },
    displayName: "Retention Rates",
    pivotField: "retentionYear",
    measuresToOmit: ["total"],
    id: "retention",
  },
  {
    valueFormatters: {
      "4YrGraduate": rateValueFormatter("4YrGraduate", "total"),
      "5YrGraduate": rateValueFormatter("5YrGraduate", "total"),
      "6YrGraduate": rateValueFormatter("6YrGraduate", "total"),
    },
    valueGetters: {
      "4YrGraduate": rateValueGetter("4YrGraduate", "total"),
      "5YrGraduate": rateValueGetter("5YrGraduate", "total"),
      "6YrGraduate": rateValueGetter("6YrGraduate", "total"),
    },
    measuresToOmit: ["total", "4YrRate", "5YrRate", "6YrRate"],
    displayName: "Graduation Rates",
    pivotField: "cohortTerm",
    id: "graduation",
  },
  { displayName: "Credit Hours", pivotField: "year", id: "hours" },
];

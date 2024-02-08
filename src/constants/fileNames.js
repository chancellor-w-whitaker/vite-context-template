const rateValueGetter =
  (numerator, denominator) =>
  ({ colDef: { field }, data }) => {
    if (field in data) {
      const object = data[field];

      if (numerator in object && denominator in object) {
        return object[numerator] / object[denominator];
      }
    }
  };

const rateValueFormatter = ({ value }) => {
  if (value || value === 0) {
    return value.toLocaleString("en", { style: "percent" });
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
    valueGetters: {
      numGraduated: rateValueGetter("numGraduated", "total"),
      numRetained: rateValueGetter("numRetained", "total"),
      numNotRet: rateValueGetter("numNotRet", "total"),
    },
    valueFormatters: {
      numGraduated: rateValueFormatter,
      numRetained: rateValueFormatter,
      numNotRet: rateValueFormatter,
    },
    displayName: "Retention Rates",
    pivotField: "retentionYear",
    measuresToOmit: ["total"],
    id: "retention",
  },
  {
    valueGetters: {
      "4YrGraduate": rateValueGetter("4YrGraduate", "total"),
      "5YrGraduate": rateValueGetter("5YrGraduate", "total"),
      "6YrGraduate": rateValueGetter("6YrGraduate", "total"),
    },
    valueFormatters: {
      "4YrGraduate": rateValueFormatter,
      "5YrGraduate": rateValueFormatter,
      "6YrGraduate": rateValueFormatter,
    },
    measuresToOmit: ["total", "4YrRate", "5YrRate", "6YrRate"],
    displayName: "Graduation Rates",
    pivotField: "cohortTerm",
    id: "graduation",
  },
  { displayName: "Credit Hours", pivotField: "year", id: "hours" },
];

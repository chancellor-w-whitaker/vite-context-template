export const fileNames = [
  {
    displayName: "Fall Enrollment",
    shouldFindRates: false,
    pivotField: "term",
    id: "fall",
  },
  {
    displayName: "Spring Enrollment",
    shouldFindRates: false,
    pivotField: "term",
    id: "spring",
  },
  {
    displayName: "Summer Enrollment",
    shouldFindRates: false,
    pivotField: "term",
    id: "summer",
  },
  {
    displayName: "Degrees Awarded",
    shouldFindRates: false,
    pivotField: "year",
    id: "degrees",
  },
  {
    defaultDropdowns: {
      grs: {
        items: {
          "Official GRS (Full-time Bachelors Seeking)": {
            checked: true,
          },
          "GRS (Part-time Bachelors Seeking)": {
            checked: false,
          },
          "GRS (Full-time Other Seeking)": {
            checked: false,
          },
          "Non - GRS": {
            checked: false,
          },
        },
      },
    },
    displayName: "Retention Rates",
    pivotField: "retentionYear",
    measuresToOmit: ["total"],
    shouldFindRates: true,
    id: "retention",
  },
  {
    rowRemovalLogic: {
      "4YrGraduate": { key: "4YrRate", value: 0 },
      "5YrGraduate": { key: "5YrRate", value: 0 },
      "6YrGraduate": { key: "6YrRate", value: 0 },
    },
    measuresToOmit: ["total", "4YrRate", "5YrRate", "6YrRate"],
    displayName: "Graduation Rates",
    defaultMeasure: "6YrGraduate",
    pivotField: "cohortTerm",
    shouldFindRates: true,
    id: "graduation",
  },
  {
    displayName: "Credit Hours",
    shouldFindRates: false,
    pivotField: "year",
    id: "hours",
  },
];

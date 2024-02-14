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
    displayName: "Retention Rates",
    pivotField: "retentionYear",
    measuresToOmit: ["total"],
    shouldFindRates: true,
    id: "retention",
  },
  {
    measuresToOmit: ["total", "4YrRate", "5YrRate", "6YrRate"],
    displayName: "Graduation Rates",
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

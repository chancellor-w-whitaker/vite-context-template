const note =
  "Due to recent program, department, and college name changes, IE&R, IT, and the Registrar's office are currently reconciling and aligning all degree programs. As a result, it may be necessary to filter on multiple versions of program names to fulfill data needs. The reconciliation is expected to be complete in Fall 2024.";

export const fileNames = [
  {
    dropdownsToOmit: ["department"],
    displayName: "Fall Enrollment",
    shouldFindRates: false,
    pivotField: "term",
    id: "fall",
    note,
  },
  {
    displayName: "Spring Enrollment",
    dropdownsToOmit: ["department"],
    shouldFindRates: false,
    pivotField: "term",
    id: "spring",
    note,
  },
  {
    displayName: "Summer Enrollment",
    dropdownsToOmit: ["department"],
    shouldFindRates: false,
    pivotField: "term",
    id: "summer",
    note,
  },
  {
    dropdownsToOmit: ["department"],
    displayName: "Degrees Awarded",
    shouldFindRates: false,
    pivotField: "year",
    id: "degrees",
    note,
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
    dropdownsToOmit: ["department"],
    displayName: "Retention Rates",
    pivotField: "retentionYear",
    measuresToOmit: ["total"],
    shouldFindRates: true,
    id: "retention",
    note,
  },
  {
    rowRemovalLogic: {
      "4YrGraduate": { key: "4YrRate", value: 0 },
      "5YrGraduate": { key: "5YrRate", value: 0 },
      "6YrGraduate": { key: "6YrRate", value: 0 },
    },
    measuresToOmit: ["total", "4YrRate", "5YrRate", "6YrRate"],
    displayName: "Graduation Rates",
    dropdownsToOmit: ["department"],
    defaultMeasure: "6YrGraduate",
    pivotField: "cohortTerm",
    shouldFindRates: true,
    id: "graduation",
    note,
  },
  {
    note: "Due to recent program, department, and college name changes, IE&R, IT, and the Registrar's office are currently reconciling and aligning all degree programs. As a result, it may be necessary to filter on multiple versions of department names to fulfill data needs. The reconciliation is expected to be complete in Fall 2024.",
    displayName: "Credit Hours",
    shouldFindRates: false,
    dropdownsToOmit: [],
    pivotField: "year",
    id: "hours",
  },
];

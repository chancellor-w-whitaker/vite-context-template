const defaultNote =
  "Due to recent program, department, and college name changes, IE&R, IT, and the Registrar's office are currently reconciling and aligning all degree programs. As a result, it may be necessary to filter on multiple versions of program names to fulfill data needs. The reconciliation is expected to be complete in Fall 2024.";

const retentionNote =
  "Retention rates indicate cohort students who return to EKU in any major, not only those who return to a specific program (even if a specific program is selected).";

const graduationNote =
  "Graduation rates indicate cohort students who graduate from EKU in any major, not only those who graduate from a specific program (even if a specific program is selected).";

const hoursNote =
  "Due to recent program, department, and college name changes, IE&R, IT, and the Registrar's office are currently reconciling and aligning all degree programs. As a result, it may be necessary to filter on multiple versions of department names to fulfill data needs. The reconciliation is expected to be complete in Fall 2024.";

const notes = {
  graduation: [defaultNote, graduationNote],
  retention: [defaultNote, retentionNote],
  unspecified: [defaultNote],
  hours: [hoursNote],
};

export const fileNames = [
  {
    dropdownsToOmit: ["department"],
    displayName: "Fall Enrollment",
    note: notes.unspecified,
    shouldFindRates: false,
    pivotField: "term",
    id: "fall",
  },
  {
    displayName: "Spring Enrollment",
    dropdownsToOmit: ["department"],
    note: notes.unspecified,
    shouldFindRates: false,
    pivotField: "term",
    id: "spring",
  },
  {
    displayName: "Summer Enrollment",
    dropdownsToOmit: ["department"],
    note: notes.unspecified,
    shouldFindRates: false,
    pivotField: "term",
    id: "summer",
  },
  {
    dropdownsToOmit: ["department"],
    displayName: "Degrees Awarded",
    note: notes.unspecified,
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
    dropdownsToOmit: ["department"],
    displayName: "Retention Rates",
    pivotField: "retentionYear",
    measuresToOmit: ["total"],
    shouldFindRates: true,
    note: notes.retention,
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
    dropdownsToOmit: ["department"],
    defaultMeasure: "6YrGraduate",
    pivotField: "cohortTerm",
    note: notes.graduation,
    shouldFindRates: true,
    id: "graduation",
  },
  {
    displayName: "Credit Hours",
    shouldFindRates: false,
    dropdownsToOmit: [],
    pivotField: "year",
    note: notes.hours,
    id: "hours",
  },
];

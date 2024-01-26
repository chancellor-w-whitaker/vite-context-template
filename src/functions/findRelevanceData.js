import { getRelevantValueData } from "./getRelevantValueData";
import { getFilteredRowData } from "./getFilteredRowData";

export const findRelevanceData = (rowData, columnData, dropdownSelections) => {
  // ! string fields of current column data--only columns that can be dropdowns with values relevant to current data
  const currentFields = Object.entries(columnData)
    .filter((entry) => entry[1].type === "string")
    .map(([field]) => field);

  // ! of current fields, find fields in dropdown state where some values are unchecked
  const modifiedDropdownFields = currentFields.filter(
    (field) =>
      dropdownSelections[field] &&
      Object.values(dropdownSelections[field]).some((checked) => !checked)
  );

  // ! entire filtered row data--derived from current row data, string fields found in current column data, & deferred dropdown state
  const filteredRowData = getFilteredRowData(
    rowData,
    currentFields,
    dropdownSelections
  );

  // ! find relevant values of every current string field
  // ! relevant value data of modified dropdown fields will get overwritten--relevant values of those is being calculated here unnecessarily
  const relevantValueData = getRelevantValueData(
    filteredRowData,
    currentFields
  );

  // ! for each relevant modified dropdown field, get filtered row data where all values of field are assumed to be checked
  modifiedDropdownFields.forEach((field, index) => {
    // ! don't need to consider field of current iteration in row data filtering algorithm
    const currentOneRemoved = [
      ...modifiedDropdownFields.slice(0, index),
      ...modifiedDropdownFields.slice(index + 1),
    ];

    const thisFilteredRowData = getFilteredRowData(
      rowData,
      currentOneRemoved,
      dropdownSelections
    );

    // ! from this filtered row data, find every unique value found only for field of current iteration
    const thisRelevantValueData = getRelevantValueData(thisFilteredRowData, [
      field,
    ]);

    // ! for every modified dropdown field,
    // ! overwrite its unique values with its unique values found from a filtered row data where the field's dropdown selections are removed from the entire dropdown selections
    relevantValueData[field] = thisRelevantValueData[field];
  });

  // ! for each current field, differentiate relevant & irrelevant values of field's values in current row data
  const dropdownListData = Object.fromEntries(
    currentFields.map((field) => [
      field,
      {
        irrelevant: columnData[field].values.filter(
          (value) => !relevantValueData[field]?.has(value)
        ),
        relevant: columnData[field].values.filter((value) =>
          relevantValueData[field]?.has(value)
        ),
      },
    ])
  );

  // ! return dropdown list data to be used when rendering dropdowns & filtered row data to be used when rendering Visualization or Data Grid
  return { dropdownListData, filteredRowData };
};

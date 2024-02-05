export const pivotData = ({
  pivotField = "",
  measures = [],
  groupBy = [],
  data = [],
}) => {
  // contains references to all pivoted rows
  const magicArray = [];

  const totalRow = {};

  // structure that gets traversed when building nested objects
  // (for every unique combination of values, nest n levels, n being length of groupBy)
  const tree = {};

  // iterate rows
  data?.forEach((row) => {
    // root changes as you nest inward
    let currentRoot = tree;

    // value to be become a column header in grid table (or to become a key in row object)
    const pivotValue = row[pivotField];

    // field:value pairs
    const entries = [];

    // for each field being grouped by,
    groupBy.forEach((column, index) => {
      // do something different when last index
      const isLastIndex = index === groupBy.length - 1;

      // value of current field in row
      const columnValue = row[column];

      // store pair
      entries.push([column, columnValue]);

      // if value has not been recorded yet,
      if (!(columnValue in currentRoot)) {
        // if iterating on last field in group by,
        if (isLastIndex) {
          // have reached row to be in final grid, so initialize object from group by key:value pairs
          currentRoot[columnValue] = Object.fromEntries(entries);

          // add to magic array to set its position in array
          // (can modify object using its reference while traversing tree; no need to locate in array later! :) how cool!)
          magicArray.push(currentRoot[columnValue]);
        } else {
          // if not iterating on last field in group by, since value has not been recorded yet, create its data structure
          currentRoot[columnValue] = {};
        }
      }

      // iterate tree to next nesting level (move root forward by 1)
      // (currentRoot[columnValue] was either created on this group by iteration or an earlier one)
      currentRoot = currentRoot[columnValue];

      // group by value will have been recorded by now
      // again, if last group by index,
      if (isLastIndex) {
        // currentRoot is now known to be a reference to a row object that has already been pushed to the final array (the first time the unique group by value->value->...->value combination was traversed)
        // so since the pivot value is meant to become a column header in the grid, add it as a key to each row
        // (it gets added as an object because I total each measure inside of this object)
        // (when data gets rendered in grid, I can change how the grid reads data for each column)
        // (therefore, the grid gets told to point to the currently selected measure inside of whatever data is located at the pivot values in each row)
        // (already having the values summed for each measure->for each pivot value->for each table row 😂 prevents the need to perform this pivot operation when changing measure)
        if (!(pivotValue in currentRoot)) currentRoot[pivotValue] = {};

        // operate on total row as well
        // (convenient to find totals within this data looping function instead of performing another summing loop elsewhere)
        if (!(pivotValue in totalRow)) totalRow[pivotValue] = {};

        // if structure for pivot value in row has already been created, iterate root
        currentRoot = currentRoot[pivotValue];

        // convenient reference to object located at pivot value in total row
        const totalRowInnerNode = totalRow[pivotValue];

        // for each measure field,
        measures.forEach((measure) => {
          // helper variable created for measure's value in row
          const numericValue = row[measure];

          // if this is the first time measure has been placed in this data structure,
          // initialize sum to 0
          if (!(measure in currentRoot)) currentRoot[measure] = 0;

          // perform same operation for object at pivot value in total row
          if (!(measure in totalRowInnerNode)) totalRowInnerNode[measure] = 0;

          // to prevent null or undefined values from being added to total, check type of row's measure value before performing addition operation
          if (typeof numericValue === "number") {
            // add row's measure value to running total in currentRoot
            currentRoot[measure] += numericValue;

            // perform same operation for object at pivot value in total row
            totalRowInnerNode[measure] += numericValue;
          }
        });
      }
    });
  });

  // magic array has the objects you created and modified during data traversal,
  // even though you never had to operate on the array or locate the objects in the array after pushing them (due to referential equality)
  return { topRowData: [totalRow], rowData: magicArray };
};

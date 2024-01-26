// ! for each row -> for each field -> if some row[field] value not checked (state[field][value]), filter row out of data
export const getFilteredRowData = (rowData, fields, dropdownSelections) => {
  return rowData.filter((row) => {
    for (const field of fields) {
      const value = row[field];

      // ! precede condition in case dropdown doesn't exist (may be logic error)
      if (dropdownSelections[field] && !dropdownSelections[field][value]) {
        return false;
      }
    }

    return true;
  });
};

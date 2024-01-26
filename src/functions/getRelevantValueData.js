// ! in passed row data, field all unique values of every field passed
export const getRelevantValueData = (rowData, fields) => {
  const relevantValueData = {};

  rowData.forEach((row) => {
    fields.forEach((field) => {
      if (!(field in relevantValueData)) relevantValueData[field] = new Set();

      const value = row[field];

      relevantValueData[field].add(value);
    });
  });

  return relevantValueData;
};

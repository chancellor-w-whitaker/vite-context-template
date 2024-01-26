import { standardizeKey } from "./standardizeKey";

export const initializeDashboardData = (data) => {
  // ! if data is not lengthy array
  if (!(Array.isArray(data) && data.length > 0)) {
    // ! handle return values & their types early
    return { dropdownData: {}, columnData: {}, rowData: [] };
  }

  // ! initialize row data (rebuild with standardized keys while looping data)
  const rowData = [];

  /* 
    ! for every key found in data, derive...
    {
      key1: {
        types: { type1: timesCounted, ..., typeN: timesCounted },
        values: Set(...),
        field: "...",
      },
      ...,
      keyN: { ... }
    }
    */
  let columnData = {};

  data.forEach((row) => {
    // ! row that will have standardized keys
    const newRow = {};

    // ! iterate keys for every row in case some rows are missing keys
    Object.keys(row).forEach((key) => {
      // ! don't overwrite key in columnData once saved
      if (!(key in columnData)) {
        columnData[key] = {
          field: standardizeKey(key),
          values: new Set(),
          types: {},
        };
      }

      const { values, field, types } = columnData[key];

      const value = row[key];

      values.add(value);

      const type = typeof value;

      if (!(type in types)) types[type] = 0;

      types[type]++;

      newRow[field] = value;
    });

    rowData.push(newRow);
  });

  // ! wrote to a variable in case this changes
  const validTypes = ["string", "number"];

  // ! turn values to array to sort
  // ! narrow type down to most frequently occurring valid type
  // ! map field to respective info object instead of key
  // ! return columnData as an object so it can be used as a lookup
  columnData = Object.fromEntries(
    Object.values(columnData).map(({ values, field, types }) => [
      field,
      {
        type: Object.keys(types)
          .filter((type) => validTypes.includes(type))
          .sort((typeA, typeB) => types[typeB] - types[typeA])[0],
        values: Array.from(values).sort(),
      },
    ])
  );

  // ! derive dropdown state structure from columnData as if they dropdown state is being initialized for the first time
  const dropdownData = Object.fromEntries(
    Object.entries(columnData)
      .filter((entry) => entry[1].type === "string")
      .map(([field, { values }]) => [
        field,
        Object.fromEntries(values.map((value) => [value, true])),
      ])
  );

  // ! return each value that will be used elsewhere
  return { dropdownData, columnData, rowData };
};

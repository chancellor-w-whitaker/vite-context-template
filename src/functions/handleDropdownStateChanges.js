export const handleDropdownStateChanges = ({ dropdowns, rows }) => {
  const dataRelevantFields = Object.keys(dropdowns).filter(
    (field) => dropdowns[field].dataRelevance
  );

  const dataRelevantModifiedFields = dataRelevantFields.filter((field) =>
    // dropdowns[field] &&
    Object.values(dropdowns[field].items).some(({ checked }) => !checked)
  );

  const getFilteredRows = ({ dropdowns, fields, rows }) => {
    return rows.filter((row) => {
      for (const field of fields) {
        const value = row[field];

        // ! precede condition in case dropdown doesn't exist (may be logic error)
        if (
          dropdowns[field].items[value] &&
          !dropdowns[field].items[value].checked
        ) {
          return false;
        }
      }

      return true;
    });
  };

  const findSetOfValuesPerField = ({ fields, rows }) => {
    const valueSets = {};

    rows.forEach((row) => {
      fields.forEach((field) => {
        if (!(field in valueSets)) valueSets[field] = new Set();

        const value = row[field];

        valueSets[field].add(value);
      });
    });

    return valueSets;
  };

  const filteredRows = getFilteredRows({
    fields: dataRelevantFields,
    dropdowns: dropdowns,
    rows,
  });

  const fieldValueSets = findSetOfValuesPerField({
    fields: dataRelevantFields,
    rows: filteredRows,
  });

  dataRelevantModifiedFields.forEach((thisField, index) => {
    const thisFieldRemoved = [
      ...dataRelevantModifiedFields.slice(0, index),
      ...dataRelevantModifiedFields.slice(index + 1),
    ];

    const thisFilteredRows = getFilteredRows({
      fields: thisFieldRemoved,
      dropdowns: dropdowns,
      rows,
    });

    const thisFieldValueSets = findSetOfValuesPerField({
      rows: thisFilteredRows,
      fields: [thisField],
    });

    fieldValueSets[thisField] = thisFieldValueSets[thisField];
  });

  const booleanToBinary = (boolean) => (boolean ? 1 : 0);

  const findQueryInValue = (query, value) =>
    booleanToBinary(value.toLowerCase().includes(query.toLowerCase()));

  const sortBySearch = (search) => (valueA, valueB) =>
    findQueryInValue(search, valueB) - findQueryInValue(search, valueA);

  const dropdownItems = Object.fromEntries(
    Object.entries(dropdowns).map(([field, { search, items }]) => [
      field,
      {
        irrelevant: (!(field in fieldValueSets)
          ? Object.entries(items)
              .filter((entry) => entry[1].dataRelevance)
              .map(([value]) => value)
          : Object.entries(items)
              .filter(
                ([value, { dataRelevance }]) =>
                  dataRelevance && !fieldValueSets[field]?.has(value)
              )
              .map(([value]) => value)
        ).sort(sortBySearch(search)),
        relevant: (!(field in fieldValueSets)
          ? []
          : Object.entries(items)
              .filter(
                ([value, { dataRelevance }]) =>
                  dataRelevance && fieldValueSets[field]?.has(value)
              )
              .map(([value]) => value)
        ).sort(sortBySearch(search)),
        unavailable: Object.entries(items)
          .filter((entry) => !entry[1].dataRelevance)
          .map(([value]) => value)
          .sort(sortBySearch(search)),
      },
    ])
  );

  return { dropdownItems, filteredRows };
};

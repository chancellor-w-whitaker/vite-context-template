export const adjustGroupBy = ({ pivotFields, setState, columns }) =>
  setState((previousGroupBy) => {
    const nextRelevantOptions = Object.entries(columns)
      .filter(
        ([field, { type }]) => type === "string" && !pivotFields.has(field)
      )
      .map(([field]) => field);

    const relevantOptionsSet = new Set(nextRelevantOptions);

    const filteredGroupBy = previousGroupBy.filter((option) =>
      relevantOptionsSet.has(option)
    );

    return filteredGroupBy.length === 0
      ? [...previousGroupBy, nextRelevantOptions[0]]
      : previousGroupBy;
  });

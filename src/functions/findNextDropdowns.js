export const findNextDropdowns = (columns) =>
  Object.fromEntries(
    Object.entries(columns)
      .filter((entry) => entry[1].type === "string")
      .map(([field, { values }]) => [
        field,
        {
          items: Object.fromEntries(
            values.map((value) => [
              value,
              { dataRelevance: true, checked: true },
            ])
          ),
          dataRelevance: true,
          search: "",
        },
      ])
  );

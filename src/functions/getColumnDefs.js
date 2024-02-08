export const getColumnDefs = ({
  valueFormatters,
  valueGetters,
  measure,
  data,
}) => {
  if (!(Array.isArray(data) && data.length > 0)) {
    return [];
  }

  const rowIdDef = {
    valueGetter: (e) =>
      !("rowPinned" in e.node) ? e.node.rowIndex + 1 : "Total",
    headerName: "Row",
  };

  const restOfColumnDefs = Object.entries(data[0]).map(
    ([field, stringOrObject]) => {
      if (typeof stringOrObject === "string") {
        return { field };
      } else {
        const type = "numericColumn";

        const valueGetter =
          measure in valueGetters
            ? valueGetters[measure]
            : ({ colDef: { field }, data }) => {
                if (field in data) {
                  return data[field][measure];
                }
              };

        const valueFormatter =
          measure in valueFormatters
            ? valueFormatters[measure]
            : ({ value }) => {
                if (value) {
                  return value.toLocaleString();
                }
              };

        return { valueFormatter, valueGetter, field, type };
      }
    }
  );

  return [rowIdDef, ...restOfColumnDefs];
};

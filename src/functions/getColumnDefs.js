import { isNumber } from "./isNumber";

export const getColumnDefs = ({ colDefs, measure, data }) => {
  if (!(Array.isArray(data) && data.length > 0)) {
    return [];
  }

  const rowIdDef = {
    valueGetter: (e) =>
      !("rowPinned" in e.node) ? e.node.rowIndex + 1 : "Total",
    headerName: "Row",
    pinned: "left",
  };

  const restOfColumnDefs = Object.entries(data[0]).map(
    ([field, stringOrObject]) => {
      if (typeof stringOrObject === "string") {
        return { field };
      } else {
        const type = "numericColumn";

        const defaultValueGetter = ({ colDef: { field }, data }) => {
          if (field in data) {
            return data[field][measure];
          }
        };

        const defaultValueFormatter = ({ value }) => {
          if (isNumber(value)) {
            return Math.round(value).toLocaleString();
          }
        };

        const object = {
          valueFormatter: defaultValueFormatter,
          valueGetter: defaultValueGetter,
          field,
          type,
        };

        return !(measure in colDefs)
          ? object
          : { ...object, ...colDefs[measure] };
      }
    }
  );

  return [rowIdDef, ...restOfColumnDefs];
};

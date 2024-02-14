export const rowIdColumnDef = {
  valueGetter: (e) =>
    !("rowPinned" in e.node) ? e.node.rowIndex + 1 : "Total",
  headerName: "Row",
  pinned: "left",
};

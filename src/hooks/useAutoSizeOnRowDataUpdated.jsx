import { useDeferredValue, useLayoutEffect } from "react";

export const useAutoSizeOnRowDataUpdated = ({ rowData, ref }) => {
  const deferredRowData = useDeferredValue(rowData);

  useLayoutEffect(() => {
    ref.current.api && ref.current.api.autoSizeAllColumns();
  }, [ref, deferredRowData]);

  return rowData !== deferredRowData;
};

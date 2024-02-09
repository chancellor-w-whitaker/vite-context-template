import { AgGridReact } from "ag-grid-react";
import { forwardRef, memo } from "react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

export const GridContainer = ({ theme = "quartz", className, ...rest }) => {
  return (
    <div className={`ag-theme-${theme} ${className}`.trimEnd()} {...rest}></div>
  );
};

export const Grid = memo(
  forwardRef((props, ref) => {
    return <AgGridReact {...props} ref={ref} />;
  })
);

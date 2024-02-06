import { AgGridReact } from "ag-grid-react";
import { forwardRef, memo } from "react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

const defaultContainerStyle = { height: 500 };

export const GridContainer = ({
  className = "ag-theme-quartz",
  style = defaultContainerStyle,
  ...rest
}) => {
  return <div className={className} style={style} {...rest}></div>;
};

export const Grid = memo(
  forwardRef((props, ref) => {
    return <AgGridReact {...props} ref={ref} />;
  })
);

import { useCallback } from "react";

import { FormFloatingSelect, SelectOption } from "./FormFloatingSelect";
import { findSingleItemLabel } from "../functions/findSingleItemLabel";
import { useConsumeAppContext } from "../hooks/useConsumeAppContext";
import { toTitleCase } from "../functions/formatters/toTitleCase";
import { getDropdownData } from "../functions/getDropdownData";
import { getBestRowCols } from "../functions/getBestRowCols";
import { W3DropdownItem, W3Dropdown } from "./W3Dropdown";
import { useElementSize } from "../hooks/useElementSize";
import { usePopover } from "../hooks/usePopover";
import { MyDropdownItem } from "./MyDropdown";
import { GridContainer, Grid } from "./Grid";
import { Popover } from "./Popover";
import { Chart } from "./Chart";

// replace values less than 5 with an *
// replace "minority" string.toLowerCase() with URM

const regressionAnswers = {
  "polynomial (order of 3)": (
    <div>
      <div>
        Polynomial regression is the simplest type of non-linear regression,
        where the relationship between the dependent and independent variables
        can be modeled as an nth degree polynomial function.
      </div>
      {/* <RegSource></RegSource> */}
    </div>
  ),
  polynomial: (
    <div>
      <div>
        Polynomial regression is the simplest type of non-linear regression,
        where the relationship between the dependent and independent variables
        can be modeled as an nth degree polynomial function.
      </div>
      {/* <RegSource></RegSource> */}
    </div>
  ),
  exponential: (
    <div>
      <div>
        Exponential regression is a type of non-linear regression where the
        dependent variable is modeled as an exponential function of the
        independent variable.
      </div>
      {/* <RegSource></RegSource> */}
    </div>
  ),
  logarithmic: (
    <div>
      <div>
        Logarithmic regression is a type of non-linear regression where the
        dependent variable is modeled as a logarithmic function of the
        independent variable.
      </div>
      {/* <RegSource></RegSource> */}
    </div>
  ),
  power: (
    <div>
      <div>
        Power regression is a type of non-linear regression where the dependent
        variable is modeled as a power function of the independent variable.
      </div>
      {/* <RegSource></RegSource> */}
    </div>
  ),
  linear: (
    <div>
      <div>
        Linear regression is a statistical model which estimates the linear
        relationship between a dependent and independent variable.
      </div>
      {/* <RegSource></RegSource> */}
    </div>
  ),
};

const Question = ({ children }) => {
  const { popover, isOpen, open } = usePopover();

  return (
    <div
      style={{
        border: "1px solid transparent",
        marginBottom: "0.75rem",
        marginLeft: "0.75rem",
      }}
      className="w3-dropdown position-absolute bottom-0 z-3"
    >
      <button
        className="btn btn-primary p-0 border-0 rounded-0 d-flex align-items-end text-dark bg-transparent"
        onClick={open}
      >
        <svg
          className="bi bi-question-circle-fill"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          height={16}
          width={16}
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
        </svg>
        ​
      </button>
      {isOpen && (
        <div className="w3-dropdown-content" ref={popover}>
          <div className="tooltip show">
            <div className="tooltip-inner">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Dashboard = () => {
  const context = useConsumeAppContext();

  const {
    onChange: {
      regressionType: onRegressionTypeChange,
      dropdowns: onDropdownsChange,
      fileName: onFileNameChange,
      measure: onMeasureChange,
      groupBy: onGroupByChange,
    },
    state: {
      dropdowns: { relevantEntries },
      regressionType,
      fileName,
      groupBy,
      measure,
      loading,
      note,
    },
    lists: { regressionTypes, dropdownItems, fileNames, groupBys, measures },
    autoSizeAllColumns,
    grid: gridProps,
    fieldDefs,
    chart,
  } = context;

  const { ref: gridRef } = gridProps;

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, [gridRef]);

  const [squareRef, { width = 0 }] = useElementSize();

  const getFieldTitle = (field) => {
    return field in fieldDefs && "headerName" in fieldDefs[field]
      ? fieldDefs[field].headerName
      : toTitleCase(field);
  };

  const getFormattedValue = ({ search, value, field }) => {
    return findSingleItemLabel({
      value:
        field in fieldDefs && "valueFormatter" in fieldDefs[field]
          ? fieldDefs[field].valueFormatter({ value })
          : value,
      search,
    });
  };

  const getSortedList = (list, field) =>
    field in fieldDefs && "comparator" in fieldDefs[field]
      ? [...list].sort(fieldDefs[field].comparator)
      : list;

  const chartProps = { ...chart, nameFormatter: getFieldTitle };

  return (
    <>
      <div className="d-flex flex-column gap-4" ref={squareRef}>
        {/* subtitle */}
        <div className="text-center">
          <h3 className="mb-0 h3">
            {fileNames.find(({ id }) => id === fileName).displayName}
          </h3>
        </div>
        {/* single-select selectors */}
        <div className="d-flex flex-row gap-2 flex-wrap">
          {/* select data */}
          <FormFloatingSelect
            className="col col-max-md-12"
            onChange={onFileNameChange}
            value={fileName}
            label="Data"
          >
            {fileNames.map(({ displayName, id }) => (
              <SelectOption value={id} key={id}>
                {displayName}
              </SelectOption>
            ))}
          </FormFloatingSelect>
          {/* select measure */}
          <FormFloatingSelect
            className="col col-max-md-12"
            onChange={onMeasureChange}
            value={measure}
            label="Measure"
          >
            {measures.map((field) => (
              <SelectOption value={field} key={field}>
                {getFieldTitle(field)}
              </SelectOption>
            ))}
          </FormFloatingSelect>
          {/* select regression */}
          <FormFloatingSelect
            more={
              <>
                <Question>{regressionAnswers[regressionType]}</Question>
              </>
            }
            label={<div className="icon-link">Regression Type</div>}
            onChange={onRegressionTypeChange}
            className="col col-max-md-12"
            selectClassName="pl-36px"
            value={regressionType}
          >
            {regressionTypes.map((type) => (
              <SelectOption value={type} key={type}>
                {toTitleCase(type)}
              </SelectOption>
            ))}
          </FormFloatingSelect>
        </div>
        {/* dropdown filters */}
        <div
          className="d-flex flex-wrap justify-content-evenly"
          style={{ marginBottom: -8, marginRight: -8 }}
        >
          {relevantEntries.map(([field, { search, items }]) => {
            const {
              values: { unavailable, irrelevant, relevant },
              fractions,
            } = getDropdownData({ valueData: dropdownItems[field], items });

            // console.log(unavailable, irrelevant, relevant);

            const rowColumns = getBestRowCols({
              count: relevantEntries.length,
              width,
            })?.rowColumns;

            const moreThanOneListToShow =
              [irrelevant, relevant, unavailable].filter(
                (array) => array.length > 0
              ).length > 1;

            return (
              // dropdown
              <Popover
                hide={
                  <div className="d-block dropdown-menu py-0 mx-0 rounded-3 shadow-sm overflow-hidden">
                    {
                      // isDropdownWithIdOpen(field) &&
                      <>
                        {/* dropdown search */}
                        <form
                          className="p-2 bg-body-tertiary border-bottom"
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <input
                            onChange={onDropdownsChange.search}
                            placeholder="Type to search..."
                            className="form-control"
                            name={`${field}-search`}
                            autoComplete="false"
                            value={search}
                            type="search"
                          />
                        </form>
                        {/* dropdown lists */}
                        <div
                          className="list-group list-group-flush text-nowrap overflow-y-scroll"
                          style={{ maxHeight: 300 }}
                        >
                          {/* all button when many lists */}
                          {moreThanOneListToShow && (
                            <MyDropdownItem
                              onChange={onDropdownsChange.allItems}
                              checked={fractions.all.condition}
                              fraction={fractions.all.string}
                              name={`${field}-items`}
                              relevance="all"
                            >
                              All
                            </MyDropdownItem>
                          )}
                          {/* relevant label */}
                          {relevant.length > 0 && (
                            <MyDropdownItem
                              onChange={onDropdownsChange.relevantItems}
                              checked={fractions.relevant.condition}
                              fraction={fractions.relevant.string}
                              hideInput={moreThanOneListToShow}
                              name={`${field}-items`}
                              relevance="relevant"
                            >
                              {moreThanOneListToShow ? "Relevant" : "All"}
                            </MyDropdownItem>
                          )}
                          {/* relevant list items */}
                          {getSortedList(relevant, field).map((value) => (
                            <MyDropdownItem
                              onChange={onDropdownsChange.singleItem}
                              checked={items[value].checked}
                              name={`${field}-items`}
                              relevance="relevant"
                              value={value}
                              key={value}
                              singleItem
                            >
                              {getFormattedValue({ search, field, value })}
                            </MyDropdownItem>
                          ))}
                          {/* irrelevant label */}
                          {irrelevant.length > 0 && (
                            <MyDropdownItem
                              onChange={onDropdownsChange.irrelevantItems}
                              checked={fractions.irrelevant.condition}
                              fraction={fractions.irrelevant.string}
                              hideInput={moreThanOneListToShow}
                              name={`${field}-items`}
                              relevance="irrelevant"
                            >
                              {moreThanOneListToShow ? "Irrelevant" : "All"}
                            </MyDropdownItem>
                          )}
                          {/* irrelevant list items */}
                          {getSortedList(irrelevant, field).map((value) => (
                            <MyDropdownItem
                              checked={items[value].checked}
                              name={`${field}-items`}
                              relevance="irrelevant"
                              value={value}
                              key={value}
                              singleItem
                            >
                              {getFormattedValue({ search, field, value })}
                            </MyDropdownItem>
                          ))}
                          {/* unavailable label */}
                          {unavailable.length > 0 && (
                            <MyDropdownItem
                              onChange={onDropdownsChange.unavailableItems}
                              checked={fractions.unavailable.condition}
                              fraction={fractions.unavailable.string}
                              hideInput={moreThanOneListToShow}
                              name={`${field}-items`}
                              relevance="unavailable"
                            >
                              {moreThanOneListToShow ? "Unavailable" : "All"}
                            </MyDropdownItem>
                          )}
                          {/* unavailable list items */}
                          {getSortedList(unavailable, field).map((value) => (
                            <MyDropdownItem
                              checked={items[value].checked}
                              name={`${field}-items`}
                              relevance="unavailable"
                              value={value}
                              key={value}
                              singleItem
                            >
                              {getFormattedValue({ search, field, value })}
                            </MyDropdownItem>
                          ))}
                        </div>
                      </>
                    }
                  </div>
                }
                openWith={
                  <button
                    // ref={(buttonNode) => {
                    //   storeDropdownById(field, buttonNode);
                    //   if (buttonNode) {
                    //     buttonNode.classList.remove("btn-secondary");
                    //     buttonNode.classList.remove("btn-warning");
                    //     if (fractions.all.condition) {
                    //       buttonNode.classList.add("btn-secondary");
                    //     } else {
                    //       buttonNode.classList.add("btn-warning");
                    //     }
                    //   }
                    // }}
                    className={`align-items-center justify-content-center w-100 d-flex btn bg-gradient dropdown-toggle shadow-sm ${
                      fractions.all.condition ? "btn-secondary" : "btn-warning"
                    }`}
                    // data-bs-auto-close="outside"
                    title={getFieldTitle(field)}
                    // data-bs-toggle="dropdown"
                    // aria-expanded="false"
                    type="button"
                  >
                    <div className="text-truncate">{getFieldTitle(field)}</div>
                  </button>
                }
                style={{
                  width: `${Math.floor(100 / rowColumns)}%`,
                }}
                className={`dropdown flex-fill pe-2 pb-2`}
                key={field}
              ></Popover>
            );
          })}
        </div>
        {/* bar chart */}
        <Chart {...chartProps}></Chart>
        <div>
          <div className="fw-bold text-decoration-underline">Notes</div>
          <ul>
            {note.map((string, i) => (
              <li key={i}>{`${string}`}</li>
            ))}
          </ul>
        </div>
        {/* <div>{`NOTE: ${note}`}</div> */}
        {/* data grid menu */}
        <div className="d-flex flex-row gap-2 flex-wrap">
          <button
            className="btn btn-success shadow-sm bg-gradient d-flex align-items-center justify-content-center"
            onClick={onBtnExport}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              height={20}
              width={20}
            >
              <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V304H176c-35.3 0-64 28.7-64 64V512H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM200 352h16c22.1 0 40 17.9 40 40v8c0 8.8-7.2 16-16 16s-16-7.2-16-16v-8c0-4.4-3.6-8-8-8H200c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8v-8c0-8.8 7.2-16 16-16s16 7.2 16 16v8c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40zm133.1 0H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H333.1c-7.2 0-13.1 5.9-13.1 13.1c0 5.2 3 9.9 7.8 12l37.4 16.6c16.3 7.2 26.8 23.4 26.8 41.2c0 24.9-20.2 45.1-45.1 45.1H304c-8.8 0-16-7.2-16-16s7.2-16 16-16h42.9c7.2 0 13.1-5.9 13.1-13.1c0-5.2-3-9.9-7.8-12l-37.4-16.6c-16.3-7.2-26.8-23.4-26.8-41.2c0-24.9 20.2-45.1 45.1-45.1zm98.9 0c8.8 0 16 7.2 16 16v31.6c0 23 5.5 45.6 16 66c10.5-20.3 16-42.9 16-66V368c0-8.8 7.2-16 16-16s16 7.2 16 16v31.6c0 34.7-10.3 68.7-29.6 97.6l-5.1 7.7c-3 4.5-8 7.1-13.3 7.1s-10.3-2.7-13.3-7.1l-5.1-7.7c-19.3-28.9-29.6-62.9-29.6-97.6V368c0-8.8 7.2-16 16-16z" />
            </svg>
          </button>
          {/* download */}
          {/* <CSVLink
            className="btn btn-success shadow-sm bg-gradient d-flex align-items-center justify-content-center"
            role="button"
            {...csv}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              height={20}
              width={20}
            >
              <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V304H176c-35.3 0-64 28.7-64 64V512H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM200 352h16c22.1 0 40 17.9 40 40v8c0 8.8-7.2 16-16 16s-16-7.2-16-16v-8c0-4.4-3.6-8-8-8H200c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8v-8c0-8.8 7.2-16 16-16s16 7.2 16 16v8c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40zm133.1 0H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H333.1c-7.2 0-13.1 5.9-13.1 13.1c0 5.2 3 9.9 7.8 12l37.4 16.6c16.3 7.2 26.8 23.4 26.8 41.2c0 24.9-20.2 45.1-45.1 45.1H304c-8.8 0-16-7.2-16-16s7.2-16 16-16h42.9c7.2 0 13.1-5.9 13.1-13.1c0-5.2-3-9.9-7.8-12l-37.4-16.6c-16.3-7.2-26.8-23.4-26.8-41.2c0-24.9 20.2-45.1 45.1-45.1zm98.9 0c8.8 0 16 7.2 16 16v31.6c0 23 5.5 45.6 16 66c10.5-20.3 16-42.9 16-66V368c0-8.8 7.2-16 16-16s16 7.2 16 16v31.6c0 34.7-10.3 68.7-29.6 97.6l-5.1 7.7c-3 4.5-8 7.1-13.3 7.1s-10.3-2.7-13.3-7.1l-5.1-7.7c-19.3-28.9-29.6-62.9-29.6-97.6V368c0-8.8 7.2-16 16-16z" />
            </svg>
          </CSVLink> */}
          <W3Dropdown title="Group by">
            {groupBys.map((field) => (
              <W3DropdownItem
                onClick={() => onGroupByChange({ target: { value: field } })}
                checked={groupBy.includes(field)}
                key={field}
              >
                {getFieldTitle(field)}
              </W3DropdownItem>
            ))}
          </W3Dropdown>
          <button
            className="btn btn-primary shadow-sm bg-gradient"
            onClick={autoSizeAllColumns}
            type="button"
          >
            Auto-Size Columns
          </button>
        </div>
        {/* data grid */}
        <GridContainer
          className={loading.autoSize ? "auto-sizing" : ""}
          style={defaultGridContainerStyle}
        >
          <Grid {...gridProps}></Grid>
        </GridContainer>
      </div>
    </>
  );
};

const defaultGridContainerStyle = { height: 500 };

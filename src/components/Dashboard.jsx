import { CSVLink } from "react-csv";

import { MyDropdownInput, MyDropdownLabel, MyDropdownItem } from "./MyDropdown";
import { FloatingLabelSelect, SelectOption } from "./FloatingLabelSelect";
import { findSingleItemLabel } from "../functions/findSingleItemLabel";
import { useConsumeAppContext } from "../hooks/useConsumeAppContext";
import { toTitleCase } from "../functions/formatters/toTitleCase";
import { getDropdownData } from "../functions/getDropdownData";
import { getBestRowCols } from "../functions/getBestRowCols";
import { useElementSize } from "../hooks/useElementSize";
import { GridContainer, Grid } from "./Grid";
import { Chart } from "./Chart";

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
    state: { regressionType, dropdowns, fileName, groupBy, measure, loading },
    lists: { regressionTypes, dropdownItems, fileNames, groupBys, measures },
    initializers: { isDropdownWithIdOpen, storeDropdownById },
    grid: gridProps,
    chart,
    csv,
  } = context;

  const relevantDropdownEntries = Object.entries(dropdowns).filter(
    (entry) => entry[1].dataRelevance
  );

  const [squareRef, { width = 0 }] = useElementSize();

  // console.log(width, height);

  return (
    <>
      <div className="d-flex flex-column gap-4" ref={squareRef}>
        <div className="text-center">
          <h1 className="display-3 mb-1">Factbook</h1>
          <h3 className="fw-normal text-muted mb-0">
            {fileNames.find(({ id }) => id === fileName).displayName}
          </h3>
        </div>
        <div className="d-flex flex-row gap-2 flex-wrap">
          {/* select data */}
          <FloatingLabelSelect
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
          </FloatingLabelSelect>
          {/* select measure */}
          <FloatingLabelSelect
            className="col col-max-md-12"
            onChange={onMeasureChange}
            value={measure}
            label="Measure"
          >
            {measures.map((field) => (
              <SelectOption value={field} key={field}>
                {toTitleCase(field)}
              </SelectOption>
            ))}
          </FloatingLabelSelect>
          {/* select regression */}
          <FloatingLabelSelect
            onChange={onRegressionTypeChange}
            className="col col-max-md-12"
            value={regressionType}
            label="Regression"
          >
            {regressionTypes.map((type) => (
              <SelectOption value={type} key={type}>
                {toTitleCase(type)}
              </SelectOption>
            ))}
          </FloatingLabelSelect>
        </div>
        {/* filters */}
        <div
          className="d-flex flex-wrap justify-content-evenly"
          style={{ marginBottom: -8, marginRight: -8 }}
        >
          {/* column filters */}
          {relevantDropdownEntries.map(([field, { search, items }]) => {
            const {
              values: { unavailable, irrelevant, relevant },
              fractions,
            } = getDropdownData({ valueData: dropdownItems[field], items });

            const rowColumns = getBestRowCols({
              count: relevantDropdownEntries.length,
              width,
            })?.rowColumns;

            return (
              <div
                style={{
                  width: `${Math.floor(100 / rowColumns)}%`,
                }}
                className={`dropdown flex-fill pe-2 pb-2`}
                key={field}
              >
                <button
                  ref={(buttonNode) => {
                    storeDropdownById(field, buttonNode);
                    if (buttonNode) {
                      buttonNode.classList.remove("btn-secondary");
                      buttonNode.classList.remove("btn-warning");
                      if (fractions.all.condition) {
                        buttonNode.classList.add("btn-secondary");
                      } else {
                        buttonNode.classList.add("btn-warning");
                      }
                    }
                  }}
                  className={`align-items-center justify-content-center w-100 d-flex btn bg-gradient dropdown-toggle shadow-sm`}
                  data-bs-auto-close="outside"
                  title={toTitleCase(field)}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  type="button"
                >
                  <div className="text-truncate">{toTitleCase(field)}</div>
                </button>
                <div className="dropdown-menu py-0 mx-0 rounded-3 shadow-sm overflow-hidden">
                  {isDropdownWithIdOpen(field) && (
                    <>
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
                      <div
                        className="list-group list-group-flush text-nowrap overflow-y-scroll"
                        style={{ maxHeight: 300 }}
                      >
                        {[irrelevant, relevant, unavailable].filter(
                          (array) => array.length > 0
                        ).length > 1 && (
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
                        {relevant.length > 0 && (
                          <MyDropdownItem
                            onChange={onDropdownsChange.relevantItems}
                            checked={fractions.relevant.condition}
                            fraction={fractions.relevant.string}
                            name={`${field}-items`}
                            relevance="relevant"
                          >
                            Relevant
                          </MyDropdownItem>
                        )}
                        {relevant.map((value) => (
                          <MyDropdownItem
                            onChange={onDropdownsChange.singleItem}
                            checked={items[value].checked}
                            name={`${field}-items`}
                            relevance="relevant"
                            value={value}
                            key={value}
                            singleItem
                          >
                            {findSingleItemLabel({ search, value })}
                          </MyDropdownItem>
                        ))}
                        {irrelevant.length > 0 && (
                          <MyDropdownItem
                            onChange={onDropdownsChange.irrelevantItems}
                            checked={fractions.irrelevant.condition}
                            fraction={fractions.irrelevant.string}
                            name={`${field}-items`}
                            relevance="irrelevant"
                          >
                            Irrelevant
                          </MyDropdownItem>
                        )}
                        {irrelevant.map((value) => (
                          <MyDropdownItem
                            checked={items[value].checked}
                            name={`${field}-items`}
                            relevance="irrelevant"
                            value={value}
                            key={value}
                            singleItem
                          >
                            {findSingleItemLabel({ search, value })}
                          </MyDropdownItem>
                        ))}
                        {unavailable.length > 0 && (
                          <MyDropdownItem
                            onChange={onDropdownsChange.unavailableItems}
                            checked={fractions.unavailable.condition}
                            fraction={fractions.unavailable.string}
                            name={`${field}-items`}
                            relevance="unavailable"
                          >
                            Unavailable
                          </MyDropdownItem>
                        )}
                        {unavailable.map((value) => (
                          <MyDropdownItem
                            checked={items[value].checked}
                            name={`${field}-items`}
                            relevance="unavailable"
                            value={value}
                            key={value}
                            singleItem
                          >
                            {findSingleItemLabel({ search, value })}
                          </MyDropdownItem>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* chart */}
        <Chart {...chart}></Chart>
        <div className="d-flex flex-row gap-2 flex-wrap">
          {/* download */}
          <CSVLink
            className="btn btn-success shadow-sm bg-gradient d-flex align-items-center justify-content-center"
            role="button"
            {...csv}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="bi bi-filetype-csv"
              fill="currentColor"
              viewBox="0 0 16 16"
              height={16}
              width={16}
            >
              <path
                d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM3.517 14.841a1.13 1.13 0 0 0 .401.823q.195.162.478.252.284.091.665.091.507 0 .859-.158.354-.158.539-.44.187-.284.187-.656 0-.336-.134-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.566-.21l-.621-.144a1 1 0 0 1-.404-.176.37.37 0 0 1-.144-.299q0-.234.185-.384.188-.152.512-.152.214 0 .37.068a.6.6 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.2-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.439 0-.776.15-.337.149-.527.421-.19.273-.19.639 0 .302.122.524.124.223.352.367.228.143.539.213l.618.144q.31.073.463.193a.39.39 0 0 1 .152.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.167.07-.413.07-.175 0-.32-.04a.8.8 0 0 1-.248-.115.58.58 0 0 1-.255-.384zM.806 13.693q0-.373.102-.633a.87.87 0 0 1 .302-.399.8.8 0 0 1 .475-.137q.225 0 .398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.4 1.4 0 0 0-.489-.272 1.8 1.8 0 0 0-.606-.097q-.534 0-.911.223-.375.222-.572.632-.195.41-.196.979v.498q0 .568.193.976.197.407.572.626.375.217.914.217.439 0 .785-.164t.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.8.8 0 0 1-.118.363.7.7 0 0 1-.272.25.9.9 0 0 1-.401.087.85.85 0 0 1-.478-.132.83.83 0 0 1-.299-.392 1.7 1.7 0 0 1-.102-.627zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879z"
                fillRule="evenodd"
              />
            </svg>
          </CSVLink>
          <FloatingLabelSelect>
            {/* {regressionTypes.map((type) => (
              <SelectOption value={type} key={type}>
                {toTitleCase(type)}
              </SelectOption>
            ))} */}
          </FloatingLabelSelect>
        </div>
        {/* select group by */}
        {/* <div className="list-group shadow-sm">
          {groupBys.map((field) => (
            <MyDropdownLabel className="border-0" key={field}>
              <MyDropdownInput
                checked={groupBy.includes(field)}
                onChange={onGroupByChange}
                name="group-by"
                type="checkbox"
                value={field}
              ></MyDropdownInput>
              <span>{toTitleCase(field)}</span>
            </MyDropdownLabel>
          ))}
        </div> */}
        {/* grid */}
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

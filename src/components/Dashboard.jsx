import { CSVLink } from "react-csv";

import { MyDropdownInput, MyDropdownLabel, MyDropdownItem } from "./MyDropdown";
import { findSingleItemLabel } from "../functions/findSingleItemLabel";
import { useConsumeAppContext } from "../hooks/useConsumeAppContext";
import { getDropdownData } from "../functions/getDropdownData";
import { getBestRowCols } from "../functions/getBestRowCols";
import { useElementSize } from "../hooks/useElementSize";
import { toTitleCase } from "../functions/toTitleCase";
import { GridContainer, Grid } from "./Grid";

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
    csvData,
  } = context;

  const relevantDropdownEntries = Object.entries(dropdowns).filter(
    (entry) => entry[1].dataRelevance
  );

  const [squareRef, { width = 0 }] = useElementSize();

  // console.log(width, height);

  return (
    <>
      <div className="d-flex flex-column gap-4" ref={squareRef}>
        {/* select file */}
        <div className="list-group shadow-sm">
          {fileNames.map(({ displayName, id }) => (
            <MyDropdownLabel className="border-0" key={id}>
              <MyDropdownInput
                onChange={onFileNameChange}
                checked={id === fileName}
                name="file-name"
                type="radio"
                value={id}
              ></MyDropdownInput>
              <span>{displayName}</span>
            </MyDropdownLabel>
          ))}
        </div>
        {/* select measure */}
        <div className="list-group shadow-sm">
          {measures.map((field) => (
            <MyDropdownLabel className="border-0" key={field}>
              <MyDropdownInput
                checked={field === measure}
                onChange={onMeasureChange}
                name="measure"
                value={field}
                type="radio"
              ></MyDropdownInput>
              <span>{toTitleCase(field)}</span>
            </MyDropdownLabel>
          ))}
        </div>
        {/* select regression type */}
        <div className="list-group shadow-sm">
          {regressionTypes.map((type) => (
            <MyDropdownLabel className="border-0" key={type}>
              <MyDropdownInput
                checked={type === regressionType}
                onChange={onRegressionTypeChange}
                name="regression-type"
                value={type}
                type="radio"
              ></MyDropdownInput>
              <span>{toTitleCase(type)}</span>
            </MyDropdownLabel>
          ))}
        </div>
        {/* select group by */}
        <div className="list-group shadow-sm">
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
        </div>
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
        <CSVLink
          className="btn btn-success shadow-sm bg-gradient"
          data={csvData}
          role="button"
        >
          Download me
        </CSVLink>
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

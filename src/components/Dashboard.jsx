import { forwardRef, Fragment, memo } from "react";

import { useConsumeAppContext } from "../hooks/useConsumeAppContext";
import { combineClassNames } from "../functions/combineClassNames";
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
    lists: { regressionTypes, dropdownItems, fileNames, groupBys, measures },
    state: { regressionType, dropdowns, fileName, groupBy, measure },
    initializers: { isDropdownWithIdOpen, storeDropdownById },
    grid: { exportDataAsCsv, ...gridProps },
  } = context;

  const relevantDropdownEntries = Object.entries(dropdowns).filter(
    (entry) => entry[1].dataRelevance
  );

  const [squareRef, { height = 0, width = 0 }] = useElementSize();

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
        <div className="d-flex flex-wrap justify-content-evenly">
          {/* column filters */}
          {relevantDropdownEntries.map(([field, { search, items }]) => {
            const {
              values: { unavailable, irrelevant, relevant },
              fractions,
            } = getDropdownData({ valueData: dropdownItems[field], items });

            const size = relevantDropdownEntries.length;

            // why 12?
            // sort zeros first
            // compare width of zeros to width of greatest remainder

            const mods = initArrayOfSize(12).map((col) => ({
              mod: size % col,
              col,
            }));

            const zeros = mods.filter(({ mod }) => mod === 0);

            const nonZeros = mods.filter(({ mod }) => mod !== 0);

            const something = mods
              .sort((a, b) => b.mod - a.mod)
              .filter(({ col }) => width / col > 125);

            const col = something[0]?.col;

            // console.log(width / col);

            return (
              <div
                style={{
                  width: `${(1 / col).toLocaleString("en", {
                    style: "percent",
                  })}`,
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
        <button
          className="btn btn-success shadow-sm bg-gradient"
          onClick={exportDataAsCsv}
          type="button"
        >
          Export Data as Csv
        </button>
        <GridContainer>
          <Grid {...gridProps}></Grid>
        </GridContainer>
      </div>
    </>
  );
};
const initArrayOfSize = (length = 5) => {
  return Array.from({ length }, (x, i) => i + 1);
};

const MyDropdownItem = memo(
  ({
    relevance = "relevant",
    singleItem = false,
    fraction = false,
    value = "value",
    checked = true,
    name = "name",
    onChange,
    children,
  }) => {
    const labelClassList = [];

    const inputClassList = [];

    let opacity = 100;

    const readOnly =
      singleItem && ["unavailable", "irrelevant"].includes(relevance);

    if (singleItem) {
      inputClassList.push("ms-4");

      labelClassList.push(...["border-0", "small"]);

      if (readOnly) {
        labelClassList.push("pe-none");
      }

      if (relevance === "irrelevant") {
        opacity = 50;
      }

      if (relevance === "unavailable") {
        opacity = 25;
      }
    } else {
      labelClassList.push("scroll-sticky-0");
    }

    inputClassList.push(`opacity-${opacity}`);

    return (
      <MyDropdownLabel className={labelClassList.join(" ")}>
        <MyDropdownInput
          className={inputClassList.join(" ")}
          onChange={onChange}
          readOnly={readOnly}
          checked={checked}
          value={value}
          name={name}
        ></MyDropdownInput>
        <span className={`opacity-${opacity}`}>{children}</span>
        {fraction && (
          <MyDropdownBadge checked={checked}>{fraction}</MyDropdownBadge>
        )}
      </MyDropdownLabel>
    );
  }
);

MyDropdownItem.displayName = "MyDropdownItem";

const MyDropdownLabel = ({ className = "", children }) => {
  return (
    <label
      className={combineClassNames("list-group-item d-flex gap-2", className)}
    >
      {children}
    </label>
  );
};

const MyDropdownInput = ({ type = "checkbox", className = "", ...rest }) => {
  return (
    <input
      {...rest}
      className={combineClassNames("form-check-input flex-shrink-0", className)}
      type={type}
    />
  );
};

const MyDropdownBadge = ({
  checkedVariant = "primary",
  uncheckedVariant = "light",
  className = "",
  children,
  checked,
}) => {
  const origClassName = `ms-auto badge transition-all shadow-sm text-bg-${
    checked ? checkedVariant : uncheckedVariant
  } rounded-pill d-flex align-items-center`;

  return (
    <span className={combineClassNames(origClassName, className)}>
      {children}
    </span>
  );
};

const OldDropdown = forwardRef(
  ({ className = "", children, title, style }, ref) => {
    return (
      <>
        <div className="dropdown">
          <button
            className={`btn bg-gradient dropdown-toggle w-100 ${className}`.trimEnd()}
            data-bs-auto-close="outside"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={style}
            type="button"
            ref={ref}
          >
            {title}
          </button>
          {children}
        </div>
      </>
    );
  }
);

OldDropdown.displayName = "Dropdown";

const getDropdownData = ({ valueData, items }) => {
  const { unavailable = [], irrelevant = [], relevant = [] } = valueData ?? {};

  const checked = Object.entries(items)
    .filter((entry) => entry[1].checked)
    .map(([value]) => value);

  const checkedSet = new Set(checked);

  const irrelevantChecked = irrelevant.filter((value) => checkedSet.has(value));

  const relevantChecked = relevant.filter((value) => checkedSet.has(value));

  const unavailableChecked = unavailable.filter((value) =>
    checkedSet.has(value)
  );

  const fractions = {
    unavailable: getFractionData(unavailableChecked.length, unavailable.length),
    irrelevant: getFractionData(irrelevantChecked.length, irrelevant.length),
    relevant: getFractionData(relevantChecked.length, relevant.length),
    all: getFractionData(checked.length, Object.keys(items).length),
  };

  return { values: { unavailable, irrelevant, relevant }, fractions };
};

const getFractionData = (numerator, denominator) => ({
  string: `${numerator} / ${denominator}`,
  condition: numerator === denominator,
});

const findSingleItemLabel = ({ search, value }) => {
  const indexOfQuery = value.toLowerCase().indexOf(search.toLowerCase());

  const queryFound = indexOfQuery !== -1;

  const queryValid = search.trim().length > 0;

  const shouldHighlight = queryFound && queryValid;

  return !shouldHighlight
    ? value
    : [
        {
          text: value.substring(0, indexOfQuery),
          highlight: false,
        },
        {
          text: value.substring(indexOfQuery, indexOfQuery + search.length),
          highlight: true,
        },
        {
          text: value.substring(indexOfQuery + search.length),
          highlight: false,
        },
      ].map(({ highlight, text }, index) => (
        <Fragment key={index}>
          {!highlight ? <span>{text}</span> : <mark>{text}</mark>}
        </Fragment>
      ));
};

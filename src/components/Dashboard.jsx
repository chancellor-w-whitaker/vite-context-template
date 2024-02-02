import { forwardRef, Fragment, memo } from "react";

import { useConsumeAppContext } from "../hooks/useConsumeAppContext";
import { combineClassNames } from "../functions/combineClassNames";
import { toTitleCase } from "../functions/toTitleCase";

export const Dashboard = () => {
  const context = useConsumeAppContext();

  const {
    onDropdownAllUnavailableChange,
    onDropdownAllIrrelevantChange,
    onDropdownAllRelevantChange,
    onDropdownAllItemsChange,
    onDropdownSearchChange,
    filteredRowsIsLoading,
    isDropdownWithIdOpen,
    onDropdownItemChange,
    onSelectedDataChange,
    storeDropdownById,
    dropdownItems,
    dataIsLoading,
    selectedData,
    filteredRows,
    dataOptions,
    dropdowns,
    rows,
  } = context;

  const numberOfFilteredRows = `${filteredRows.length.toLocaleString()} / ${rows.length.toLocaleString()}`;

  const loading = dataIsLoading || filteredRowsIsLoading;

  const getFractionData = (numerator, denominator) => ({
    string: `${numerator} / ${denominator}`,
    condition: numerator === denominator,
  });

  const getDropdownData = ({ field, items }) => {
    const {
      unavailable = [],
      irrelevant = [],
      relevant = [],
    } = dropdownItems[field] ?? {};

    const checked = Object.entries(items)
      .filter((entry) => entry[1].checked)
      .map(([value]) => value);

    const checkedSet = new Set(checked);

    const irrelevantChecked = irrelevant.filter((value) =>
      checkedSet.has(value)
    );

    const relevantChecked = relevant.filter((value) => checkedSet.has(value));

    const unavailableChecked = unavailable.filter((value) =>
      checkedSet.has(value)
    );

    const fractions = {
      unavailable: getFractionData(
        unavailableChecked.length,
        unavailable.length
      ),
      irrelevant: getFractionData(irrelevantChecked.length, irrelevant.length),
      relevant: getFractionData(relevantChecked.length, relevant.length),
      all: getFractionData(checked.length, Object.keys(items).length),
    };

    return { values: { unavailable, irrelevant, relevant }, fractions };
  };

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

  return (
    <>
      <div className="d-flex flex-column gap-4">
        {/* select file */}
        <ListGroup className="shadow-sm">
          {dataOptions.map(({ displayName, id }) => (
            <ListGroupItem
              onChange={onSelectedDataChange}
              checked={id === selectedData}
              name="selected-data"
              type="radio"
              value={id}
              key={id}
            >
              {displayName}
            </ListGroupItem>
          ))}
        </ListGroup>
        <div className="d-flex flex-wrap gap-3">
          {/* column filters */}
          {Object.entries(dropdowns).map(
            ([field, { dataRelevance, search, items }]) => {
              const {
                values: { unavailable, irrelevant, relevant },
                fractions,
              } = getDropdownData({ items, field });

              return (
                dataRelevance && (
                  <OldDropdown
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
                    className={`shadow-sm opacity-${dataRelevance ? 100 : 25}`}
                    style={{ minWidth: 250, width: 250 }}
                    title={toTitleCase(field)}
                    key={field}
                  >
                    <div className="dropdown-menu py-0 mx-0 rounded-3 shadow-sm overflow-hidden">
                      {isDropdownWithIdOpen(field) && (
                        <>
                          <form
                            className="p-2 bg-body-tertiary border-bottom"
                            onSubmit={(e) => e.preventDefault()}
                          >
                            <input
                              onChange={onDropdownSearchChange}
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
                                onChange={onDropdownAllItemsChange}
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
                                onChange={onDropdownAllRelevantChange}
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
                                onChange={onDropdownItemChange}
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
                                onChange={onDropdownAllIrrelevantChange}
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
                                onChange={onDropdownAllUnavailableChange}
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
                  </OldDropdown>
                )
              );
            }
          )}
        </div>
        <div>
          {loading ? "Loading..." : `${numberOfFilteredRows} filtered rows`}
        </div>
      </div>
    </>
  );
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

// export const Dashboard = () => {
//   return (
//     <div className="d-flex flex-column gap-5">
//       <Accordion></Accordion>
//       <Dropdown
//         button={({ header, ref }) => (
//           <DropdownButton variant="primary" ref={ref}>
//             {header}
//           </DropdownButton>
//         )}
//         menu={({ content, isOpen }) => (
//           <DropdownMenu>{isOpen && content}</DropdownMenu>
//         )}
//         autoClose="outside"
//       ></Dropdown>
//     </div>
//   );
// };

const ListGroupItem = memo(({ className = "", children, ...restOfProps }) => {
  return (
    <>
      <label
        className={`list-group-item border-0 d-flex gap-2 ${className}`.trimEnd()}
      >
        <input className="form-check-input flex-shrink-0" {...restOfProps} />
        <span>{children}</span>
      </label>
    </>
  );
});

ListGroupItem.displayName = "ListGroupItem";

const ListGroup = ({ className = "", ...restOfProps }) => {
  return (
    <>
      <div
        className={`list-group ${className}`.trimEnd()}
        {...restOfProps}
      ></div>
    </>
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

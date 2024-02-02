import { forwardRef, memo } from "react";

import { useConsumeAppContext } from "../hooks/useConsumeAppContext";
import { toTitleCase } from "../functions/toTitleCase";

export const Dashboard = () => {
  const context = useConsumeAppContext();

  const {
    onDropdownAllItemsChange,
    onDropdownSubListChange,
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
                              <label className="list-group-item d-flex gap-2 scroll-sticky-0">
                                <input
                                  className="form-check-input flex-shrink-0"
                                  onChange={onDropdownAllItemsChange}
                                  checked={fractions.all.condition}
                                  name={`${field}-items`}
                                  type="checkbox"
                                />
                                <span>All</span>
                                <span
                                  className={`ms-auto badge transition-all shadow-sm text-bg-${
                                    fractions.all.condition
                                      ? "primary"
                                      : "light"
                                  } rounded-pill d-flex align-items-center`}
                                >
                                  {fractions.all.string}
                                </span>
                              </label>
                            )}
                            {relevant.length > 0 && (
                              <label className="list-group-item d-flex gap-2 scroll-sticky-0">
                                <input
                                  onChange={(e) =>
                                    onDropdownSubListChange(e, "relevant")
                                  }
                                  className="form-check-input flex-shrink-0"
                                  checked={fractions.relevant.condition}
                                  name={`${field}-items`}
                                  type="checkbox"
                                />
                                <span>Relevant</span>
                                <span
                                  className={`ms-auto badge transition-all shadow-sm text-bg-${
                                    fractions.relevant.condition
                                      ? "primary"
                                      : "light"
                                  } rounded-pill d-flex align-items-center`}
                                >
                                  {fractions.relevant.string}
                                </span>
                              </label>
                            )}
                            {relevant.map((value) => {
                              const indexOfSearch = value
                                .toLowerCase()
                                .indexOf(search.toLowerCase());

                              const substrings =
                                indexOfSearch === -1
                                  ? [
                                      {
                                        text: value.substring(),
                                        bg: "transparent",
                                      },
                                    ]
                                  : [
                                      {
                                        text: value.substring(0, indexOfSearch),
                                        bg: "transparent",
                                      },
                                      {
                                        text: value.substring(
                                          indexOfSearch,
                                          indexOfSearch + search.length
                                        ),
                                        bg: "warning",
                                      },
                                      {
                                        text: value.substring(
                                          indexOfSearch + search.length
                                        ),
                                        bg: "transparent",
                                      },
                                    ];

                              return (
                                <label
                                  className="list-group-item border-0 d-flex gap-2 small"
                                  key={value}
                                >
                                  <input
                                    className="ms-4 form-check-input flex-shrink-0"
                                    onChange={onDropdownItemChange}
                                    checked={items[value].checked}
                                    name={`${field}-items`}
                                    type="checkbox"
                                    value={value}
                                    key={value}
                                  />
                                  <span>
                                    {substrings.map(({ text, bg }, index) => (
                                      <span className={`bg-${bg}`} key={index}>
                                        {text}
                                      </span>
                                    ))}
                                  </span>
                                  {/* <span>{value}</span> */}
                                </label>
                              );
                            })}
                            {irrelevant.length > 0 && (
                              <label className="list-group-item d-flex gap-2 scroll-sticky-0">
                                <input
                                  onChange={(e) =>
                                    onDropdownSubListChange(e, "irrelevant")
                                  }
                                  className="form-check-input flex-shrink-0"
                                  checked={fractions.irrelevant.condition}
                                  name={`${field}-items`}
                                  type="checkbox"
                                  readOnly
                                />
                                <span>Irrelevant</span>
                                <span
                                  className={`ms-auto badge transition-all shadow-sm text-bg-${
                                    fractions.irrelevant.condition
                                      ? "primary"
                                      : "light"
                                  } rounded-pill d-flex align-items-center`}
                                >
                                  {fractions.irrelevant.string}
                                </span>
                              </label>
                            )}
                            {irrelevant.map((value) => (
                              <label
                                className="list-group-item border-0 d-flex gap-2 small pe-none"
                                key={value}
                              >
                                <input
                                  className="ms-4 form-check-input flex-shrink-0 opacity-50"
                                  checked={items[value].checked}
                                  name={`${field}-items`}
                                  type="checkbox"
                                  value={value}
                                  key={value}
                                  readOnly
                                />
                                <span className="opacity-50">{value}</span>
                              </label>
                            ))}
                            {unavailable.length > 0 && (
                              <label className="list-group-item d-flex gap-2 scroll-sticky-0">
                                <input
                                  onChange={(e) =>
                                    onDropdownSubListChange(e, "unavailable")
                                  }
                                  className="form-check-input flex-shrink-0"
                                  checked={fractions.unavailable.condition}
                                  name={`${field}-items`}
                                  type="checkbox"
                                />
                                <span>Unavailable</span>
                                <span
                                  className={`ms-auto badge transition-all shadow-sm text-bg-${
                                    fractions.unavailable.condition
                                      ? "primary"
                                      : "light"
                                  } rounded-pill d-flex align-items-center`}
                                >
                                  {fractions.unavailable.string}
                                </span>
                              </label>
                            )}
                            {unavailable.map((value) => (
                              <label
                                className="list-group-item border-0 d-flex gap-2 small pe-none"
                                key={value}
                              >
                                <input
                                  className="ms-4 form-check-input flex-shrink-0 opacity-25"
                                  checked={items[value].checked}
                                  name={`${field}-items`}
                                  type="checkbox"
                                  value={value}
                                  key={value}
                                  readOnly
                                />
                                <span className="opacity-25">{value}</span>
                              </label>
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

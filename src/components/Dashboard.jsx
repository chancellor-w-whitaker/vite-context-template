import { forwardRef, memo } from "react";

import { useConsumeAppContext } from "../hooks/useConsumeAppContext";
import { toTitleCase } from "../functions/toTitleCase";

export const Dashboard = () => {
  const context = useConsumeAppContext();

  const {
    onDropdownAllSubsetChange,
    onDropdownAllItemChange,
    onDropdownSearchChange,
    filteredRowsIsLoading,
    isDropdownWithIdOpen,
    onDropdownItemChange,
    onSelectedDataChange,
    dropdownValueLists,
    storeDropdownById,
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
      irrelevantValues = [],
      relevantValues = [],
      lostValues = [],
    } = dropdownValueLists[field] ?? {};

    const checkedValues = Object.entries(items)
      .filter((entry) => entry[1].checked)
      .map(([value]) => value);

    const setOfCheckedValues = new Set(checkedValues);

    const checkedIrrelevantValues = irrelevantValues.filter((value) =>
      setOfCheckedValues.has(value)
    );

    const checkedRelevantValues = relevantValues.filter((value) =>
      setOfCheckedValues.has(value)
    );

    const checkedLostValues = lostValues.filter((value) =>
      setOfCheckedValues.has(value)
    );

    const fractions = {
      irrelevant: getFractionData(
        checkedIrrelevantValues.length,
        irrelevantValues.length
      ),
      relevant: getFractionData(
        checkedRelevantValues.length,
        relevantValues.length
      ),
      all: getFractionData(checkedValues.length, Object.keys(items).length),
      lost: getFractionData(checkedLostValues.length, lostValues.length),
    };

    return {
      values: {
        irrelevant: irrelevantValues,
        relevant: relevantValues,
        lost: lostValues,
      },
      fractions,
    };
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
            ([field, { dataRelevance: fieldDataRelevance, search, items }]) => {
              const {
                values: { irrelevant, relevant, lost },
                fractions,
              } = getDropdownData({ items, field });

              return (
                <Dropdown
                  ref={(buttonNode) => storeDropdownById(field, buttonNode)}
                  className={`opacity-${fieldDataRelevance ? 100 : 25}`}
                  title={toTitleCase(field)}
                  key={field}
                >
                  <div className="dropdown-menu py-0 mx-0 rounded-3 shadow-sm overflow-hidden">
                    {isDropdownWithIdOpen(field) && (
                      <>
                        <form className="p-2 mb-2 bg-body-tertiary border-bottom">
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
                          className="list-group list-group-flush text-nowrap pb-2 bg-white overflow-y-scroll"
                          style={{ maxHeight: 300 }}
                        >
                          {[irrelevant, relevant, lost].filter(
                            (array) => array.length > 0
                          ).length > 1 && (
                            <label className="list-group-item d-flex gap-2  scroll-sticky-0">
                              <input
                                className="form-check-input flex-shrink-0"
                                onChange={onDropdownAllItemChange}
                                checked={fractions.all.condition}
                                name={`${field}-items`}
                                type="checkbox"
                              />
                              <span>All ({fractions.all.string})</span>
                            </label>
                          )}
                          {relevant.length > 0 && (
                            <label className="list-group-item d-flex gap-2  scroll-sticky-0">
                              <input
                                onChange={(e) =>
                                  onDropdownAllSubsetChange(e, "relevantValues")
                                }
                                className="form-check-input flex-shrink-0"
                                checked={fractions.relevant.condition}
                                name={`${field}-items`}
                                type="checkbox"
                              />
                              <span>
                                Relevant ({fractions.relevant.string})
                              </span>
                            </label>
                          )}
                          {relevant.map((value) => (
                            <label
                              className="list-group-item d-flex gap-2 fs-small"
                              key={value}
                            >
                              <input
                                className="form-check-input flex-shrink-0"
                                onChange={onDropdownItemChange}
                                checked={items[value].checked}
                                name={`${field}-items`}
                                type="checkbox"
                                value={value}
                                key={value}
                              />
                              <span>{value}</span>
                            </label>
                          ))}
                          {irrelevant.length > 0 && (
                            <label className="list-group-item d-flex gap-2  scroll-sticky-0">
                              <input
                                onChange={(e) =>
                                  onDropdownAllSubsetChange(
                                    e,
                                    "irrelevantValues"
                                  )
                                }
                                className="form-check-input flex-shrink-0"
                                checked={fractions.irrelevant.condition}
                                name={`${field}-items`}
                                type="checkbox"
                              />
                              <span>
                                Irrelevant ({fractions.irrelevant.string})
                              </span>
                            </label>
                          )}
                          {irrelevant.map((value) => (
                            <label
                              className="list-group-item d-flex gap-2 fs-small opacity-50"
                              key={value}
                            >
                              <input
                                className="form-check-input flex-shrink-0"
                                onChange={onDropdownItemChange}
                                checked={items[value].checked}
                                name={`${field}-items`}
                                type="checkbox"
                                value={value}
                                key={value}
                              />
                              <span>{value}</span>
                            </label>
                          ))}
                          {lost.length > 0 && (
                            <label className="list-group-item d-flex gap-2  scroll-sticky-0">
                              <input
                                onChange={(e) =>
                                  onDropdownAllSubsetChange(e, "lostValues")
                                }
                                className="form-check-input flex-shrink-0"
                                checked={fractions.lost.condition}
                                name={`${field}-items`}
                                type="checkbox"
                              />
                              <span>Unavailable ({fractions.lost.string})</span>
                            </label>
                          )}
                          {lost.map((value) => (
                            <label
                              className="list-group-item d-flex gap-2 fs-small opacity-25"
                              key={value}
                            >
                              <input
                                className="form-check-input flex-shrink-0"
                                onChange={onDropdownItemChange}
                                checked={items[value].checked}
                                name={`${field}-items`}
                                type="checkbox"
                                value={value}
                                key={value}
                              />
                              <span>{value}</span>
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </Dropdown>
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

const ListGroupItem = memo(({ className = "", children, ...restOfProps }) => {
  return (
    <>
      <label className={`list-group-item d-flex gap-2 ${className}`.trimEnd()}>
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

const Dropdown = forwardRef(({ className = "", children, title }, ref) => {
  return (
    <>
      <div className="dropdown col">
        <button
          className={`btn btn-secondary bg-gradient dropdown-toggle w-100 shadow-sm ${className}`.trimEnd()}
          data-bs-auto-close="outside"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          type="button"
          ref={ref}
        >
          {title}
        </button>
        {children}
      </div>
    </>
  );
});

Dropdown.displayName = "Dropdown";

// const DropdownMenu = ({ className = "", ...restOfProps }) => {
//   return (
//     <>
//       <ul
//         className={`dropdown-menu ${className}`.trimEnd()}
//         {...restOfProps}
//       ></ul>
//     </>
//   );
// };

const DropdownSearch = memo((props) => {
  return (
    <>
      <form className="p-2 mb-2 bg-body-tertiary border-bottom">
        <input
          placeholder="Type to search..."
          className="form-control"
          autoComplete="false"
          type="search"
          {...props}
        />
      </form>
    </>
  );
});

DropdownSearch.displayName = "DropdownSearch";

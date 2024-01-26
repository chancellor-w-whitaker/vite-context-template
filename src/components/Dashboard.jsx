import { forwardRef, memo } from "react";

import { useConsumeAppContext } from "../hooks/useConsumeAppContext";
import { toTitleCase } from "../functions/toTitleCase";

export const Dashboard = () => {
  const context = useConsumeAppContext();

  const {
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

  return (
    <>
      <div className="d-flex flex-column gap-4">
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
          {Object.entries(dropdowns).map(
            ([field, { dataRelevance: fieldDataRelevance, search, items }]) => {
              const currentValues = dropdownValueLists[field]?.currentValues;

              const lostValues = dropdownValueLists[field]?.lostValues;

              return (
                <Dropdown
                  ref={(buttonNode) => storeDropdownById(field, buttonNode)}
                  className={`opacity-${fieldDataRelevance ? 100 : 25}`}
                  title={toTitleCase(field)}
                  key={field}
                >
                  <DropdownMenu
                    className="overflow-y-scroll shadow-sm pt-0"
                    style={{ maxHeight: 300 }}
                  >
                    {isDropdownWithIdOpen(field) && (
                      <>
                        <div className="list-item-sticky">
                          <DropdownSearch
                            onChange={onDropdownSearchChange}
                            name={`${field}-search`}
                            value={search}
                          ></DropdownSearch>
                        </div>
                        <ListGroup>
                          <ListGroupItem
                            checked={
                              !Object.values(items).some(
                                ({ checked }) => !checked
                              )
                            }
                            onChange={onDropdownAllItemChange}
                            name={`${field}-items`}
                            className="border-0"
                            type="checkbox"
                          >
                            All (
                            {`${
                              currentValues.relevantValues.length +
                              currentValues.irrelevantValues.length +
                              lostValues.length
                            }`}
                            )
                          </ListGroupItem>
                          {currentValues.relevantValues.map((value) => (
                            <ListGroupItem
                              className={`border-0 opacity-100`}
                              onChange={onDropdownItemChange}
                              checked={items[value].checked}
                              name={`${field}-items`}
                              type="checkbox"
                              value={value}
                              key={value}
                            >
                              {value}
                            </ListGroupItem>
                          ))}
                          {currentValues.irrelevantValues.map((value) => (
                            <ListGroupItem
                              className={`border-0 opacity-50`}
                              onChange={onDropdownItemChange}
                              checked={items[value].checked}
                              name={`${field}-items`}
                              type="checkbox"
                              value={value}
                              key={value}
                            >
                              {value}
                            </ListGroupItem>
                          ))}
                          {lostValues.map((value) => (
                            <ListGroupItem
                              className={`border-0 opacity-25`}
                              onChange={onDropdownItemChange}
                              checked={items[value].checked}
                              name={`${field}-items`}
                              type="checkbox"
                              value={value}
                              key={value}
                            >
                              {value}
                            </ListGroupItem>
                          ))}
                        </ListGroup>
                      </>
                    )}
                  </DropdownMenu>
                </Dropdown>
              );
            }
          )}
        </div>
        <div>
          {dataIsLoading || filteredRowsIsLoading
            ? "Loading..."
            : `${filteredRows.length.toLocaleString()} / ${rows.length.toLocaleString()} filtered rows`}
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

const DropdownMenu = ({ className = "", ...restOfProps }) => {
  return (
    <>
      <ul
        className={`dropdown-menu ${className}`.trimEnd()}
        {...restOfProps}
      ></ul>
    </>
  );
};

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

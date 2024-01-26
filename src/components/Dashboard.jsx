import { forwardRef } from "react";

import { useConsumeAppContext } from "../hooks/useConsumeAppContext";
import { toTitleCase } from "../functions/toTitleCase";

export const Dashboard = () => {
  const context = useConsumeAppContext();

  const {
    onDropdownAllItemChange,
    onDropdownSearchChange,
    isDropdownWithIdOpen,
    onDropdownItemChange,
    onSelectedDataChange,
    storeDropdownById,
    selectedData,
    dataOptions,
    dropdowns,
  } = context;

  console.log(context);

  return (
    <>
      <div className="d-flex flex-column gap-4">
        <ListGroup>
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
            ([field, { dataRelevance: fieldDataRelevance, search, items }]) => (
              <Dropdown
                ref={(buttonNode) => storeDropdownById(field, buttonNode)}
                className={`opacity-${fieldDataRelevance ? 100 : 50}`}
                title={toTitleCase(field)}
                key={field}
              >
                <DropdownMenu style={{ maxHeight: 300 }} className="pt-0">
                  {isDropdownWithIdOpen(field) && (
                    <>
                      <DropdownSearch
                        onChange={onDropdownSearchChange}
                        name={`${field}-search`}
                        value={search}
                      ></DropdownSearch>
                      <ListGroup>
                        <ListGroupItem
                          checked={
                            !Object.values(items).some(
                              ({ checked }) => !checked
                            )
                          }
                          onChange={onDropdownAllItemChange}
                          name={`${field}-items`}
                          type="checkbox"
                        >
                          All
                        </ListGroupItem>
                        {Object.entries(items).map(
                          ([
                            value,
                            { dataRelevance: valueDataRelevance, checked },
                          ]) => (
                            <ListGroupItem
                              className={`opacity-${
                                valueDataRelevance ? 100 : 50
                              }`}
                              onChange={onDropdownItemChange}
                              name={`${field}-items`}
                              checked={checked}
                              type="checkbox"
                              value={value}
                              key={value}
                            >
                              {value}
                            </ListGroupItem>
                          )
                        )}
                      </ListGroup>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>
            )
          )}
        </div>
      </div>
    </>
  );
};

const ListGroupItem = ({ className = "", children, ...restOfProps }) => {
  return (
    <>
      <label
        className={`list-group-item d-flex gap-2 border-0 ${className}`.trimEnd()}
      >
        <input className="form-check-input flex-shrink-0" {...restOfProps} />
        <span>{children}</span>
      </label>
    </>
  );
};

const ListGroup = ({ children }) => {
  return (
    <>
      <div className="list-group">{children}</div>
    </>
  );
};

const Dropdown = forwardRef(({ className = "", children, title }, ref) => {
  return (
    <>
      <div className="dropdown col">
        <button
          className={`btn btn-secondary dropdown-toggle w-100 shadow-sm ${className}`.trimEnd()}
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
        className={`dropdown-menu overflow-y-scroll shadow-sm ${className}`.trimEnd()}
        {...restOfProps}
      ></ul>
    </>
  );
};

const DropdownSearch = (props) => {
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
};

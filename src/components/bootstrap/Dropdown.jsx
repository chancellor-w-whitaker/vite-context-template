import { forwardRef, useRef, memo } from "react";

import { combineClassNames } from "../../functions/combineClassNames";
import { useDropdown } from "../../hooks/bootstrap/useDropdown";

const defaultOffset = [0, 2];

export const Dropdown = memo(
  ({
    content = (
      <>
        <li>
          <button className="dropdown-item" type="button">
            Action
          </button>
        </li>
        <li>
          <button className="dropdown-item" type="button">
            Another action
          </button>
        </li>
        <li>
          <button className="dropdown-item" type="button">
            Something else here
          </button>
        </li>
      </>
    ),
    boundary = "clippingParents",
    offset = defaultOffset,
    reference = "toggle",
    header = "Dropdown",
    display = "dynamic",
    popperConfig = null,
    autoClose = true,
    className = "",
    button = null,
    menu = null,
    ...rest
  }) => {
    const ref = useRef();

    const options = {
      popperConfig,
      reference,
      autoClose,
      boundary,
      display,
      offset,
    };

    const isOpen = useDropdown({ ref, ...options });

    return (
      <div {...rest} className={combineClassNames("dropdown", className)}>
        {button ? (
          button({ header, ref })
        ) : (
          <DropdownButton ref={ref}>{header}</DropdownButton>
        )}
        {menu ? (
          menu({ content, isOpen })
        ) : (
          <DropdownMenu>{isOpen && content}</DropdownMenu>
        )}
      </div>
    );
  }
);

export const DropdownButton = memo(
  forwardRef(
    (
      { variant = "secondary", type = "button", className = "", ...rest },
      ref
    ) => {
      return (
        <button
          {...rest}
          className={combineClassNames(
            `btn btn-${variant} dropdown-toggle`,
            className
          )}
          data-bs-toggle="dropdown"
          type={type}
          ref={ref}
        ></button>
      );
    }
  )
);

export const DropdownMenu = memo(({ className = "", ...rest }) => {
  return (
    <ul
      {...rest}
      className={combineClassNames("dropdown-menu", className)}
    ></ul>
  );
});

DropdownMenu.displayName = "DropdownMenu";

Dropdown.displayName = "Dropdown";

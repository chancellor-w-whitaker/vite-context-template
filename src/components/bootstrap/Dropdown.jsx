import { useRef, memo } from "react";

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
    variant = "secondary",
    reference = "toggle",
    header = "Dropdown",
    display = "dynamic",
    popperConfig = null,
    autoClose = true,
  }) => {
    const triggerRef = useRef();

    const options = {
      popperConfig,
      reference,
      autoClose,
      boundary,
      display,
      offset,
    };

    const showContent = useDropdown({ ref: triggerRef, ...options });

    return (
      <div className="dropdown">
        <button
          className={`btn btn-${variant} dropdown-toggle`}
          data-bs-toggle="dropdown"
          ref={triggerRef}
          type="button"
        >
          {header}
        </button>
        <ul className="dropdown-menu">{showContent && content}</ul>
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

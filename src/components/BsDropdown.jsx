import { Dropdown } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useEffect, useRef } from "react";

import { useBsEvents } from "../hooks/useBsEvents";

const defaultOffset = [0, 2];

export const BsDropdown = ({
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
  boundary = `clippingParents`,
  offset = defaultOffset,
  reference = `toggle`,
  header = `Dropdown`,
  display = `dynamic`,
  popperConfig = null,
  autoClose = true,
}) => {
  const ref = useRef();

  useEffect(() => {
    const dropdown = new Dropdown(ref.current, {
      popperConfig,
      autoClose,
      reference,
      boundary,
      display,
      offset,
    });

    return () => {
      dropdown.dispose();
    };
  }, [popperConfig, autoClose, reference, boundary, display, offset]);

  const state = useBsEvents({ bsComponent: `dropdown`, ref });

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        data-bs-toggle="dropdown"
        type="button"
        ref={ref}
      >
        {header}
      </button>
      <ul className="dropdown-menu">
        {["shown", "show", "hide"].includes(state) && content}
      </ul>
    </div>
  );
};

import { Dropdown as BsDropdown } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useEffect } from "react";

import { useEvents } from "../../hooks/bootstrap/useEvents";

export const useDropdown = ({
  popperConfig,
  autoClose,
  reference,
  boundary,
  display,
  offset,
  ref,
}) => {
  useEffect(() => {
    const options = {
      popperConfig,
      autoClose,
      reference,
      boundary,
      display,
      offset,
    };

    const dropdown = new BsDropdown(ref.current, options);

    return () => {
      dropdown.dispose();
    };
  }, [popperConfig, autoClose, reference, boundary, display, offset, ref]);

  const state = useEvents({ component: "dropdown", ref });

  const showContent = ["shown", "show", "hide"].includes(state);

  return showContent;
};

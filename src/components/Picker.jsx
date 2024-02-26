import { useCallback, useState, useRef } from "react";

import useClickOutside from "../hooks/useClickOutside";

export const Picker = ({ children }) => {
  const popover = useRef();

  const [isOpen, toggle] = useState(false);

  const open = useCallback(() => toggle(true), []);

  const close = useCallback(() => toggle(false), []);

  useClickOutside(popover, close);

  return (
    <div className="picker">
      <div className="swatch" onClick={open} />
      {isOpen && (
        <div className="popover" ref={popover}>
          {children}
        </div>
      )}
    </div>
  );
};

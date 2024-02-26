import { useCallback, useState, useRef } from "react";

import useClickOutside from "../hooks/useClickOutside";

export const Picker = ({ popoverContent, renderSwatch }) => {
  const popover = useRef();

  const [isOpen, toggle] = useState(false);

  const open = useCallback(() => toggle(true), []);

  const close = useCallback(() => toggle(false), []);

  useClickOutside(popover, close);

  return (
    <div className="picker">
      {renderSwatch({ isOpen, open })}
      {isOpen && (
        <div className="popover" ref={popover}>
          {popoverContent}
        </div>
      )}
    </div>
  );
};

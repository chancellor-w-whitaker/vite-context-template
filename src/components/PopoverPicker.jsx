import { useCallback, useState, useRef } from "react";
import { HexColorPicker } from "react-colorful";

import useClickOutside from "../hooks/useClickOutside";

export const PopoverPicker = ({ onChange, color }) => {
  const popover = useRef();
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div className="picker">
      <div
        style={{ backgroundColor: color }}
        onClick={() => toggle(true)}
        className="swatch"
      />

      {isOpen && (
        <div className="popover" ref={popover}>
          <HexColorPicker onChange={onChange} color={color} />
        </div>
      )}
    </div>
  );
};

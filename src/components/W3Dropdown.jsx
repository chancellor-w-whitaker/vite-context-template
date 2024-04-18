import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

const Checkbox = ({ checked }) => {
  return (
    <div className="icon-link">
      {checked ? (
        <svg
          className="bi bi-check-square-fill text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          height={16}
          width={16}
        >
          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="bi bi-square"
          fill="currentColor"
          viewBox="0 0 16 16"
          height={16}
          width={16}
        >
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
        </svg>
      )}
      Link 1
    </div>
  );
};

export const W3Dropdown = ({ title = "Click Me" }) => {
  const popover = useRef();

  const [isOpen, toggle] = useState(false);

  const open = useCallback(() => toggle(true), []);

  const close = useCallback(() => toggle(false), []);

  useClickOutside(popover, close);

  return (
    <div className="w3-dropdown">
      <button
        className={`shadow-sm bg-gradient btn btn-secondary${
          isOpen ? " active" : ""
        }`}
        onClick={open}
        type="button"
      >
        <div className="icon-link">
          {title}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="bi bi-caret-down-fill"
            fill="currentColor"
            viewBox="0 0 16 16"
            height={16}
            width={16}
          >
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div
          className="w3-dropdown-content overflow-y-scroll"
          style={{ maxHeight: 200 }}
          ref={popover}
        >
          <div className="w3-dropdown-item">
            <Checkbox></Checkbox>
          </div>
          <div className="w3-dropdown-item">
            <Checkbox></Checkbox>
          </div>
          <div className="w3-dropdown-item">
            <Checkbox></Checkbox>
          </div>
          <div className="w3-dropdown-item">
            <Checkbox></Checkbox>
          </div>
          <div className="w3-dropdown-item">
            <Checkbox></Checkbox>
          </div>
          <div className="w3-dropdown-item">
            <Checkbox></Checkbox>
          </div>
        </div>
      )}
    </div>
  );
};

// Improved version of https://usehooks.com/useOnClickOutside/
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) return;

      handler(event);
    };

    const validateEventStart = (event) => {
      startedWhenMounted = ref.current;
      startedInside = ref.current && ref.current.contains(event.target);
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};

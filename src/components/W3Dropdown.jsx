import { usePopover } from "../hooks/usePopover";

const Checkbox = ({ children, checked }) => {
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
      {children}
    </div>
  );
};

export const W3DropdownItem = ({ children, checked, ...rest }) => {
  return (
    <div {...rest} className="w3-dropdown-item">
      <Checkbox checked={checked}>{children}</Checkbox>
    </div>
  );
};

export const W3Dropdown = ({ title = "Click Me", children }) => {
  const { popover, isOpen, open } = usePopover();

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
          {children}
        </div>
      )}
    </div>
  );
};

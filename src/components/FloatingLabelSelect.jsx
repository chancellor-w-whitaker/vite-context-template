import { useId } from "react";

export const FloatingLabelSelect = ({
  className = "",
  onChange,
  children,
  label,
  value,
}) => {
  const id = useId();

  return (
    <div className={`form-floating ${className}`.trimEnd()}>
      <select
        className="form-select shadow-sm"
        id={`${id}-floatingSelect`}
        onChange={onChange}
        value={value}
      >
        {children}
      </select>
      <label htmlFor={`${id}-floatingSelect`}>{label}</label>
    </div>
  );
};

export const SelectOption = ({ children, value }) => {
  return <option value={value}>{children}</option>;
};

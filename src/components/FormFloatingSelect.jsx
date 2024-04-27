import { useId } from "react";

export const FormFloatingSelect = ({
  selectClassName = "",
  className = "",
  onChange,
  children,
  label,
  value,
  more,
}) => {
  const id = useId();

  return (
    <div className={`form-floating ${className}`.trimEnd()}>
      <FormSelect
        className={`shadow-sm ${selectClassName}`.trimEnd()}
        id={`${id}-floatingSelect`}
        onChange={onChange}
        value={value}
      >
        {children}
      </FormSelect>
      <label htmlFor={`${id}-floatingSelect`}>{label}</label>
      {more}
    </div>
  );
};

export const FormSelect = ({ className = "", ...rest }) => {
  return <select className={`form-select ${className}`.trim()} {...rest} />;
};

export const SelectOption = (props) => {
  return <option {...props} />;
};

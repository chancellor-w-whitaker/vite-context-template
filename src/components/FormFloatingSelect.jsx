import { useId } from "react";

export const FormFloatingSelect = ({
  className = "",
  onChange,
  children,
  label,
  value,
}) => {
  const id = useId();

  return (
    <div className={`form-floating ${className}`.trimEnd()}>
      <FormSelect
        id={`${id}-floatingSelect`}
        className="shadow-sm"
        onChange={onChange}
        value={value}
      >
        {children}
      </FormSelect>
      <label htmlFor={`${id}-floatingSelect`}>{label}</label>
    </div>
  );
};

export const FormSelect = ({ className = "", ...rest }) => {
  return <select className={`form-select ${className}`.trim()} {...rest} />;
};

export const SelectOption = (props) => {
  return <option {...props} />;
};

import { memo } from "react";

import { combineClassNames } from "../functions/combineClassNames";

export const MyDropdownItem = memo(
  ({
    relevance = "relevant",
    singleItem = false,
    type = "checkbox",
    fraction = false,
    value = "value",
    checked = true,
    name = "name",
    hideInput,
    onChange,
    children,
  }) => {
    const labelClassList = [];

    const inputClassList = [];

    let opacity = 100;

    const readOnly =
      singleItem && ["unavailable", "irrelevant"].includes(relevance);

    if (singleItem) {
      inputClassList.push("ms-4");

      labelClassList.push(...["border-0", "small"]);

      if (readOnly) {
        labelClassList.push("pe-none");
      }

      if (relevance === "irrelevant") {
        opacity = 50;
      }

      if (relevance === "unavailable") {
        opacity = 25;
      }
    } else {
      labelClassList.push("scroll-sticky-0");
    }

    inputClassList.push(`opacity-${opacity}`);

    return (
      <MyDropdownLabel className={labelClassList.join(" ")}>
        {!hideInput && (
          <MyDropdownInput
            className={inputClassList.join(" ")}
            onChange={onChange}
            readOnly={readOnly}
            checked={checked}
            value={value}
            name={name}
            type={type}
          ></MyDropdownInput>
        )}
        <span className={`opacity-${opacity}`}>{children}</span>
        {fraction && (
          <MyDropdownBadge checked={checked}>{fraction}</MyDropdownBadge>
        )}
      </MyDropdownLabel>
    );
  }
);

MyDropdownItem.displayName = "MyDropdownItem";

export const MyDropdownLabel = ({ className = "", children }) => {
  return (
    <label
      className={combineClassNames("list-group-item d-flex gap-2", className)}
    >
      {children}
    </label>
  );
};

export const MyDropdownInput = ({
  type = "checkbox",
  className = "",
  ...rest
}) => {
  return (
    <input
      {...rest}
      className={combineClassNames("form-check-input flex-shrink-0", className)}
      type={type}
    />
  );
};

const MyDropdownBadge = ({
  checkedVariant = "primary",
  uncheckedVariant = "light",
  className = "",
  children,
  checked,
}) => {
  const origClassName = `ms-auto badge transition-all shadow-sm text-bg-${
    checked ? checkedVariant : uncheckedVariant
  } rounded-pill d-flex align-items-center`;

  return (
    <span className={combineClassNames(origClassName, className)}>
      {children}
    </span>
  );
};

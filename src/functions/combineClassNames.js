export const combineClassNames = (defaultClassName, classNameProp) => {
  return classNameProp.length > 0
    ? [defaultClassName, classNameProp].join(" ")
    : defaultClassName;
};

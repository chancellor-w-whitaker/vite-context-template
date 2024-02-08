export const handleDropdownSubListChange = ({
  dropdownItems,
  setState,
  subset,
  name,
}) =>
  setState((previousDropdowns) => {
    // ! name is `${field}-items`
    const field = name.split("-")[0];

    const nextDropdowns = { ...previousDropdowns };

    nextDropdowns[field] = { ...nextDropdowns[field] };

    const setOfSubsetValues = new Set(dropdownItems[field][subset]);

    const noneUnchecked = !Object.entries(nextDropdowns[field].items).some(
      ([value, { checked }]) => !checked && setOfSubsetValues.has(value)
    );

    if (noneUnchecked) {
      nextDropdowns[field].items = Object.fromEntries(
        Object.entries(nextDropdowns[field].items).map(([value, object]) =>
          setOfSubsetValues.has(value)
            ? [value, { ...object, checked: false }]
            : [value, object]
        )
      );
    } else {
      nextDropdowns[field].items = Object.fromEntries(
        Object.entries(nextDropdowns[field].items).map(([value, object]) =>
          !object.checked && setOfSubsetValues.has(value)
            ? [value, { ...object, checked: true }]
            : [value, object]
        )
      );
    }

    return nextDropdowns;
  });

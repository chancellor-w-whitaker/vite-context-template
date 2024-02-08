export const handleAllDropdownItemsChange = ({ setState, name }) =>
  setState((previousDropdowns) => {
    // ! name is `${field}-items`
    const field = name.split("-")[0];

    const nextDropdowns = { ...previousDropdowns };

    nextDropdowns[field] = { ...nextDropdowns[field] };

    const noneUnchecked = !Object.values(nextDropdowns[field].items).some(
      ({ checked }) => !checked
    );

    if (noneUnchecked) {
      nextDropdowns[field].items = Object.fromEntries(
        Object.entries(nextDropdowns[field].items).map(([value, object]) => [
          value,
          { ...object, checked: false },
        ])
      );
    } else {
      nextDropdowns[field].items = Object.fromEntries(
        Object.entries(nextDropdowns[field].items).map(([value, object]) =>
          !object.checked
            ? [value, { ...object, checked: true }]
            : [value, object]
        )
      );
    }

    return nextDropdowns;
  });

export const handleDropdownItemChange = ({ setState, value, name }) =>
  setState((previousDropdowns) => {
    // ! name is `${field}-items`
    const field = name.split("-")[0];

    const nextDropdowns = { ...previousDropdowns };

    nextDropdowns[field] = { ...nextDropdowns[field] };

    nextDropdowns[field].items = { ...nextDropdowns[field].items };

    nextDropdowns[field].items[value] = {
      ...nextDropdowns[field].items[value],
    };

    nextDropdowns[field].items[value].checked =
      !nextDropdowns[field].items[value].checked;

    return nextDropdowns;
  });

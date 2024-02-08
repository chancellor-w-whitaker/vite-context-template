export const handleDropdownSearchChange = ({ setState, value, name }) =>
  setState((previousDropdowns) => {
    // ! name is `${field}-search`
    const field = name.split("-")[0];

    const nextDropdowns = { ...previousDropdowns };

    nextDropdowns[field] = { ...nextDropdowns[field] };

    nextDropdowns[field].search = value;

    return nextDropdowns;
  });

export const updateDropdownSelections = (field, value) => (prevState) => {
  // ! new state reference
  const nextState = { ...prevState };

  // ! new dropdown reference
  nextState[field] = { ...nextState[field] };

  // ! clicked "All" button
  // ! if value prop is undefined or "" (undefined prop arrives as empty string--means can't have specifically have a "" in list)
  if (value === "") {
    // ! if not some item unchecked
    const allChecked = !Object.values(nextState[field]).some(
      (condition) => !condition
    );

    // ! only when all are checked should you set all false--otherwise, set all true
    if (allChecked) {
      Object.keys(nextState[field]).forEach(
        (v) => (nextState[field][v] = false)
      );
    } else {
      Object.keys(nextState[field]).forEach(
        (v) => (nextState[field][v] = true)
      );
    }

    // ! if clicked all, return next state early so rest of code doesn't run
    return nextState;
  }

  // ! didn't click "All" button (clicked any item)
  // ! flip condition (checked)
  nextState[field][value] = !nextState[field][value];

  return nextState;
};

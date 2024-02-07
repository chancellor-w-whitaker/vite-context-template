import { getFractionData } from "./getFractionData";

export const getDropdownData = ({ valueData, items }) => {
  const { unavailable = [], irrelevant = [], relevant = [] } = valueData ?? {};

  const checked = Object.entries(items)
    .filter((entry) => entry[1].checked)
    .map(([value]) => value);

  const checkedSet = new Set(checked);

  const irrelevantChecked = irrelevant.filter((value) => checkedSet.has(value));

  const relevantChecked = relevant.filter((value) => checkedSet.has(value));

  const unavailableChecked = unavailable.filter((value) =>
    checkedSet.has(value)
  );

  const fractions = {
    unavailable: getFractionData(unavailableChecked.length, unavailable.length),
    irrelevant: getFractionData(irrelevantChecked.length, irrelevant.length),
    relevant: getFractionData(relevantChecked.length, relevant.length),
    all: getFractionData(checked.length, Object.keys(items).length),
  };

  return { values: { unavailable, irrelevant, relevant }, fractions };
};

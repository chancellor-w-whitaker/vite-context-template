export const toWholeNumber = (value) =>
  (Math.abs(value) < 10 ? Number(value) : Math.round(value)).toLocaleString();

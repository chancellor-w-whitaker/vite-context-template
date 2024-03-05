export const toWholeNumber = (value) =>
  (value > 10 ? Math.round(value) : Number(value)).toLocaleString();

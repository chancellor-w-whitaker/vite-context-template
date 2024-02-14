export const toPercentage = (value) =>
  value.toLocaleString("en", {
    minimumFractionDigits: 1,
    style: "percent",
  });

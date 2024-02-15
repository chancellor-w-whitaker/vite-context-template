export const toPercentage = (value) =>
  value.toLocaleString("en", {
    minimumFractionDigits: 2,
    style: "percent",
  });

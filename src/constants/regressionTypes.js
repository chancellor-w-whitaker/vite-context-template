export const regressionTypes = [
  "linear",
  "exponential",
  "logarithmic",
  "power",
  "polynomial",
];

const defaultSettings = {
  precision: 10,
  order: 2,
};

export const regTypes = [
  { settings: defaultSettings, type: "linear", name: "linear" },
  { settings: defaultSettings, type: "exponential", name: "exponential" },
  { settings: defaultSettings, type: "logarithmic", name: "logarithmic" },
  { settings: defaultSettings, type: "power", name: "power" },
  { settings: defaultSettings, type: "polynomial", name: "polynomial" },
  {
    settings: { precision: 10, order: 3 },
    name: "polynomial (order of 3)",
    type: "polynomial",
  },
];

export const regNames = regTypes.map(({ name }) => name);

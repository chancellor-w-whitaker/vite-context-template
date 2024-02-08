export const findRelevantMeasures = ({ measuresToOmit, columns }) =>
  Object.entries(columns)
    .filter(
      ([field, { type }]) =>
        type === "number" && !measuresToOmit.includes(field)
    )
    .map(([field]) => field);

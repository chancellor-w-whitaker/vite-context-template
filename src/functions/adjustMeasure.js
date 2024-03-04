import { findRelevantMeasures } from "./findRelevantMeasures";

export const adjustMeasure = ({
  measuresToOmit,
  defaultMeasure,
  setState,
  columns,
}) =>
  setState((previousMeasure) => {
    const nextRelevantOptions = findRelevantMeasures({
      measuresToOmit,
      columns,
    });

    return nextRelevantOptions.includes(defaultMeasure)
      ? defaultMeasure
      : !nextRelevantOptions.includes(previousMeasure)
      ? nextRelevantOptions[0]
      : previousMeasure;
  });

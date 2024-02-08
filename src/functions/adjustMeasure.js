import { findRelevantMeasures } from "./findRelevantMeasures";

export const adjustMeasure = ({ measuresToOmit, setState, columns }) =>
  setState((previousMeasure) => {
    const nextRelevantOptions = findRelevantMeasures({
      measuresToOmit,
      columns,
    });

    return !nextRelevantOptions.includes(previousMeasure)
      ? nextRelevantOptions[0]
      : previousMeasure;
  });

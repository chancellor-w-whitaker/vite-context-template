import { toFraction } from "./formatters/toFraction";

export const getMeasureFraction = (
  measures,
  numeratorMeasure,
  denominatorMeasure = "total"
) => toFraction(measures[numeratorMeasure], measures[denominatorMeasure]);

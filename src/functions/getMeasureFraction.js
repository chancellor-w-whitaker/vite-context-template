import { totalField } from "../constants/totalField";
import { toFraction } from "./formatters/toFraction";

export const getMeasureFraction = (
  measures,
  numeratorMeasure,
  denominatorMeasure = totalField
) => toFraction(measures[numeratorMeasure], measures[denominatorMeasure]);

import { totalField } from "../constants/totalField";

export const getMeasureRate = (
  measures,
  numeratorMeasure,
  denominatorMeasure = totalField
) => measures[numeratorMeasure] / measures[denominatorMeasure];

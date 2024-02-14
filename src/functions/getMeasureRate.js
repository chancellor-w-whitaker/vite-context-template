export const getMeasureRate = (
  measures,
  numeratorMeasure,
  denominatorMeasure = "total"
) => measures[numeratorMeasure] / measures[denominatorMeasure];

import { toWholeNumber } from "./toWholeNumber";

export const toFraction = (numeratorValue, denominatorValue) =>
  `(${toWholeNumber(numeratorValue)}/${toWholeNumber(denominatorValue)})`;

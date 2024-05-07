import { toTitleCase } from "./toTitleCase";

export const formatGradRateXValue = (measure, value) => {
  const termYear = toTitleCase(value).split(" ")[1];

  const elapsedYears = toTitleCase(measure).split(" ")[0];

  return `${value} to Summer ${Number(termYear) + Number(elapsedYears)}`;
};

import { RateCellRenderer } from "../components/RateCellRenderer";
import { rowIdColumnDef } from "../constants/rowIdColumnDef";
import { formatMeasureValue } from "./formatMeasureValue";
import { getMeasureFraction } from "./getMeasureFraction";
import { formatMeasureRate } from "./formatMeasureRate";
import { getMeasureValue } from "./getMeasureValue";
import { isLengthyArray } from "./isLengthyArray";
import { getMeasureRate } from "./getMeasureRate";
import { isNumber } from "./isNumber";

const getStandardValueGetter =
  (measure) =>
  ({ colDef: { field }, data }) => {
    if (field in data) {
      return getMeasureValue(data[field], measure);
    }
  };

const standardValueFormatter = ({ value }) => {
  if (isNumber(value)) {
    return formatMeasureValue(value);
  }
};

const validateFraction = ({ denominator = "total", numerator, field, data }) =>
  field in data && numerator in data[field] && denominator in data[field];

const getRateValueGetter =
  (numerator, denominator = "total") =>
  ({ colDef: { field }, data }) => {
    if (validateFraction({ denominator, numerator, field, data })) {
      const quotient = getMeasureRate(data[field], numerator);

      return quotient;
    }
  };

const getRateValueFormatter =
  (numerator, denominator = "total") =>
  ({ colDef: { field }, value, data }) => {
    if (isNumber(value)) {
      const percentage = formatMeasureRate(value);

      if (validateFraction({ denominator, numerator, field, data })) {
        const fraction = getMeasureFraction(data[field], numerator);

        return [percentage, fraction];
      }

      return [percentage];
    }
  };

export const getColumnDefs = ({ shouldFindRates, measure, data }) => {
  if (!isLengthyArray(data)) return [];

  const defs = Object.entries(data[0]).map(([field, stringOrObject]) => {
    if (typeof stringOrObject === "string") {
      return { field };
    } else {
      const [type, valueGetter, valueFormatter] = [
        "numericColumn",
        !shouldFindRates
          ? getStandardValueGetter(measure)
          : getRateValueGetter(measure),
        !shouldFindRates
          ? standardValueFormatter
          : getRateValueFormatter(measure),
      ];

      const def = { valueFormatter, valueGetter, field, type };

      if (shouldFindRates) def.cellRenderer = RateCellRenderer;

      return def;
    }
  });

  return [{ ...rowIdColumnDef }, ...defs];
};

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

export const standardValueFormatter = ({ value }) => {
  if (isNumber(value)) {
    return value < 5 ? "<5" : formatMeasureValue(value);
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

export const getColumnDefs = ({
  headerValueGetter,
  shouldFindRates,
  fieldDefs,
  totalRow,
  measure,
  data,
}) => {
  if (!isLengthyArray(data)) return [];

  const getFieldProps = (field) => (field in fieldDefs ? fieldDefs[field] : {});

  const stringDefs = Object.entries(data[0])
    .filter(([field, value]) => typeof value === "string")
    .map(([field]) => ({ field, ...getFieldProps(field) }));

  const numberDefs = Object.entries(totalRow[0]).map(([field]) => {
    const [type, valueGetter, valueFormatter] = [
      "numericColumn",
      !shouldFindRates
        ? getStandardValueGetter(measure)
        : getRateValueGetter(measure),
      !shouldFindRates
        ? standardValueFormatter
        : getRateValueFormatter(measure),
    ];

    const def = {
      headerValueGetter,
      valueFormatter,
      valueGetter,
      field,
      type,
    };

    if (shouldFindRates) def.cellRenderer = RateCellRenderer;

    return { ...def, ...getFieldProps(field) };
  });

  const defs = [...stringDefs, ...numberDefs];

  return [{ ...rowIdColumnDef }, ...defs];
};

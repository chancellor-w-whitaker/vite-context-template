export const getFractionData = (numerator, denominator) => ({
  string: `${numerator} / ${denominator}`,
  condition: numerator === denominator,
});

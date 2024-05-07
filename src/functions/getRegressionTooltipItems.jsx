import { brandColors } from "../constants/brandColors";

export const getRegressionTooltipItems = (string, r2) => {
  const splitOnExponent = string.split("^");

  if (splitOnExponent.length > 1) {
    splitOnExponent.push(splitOnExponent[1].split(" "));

    splitOnExponent[1] = splitOnExponent[2].shift();
  } else {
    splitOnExponent[1] = "";

    splitOnExponent[2] = [];
  }

  const [firstPart, exponent, theRest] = splitOnExponent;

  return [
    {
      value: (
        <>
          {firstPart}
          <sup>{exponent}</sup> {theRest.join(" ")}
        </>
      ),
      color: brandColors.kentuckyBluegrass,
      className: "fst-italic",
    },
    {
      value: (
        <>
          R<sup>2</sup> = {r2.toLocaleString()}
        </>
      ),
      color: brandColors.kentuckyBluegrass,
      className: "fst-italic",
    },
  ];
};

import { Fragment } from "react";

import { brandColors } from "../constants/brandColors";

export const getRegressionTooltipItems = (string, r2) => {
  const stuff = string
    .split(" ")
    .map((element) =>
      element.includes("^")
        ? element
            .split("^")
            .map((subElement, index) =>
              index === 0
                ? { content: subElement, exponent: false }
                : { content: subElement, exponent: true }
            )
        : [{ content: element, exponent: false }]
    );

  return [
    {
      value: (
        <div className="d-flex gap-1">
          {stuff.map((array, indexA) => (
            <div key={indexA}>
              {array.map(({ exponent, content }, indexB) => (
                <Fragment key={indexB}>
                  {!exponent ? <span>{content}</span> : <sup>{content}</sup>}
                </Fragment>
              ))}
            </div>
          ))}
        </div>
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

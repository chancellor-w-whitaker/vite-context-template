import { Fragment } from "react";

import {
  confidentialityString,
  isConfidential,
} from "../constants/confidentialityNumber";
import { colors } from "../constants/colors";

export const CustomTooltip = (props) => {
  const {
    shouldFindRates,
    moreItems = [],
    labelFormatter,
    separator,
    formatter,
    payload,
    active,
    label,
  } = props;

  if (active && payload && payload.length) {
    return (
      <div
        style={{
          border: "1px solid rgb(204, 204, 204)",
          backgroundColor: "rgb(255, 255, 255)",
          whiteSpace: "nowrap",
          padding: 10,
          margin: 0,
        }}
        className="recharts-default-tooltip"
      >
        <p
          className="recharts-tooltip-label text-center pb-1"
          style={{ margin: 0 }}
        >
          <span className="fw-bold">{labelFormatter(label)}</span>
        </p>
        <hr className="my-1"></hr>
        <ul
          className="recharts-tooltip-item-list"
          style={{ padding: 0, margin: 0 }}
        >
          {payload
            .filter(
              ({ dataKey, stroke }) =>
                !(stroke === colors.lineBorder && dataKey === "prediction")
            )
            .map(({ payload, value, color, name, unit }) => {
              const [formattedValue, formattedName] = formatter(value, name);

              const { inFuture = false } = payload;

              // const shouldHide = "hide" in payload && payload.hide === name;

              return (
                inFuture !== name && (
                  <Fragment key={name}>
                    <TooltipItem
                      value={
                        isConfidential({
                          isRate: shouldFindRates,
                          inFuture,
                          value,
                        }) && name !== "prediction"
                          ? confidentialityString
                          : formattedValue
                      }
                      separator={separator}
                      name={formattedName}
                      className="fw-bold"
                      color={color}
                      unit={unit}
                    ></TooltipItem>
                    {"fraction" in payload && payload.fraction.key === name && (
                      <TooltipItem
                        value={payload.fraction.value}
                        color={color}
                      ></TooltipItem>
                    )}
                  </Fragment>
                )
              );
            })}
          {moreItems.map(
            (
              { className = "", separator, value, color, name, unit },
              index
            ) => {
              return (
                <Fragment key={index}>
                  <TooltipItem
                    separator={separator}
                    className={className}
                    value={value}
                    color={color}
                    name={name}
                    unit={unit}
                  ></TooltipItem>
                </Fragment>
              );
            }
          )}
        </ul>
      </div>

      // <div className="custom-tooltip">
      //   <p className="label">{`${label} : ${payload[0].value}`}</p>
      //   <p className="intro">{label}</p>
      //   <p className="desc">Anything you want can be displayed here.</p>
      // </div>
    );
  }

  return null;
};

const TooltipItem = ({
  className = "",
  separator,
  color,
  value,
  name,
  unit,
}) => {
  return (
    <li
      style={{
        display: "block",
        paddingBottom: 4,
        paddingTop: 4,
        color: color,
      }}
      className={`recharts-tooltip-item ${className}`.trimEnd()}
    >
      <span className="recharts-tooltip-item-name">{name}</span>
      <span className="recharts-tooltip-item-separator">{separator}</span>
      <span className="recharts-tooltip-item-value">{value}</span>
      <span className="recharts-tooltip-item-unit">{unit}</span>
    </li>
  );
};

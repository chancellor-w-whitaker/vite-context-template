import {
  ResponsiveContainer,
  CartesianGrid,
  ComposedChart,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  Line,
  Cell,
  Bar,
} from "recharts";
import { Fragment, useState, memo } from "react";

import { toTitleCase } from "../functions/formatters/toTitleCase";
import { brandColors } from "../constants/brandColors";

// ! pattern for mapping over data for more flexibility in chart data structure
// https://recharts.org/en-US/examples/CustomShapeBarChart

// ! default measures in settings
// ? 6 yr graduate for graduation rates

// ! shouldn't show rates if x yr metric if doesn't make sense logistically
// ! how is this currently defined in the data?

// ? remove rows logic
// ! (someField: value1 or value2)
// ! if someField is value1, keep row
// ! if someField is value2, remove row

// ? suggestion to make remove rows logic dynamic in settings
// * settings: { file1: { ..., rowFilterLogic: { field: someField, keepValue: value1, removeValue: value2 } } }

// ? learn github as a team and practice collaborative functionality

// ! finish this project
// ! fine-tune to be a dynamic system for all data
// ! figure out simplest frontend & backend solution for our projects (python, node, etc.)
// ! test out python api w react front end

export const Chart = memo(
  ({
    valueFormatter,
    tooltipItems,
    xAxisDataKey,
    barDataKey,
    domain,
    data,
  }) => {
    const [returnedWidth, setReturnedWidth] = useState(0);

    const [zoomed, setZoomed] = useState(true);

    const smallBreakpoint = 576;

    const {
      responsiveContainer,
      composedChart,
      cartesianGrid,
      tooltip,
      legend,
      xAxis,
      yAxis,
      line,
      bar,
    } = {
      bar: {
        label: {
          fillOpacity: returnedWidth > smallBreakpoint ? "100%" : "0%",
          fill: brandColors.goldenrodYellow,
          formatter: valueFormatter,
          fontSize: 20,
        },
        // activeBar: <Rectangle fill="#AF2955" />,
        fill: brandColors.ekuMaroon,
        dataKey: barDataKey,
      },
      line: {
        stroke: brandColors.kentuckyBluegrass,
        strokeLinecap: "round",
        dataKey: "predicted",
        type: "monotone",
        strokeWidth: 3,
        dot: false,
      },
      tooltip: {
        formatter: (value, name) => [valueFormatter(value), toTitleCase(name)],
        content: <CustomTooltip moreItems={tooltipItems}></CustomTooltip>,
      },
      responsiveContainer: {
        onResize: (width) => setReturnedWidth(width),
        width: "100%",
        height: 500,
      },
      yAxis: {
        domain: zoomed ? domain : null,
        tickFormatter: valueFormatter,
        type: "number",
      },
      composedChart: {
        margin: { bottom: 0, right: 0, left: 0, top: 0 },
        data: [...data],
      },
      xAxis: { dataKey: xAxisDataKey, type: "category" },
      cartesianGrid: { strokeDasharray: "3 3" },
      legend: { formatter: toTitleCase },
    };

    return (
      <>
        <label className="d-flex gap-2">
          <input
            onChange={(e) => setZoomed(e.target.checked)}
            className="form-check-input flex-shrink-0"
            checked={zoomed}
            type="checkbox"
          />
          <span>Zoomed</span>
        </label>
        <ResponsiveContainer {...responsiveContainer}>
          <ComposedChart {...composedChart}>
            <CartesianGrid {...cartesianGrid} />
            <XAxis {...xAxis} />
            <YAxis {...yAxis} />
            <Tooltip {...tooltip} />
            <Legend {...legend} />
            <Bar {...bar}>
              {data.map((entry, index) => (
                <Cell
                  fill={
                    "makeDim" in entry
                      ? brandColors.kentuckyBluegrass
                      : brandColors.ekuMaroon
                  }
                  fillOpacity={"makeDim" in entry ? "75%" : "100%"}
                  key={`cell-${index}`}
                />
              ))}
            </Bar>
            <Line {...line} />
          </ComposedChart>
        </ResponsiveContainer>
      </>
    );
  }
);

Chart.displayName = "Chart";

const CustomTooltip = (props) => {
  const {
    moreItems = [],
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
          <span className="fw-bold">{label}</span>
        </p>
        <hr className="my-1"></hr>
        <ul
          className="recharts-tooltip-item-list"
          style={{ padding: 0, margin: 0 }}
        >
          {payload.map(({ payload, value, color, name, unit }) => {
            const [formattedValue, formattedName] = formatter(value, name);

            return (
              <Fragment key={name}>
                <TooltipItem
                  value={formattedValue}
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
            );
          })}
          {moreItems.map(({ separator, value, color, name, unit }, index) => {
            return (
              <Fragment key={index}>
                <TooltipItem
                  separator={separator}
                  value={value}
                  color={color}
                  name={name}
                  unit={unit}
                ></TooltipItem>
              </Fragment>
            );
          })}
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

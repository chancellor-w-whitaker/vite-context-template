import {
  ResponsiveContainer,
  CartesianGrid,
  ComposedChart,
  Rectangle,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  Line,
  Bar,
} from "recharts";
import { Fragment, useState } from "react";

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

export const Chart = ({
  valueFormatter,
  tooltipItems,
  xAxisDataKey,
  barDataKey,
  data,
}) => {
  const [returnedWidth, setReturnedWidth] = useState(0);

  const layout = returnedWidth > 576 ? "horizontal" : "vertical";

  const [xAxis, yAxis] = [
    {
      tickFormatter: layout === "vertical" ? valueFormatter : null,
      dataKey: layout === "horizontal" ? xAxisDataKey : null,
      type: layout === "horizontal" ? "category" : "number",
    },
    {
      tickFormatter: layout === "horizontal" ? valueFormatter : null,
      type: layout === "horizontal" ? "number" : "category",
      dataKey: layout === "vertical" ? xAxisDataKey : null,
    },
  ];

  return (
    <ResponsiveContainer
      onResize={(width) => setReturnedWidth(width)}
      height={500}
      width="100%"
    >
      <ComposedChart
        margin={{ bottom: 0, right: 0, left: 0, top: 0 }}
        layout={layout}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis {...xAxis} />
        <YAxis {...yAxis} />
        <Tooltip
          formatter={(value, name) => [
            valueFormatter(value),
            toTitleCase(name),
          ]}
          content={<CustomTooltip moreItems={tooltipItems}></CustomTooltip>}
        />
        <Legend formatter={toTitleCase} />
        <Bar
          label={{
            fill: brandColors.goldenrodYellow,
            formatter: valueFormatter,
            fontSize: 20,
          }}
          activeBar={<Rectangle fill="#AF2955" />}
          fill={brandColors.ekuMaroon}
          dataKey={barDataKey}
        />
        <Line
          stroke={brandColors.kentuckyBluegrass}
          strokeLinecap="round"
          dataKey="predicted"
          type="monotone"
          strokeWidth={3}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

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
        <p className="recharts-tooltip-label text-center" style={{ margin: 0 }}>
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

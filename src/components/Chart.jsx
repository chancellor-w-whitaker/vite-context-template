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
import { Fragment, useState, useRef, memo } from "react";
import html2canvas from "html2canvas";

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
    const printRef = useRef();

    const handleDownloadImage = async () => {
      const element = printRef.current;
      const canvas = await html2canvas(element);

      const data = canvas.toDataURL("image/jpg");
      const link = document.createElement("a");

      if (typeof link.download === "string") {
        link.href = data;
        link.download = "image.jpg";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(data);
      }
    };

    const [returnedWidth, setReturnedWidth] = useState(0);

    const [zoomed, setZoomed] = useState(true);

    const breakpoints = { medium: 768, small: 576 };

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
          angle: returnedWidth > breakpoints.small ? 0 : -90,
          fill: brandColors.goldenrodYellow,
          formatter: valueFormatter,
          fillOpacity: "100%",
          fontSize: 20,
        },
        fill: brandColors.ekuMaroon,
        dataKey: barDataKey,
      },
      line: {
        stroke: brandColors.kentuckyBluegrass,
        strokeLinecap: "round",
        dataKey: "prediction",
        connectNulls: true,
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
      xAxis: { dataKey: xAxisDataKey, type: "category" },
      cartesianGrid: { strokeDasharray: "3 3" },
      composedChart: { data: [...data] },
      legend: { formatter: toTitleCase },
    };

    return (
      <>
        <div className="d-flex flex-row gap-2 flex-wrap align-items-center">
          <button
            className="btn btn-success shadow-sm bg-gradient d-flex align-items-center"
            onClick={handleDownloadImage}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="bi bi-filetype-jpg"
              fill="currentColor"
              viewBox="0 0 16 16"
              height={20}
              width={20}
            >
              <path
                d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zm-4.34 8.132q.114.23.14.492h-.776a.8.8 0 0 0-.097-.249.7.7 0 0 0-.17-.19.7.7 0 0 0-.237-.126 1 1 0 0 0-.299-.044q-.428 0-.665.302-.234.301-.234.85v.498q0 .351.097.615a.9.9 0 0 0 .304.413.87.87 0 0 0 .519.146 1 1 0 0 0 .457-.096.67.67 0 0 0 .272-.264q.09-.164.091-.363v-.255H8.24v-.59h1.576v.798q0 .29-.097.55a1.3 1.3 0 0 1-.293.458 1.4 1.4 0 0 1-.495.313q-.296.111-.697.111a2 2 0 0 1-.753-.132 1.45 1.45 0 0 1-.533-.377 1.6 1.6 0 0 1-.32-.58 2.5 2.5 0 0 1-.105-.745v-.506q0-.543.2-.95.201-.406.582-.633.384-.228.926-.228.357 0 .636.1.28.1.48.275t.314.407ZM0 14.786q0 .246.082.465.083.22.243.39.165.17.407.267.246.093.569.093.63 0 .984-.345.357-.346.358-1.005v-2.725h-.791v2.745q0 .303-.138.466t-.422.164a.5.5 0 0 1-.454-.246.6.6 0 0 1-.073-.27H0Zm4.92-2.86H3.322v4h.791v-1.343h.803q.43 0 .732-.172.305-.177.463-.475.162-.302.161-.677 0-.374-.158-.677a1.2 1.2 0 0 0-.46-.477q-.3-.18-.732-.179Zm.546 1.333a.8.8 0 0 1-.085.381.57.57 0 0 1-.238.24.8.8 0 0 1-.375.082H4.11v-1.406h.66q.327 0 .512.182.185.181.185.521Z"
                fillRule="evenodd"
              />
            </svg>
          </button>
          <label className="d-flex gap-2">
            <input
              onChange={(e) => setZoomed(e.target.checked)}
              className="form-check-input flex-shrink-0"
              checked={zoomed}
              type="checkbox"
            />
            <span>Zoomed</span>
          </label>
        </div>
        <div ref={printRef}>
          <ResponsiveContainer {...responsiveContainer}>
            <ComposedChart {...composedChart}>
              <CartesianGrid {...cartesianGrid} />
              <XAxis {...xAxis} />
              <YAxis {...yAxis} />
              <Tooltip {...tooltip} />
              <Legend {...legend} />
              <Bar {...bar}>
                {data.map(({ hideInTooltip = false }, index) => (
                  <Cell
                    fill={
                      hideInTooltip
                        ? brandColors.kentuckyBluegrass
                        : brandColors.ekuMaroon
                    }
                    fillOpacity={hideInTooltip ? "75%" : "100%"}
                    key={`cell-${index}`}
                  />
                ))}
              </Bar>
              <Line {...line} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
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

            const { hideInTooltip = false } = payload;

            // const shouldHide = "hide" in payload && payload.hide === name;

            return (
              hideInTooltip !== name && (
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

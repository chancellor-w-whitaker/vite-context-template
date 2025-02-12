import {
  ResponsiveContainer,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  LabelList,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  Line,
  Cell,
  Bar,
} from "recharts";
import { useState, useRef, memo } from "react";
import html2canvas from "html2canvas";

import confidentialityNumber, {
  confidentialityString,
  isConfidential,
} from "../constants/confidentialityNumber";
import { toTitleCase } from "../functions/formatters/toTitleCase";
import { brandColors } from "../constants/brandColors";
import { CustomTooltip } from "./CustomTooltip";
import { colors } from "../constants/colors";

const renderLegend = (props) => {
  const { formatter, payload } = props;

  const removeBorderLine = (p) =>
    p.filter(
      ({ value, color }) =>
        !(color === colors.lineBorder && value === "prediction")
    );

  const drawItemShape = ({ color, type }) => {
    if (type === "rect") {
      return (
        <path
          className="recharts-legend-icon"
          d="M0,4h32v24h-32z"
          stroke="none"
          fill={color}
        />
      );
    }
    if (type === "line") {
      return (
        <path
          d="M0,16h10.666666666666666
  A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
  H32M21.333333333333332,16
  A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"
          className="recharts-legend-icon"
          strokeWidth={4}
          stroke={color}
          fill="none"
        />
      );
    }
  };

  return (
    <ul
      style={{ textAlign: "center", padding: 0, margin: 0 }}
      className="recharts-default-legend"
    >
      {removeBorderLine(payload).map((item, index) => (
        <li
          style={{ display: "inline-block", marginRight: 10 }}
          className="recharts-legend-item legend-item-0"
          key={index}
        >
          <svg
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              marginRight: 4,
            }}
            className="recharts-surface"
            viewBox="0 0 32 32"
            height={14}
            width={14}
          >
            <title />
            <desc />
            {drawItemShape({ color: item.color, type: item.type })}
          </svg>
          <span
            className="recharts-legend-item-text"
            style={{ color: item.color }}
          >
            {formatter(item.value)}
          </span>
        </li>
      ))}
    </ul>
  );
};

const height = 500;

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
    nameFormatter = toTitleCase,
    xAxisTickFormatter,
    shouldFindRates,
    valueFormatter,
    noRowsToShow,
    tooltipItems,
    xAxisDataKey,
    yAxisDomain,
    stretchGoal,
    barDataKey,
    yAxisTicks,
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

    // const numeratorTooLow = (value) => shouldFindRates && value <= 5;

    const mapFunction = shouldFindRates
      ? (row) => row
      : ({ [barDataKey]: value, inFuture, ...rest }) => ({
          [barDataKey]: isConfidential({
            isRate: shouldFindRates,
            inFuture,
            value,
          })
            ? confidentialityNumber
            : value,
          inFuture,
          ...rest,
        });

    const adjustedData = data.map(mapFunction);

    const {
      responsiveContainer,
      composedChart,
      cartesianGrid,
      tooltip,
      legend,
      xAxis,
      yAxis,
      lines,
      bar,
    } = {
      bar: {
        children: (
          <>
            {data.map(({ [barDataKey]: value, inFuture = false }, index) => (
              <Cell
                stroke={
                  isConfidential({ isRate: shouldFindRates, inFuture, value })
                    ? brandColors.ekuMaroon
                    : "none"
                }
                fillOpacity={
                  isConfidential({ isRate: shouldFindRates, inFuture, value })
                    ? "50%"
                    : "100%"
                }
                fill={
                  inFuture
                    ? brandColors.kentuckyBluegrass
                    : brandColors.ekuMaroon
                }
                key={`cell-${index}`}
              />
            ))}
            <LabelList
              {...{
                valueAccessor: ({ inFuture, value }) =>
                  isConfidential({ isRate: shouldFindRates, inFuture, value })
                    ? confidentialityString
                    : value,
                formatter: (value) =>
                  typeof value === "number" ? valueFormatter(value) : value,
                angle: returnedWidth > breakpoints.small ? 0 : -90,
                fill: brandColors.goldenrodYellow,
                className: "fw-bold",
                paintOrder: "stroke",
                fillOpacity: "100%",
                stroke: "#212529",
                strokeWidth: 2,
                fontSize: 20,
              }}
            ></LabelList>
            <LabelList
              {...{
                valueAccessor: ({ inFuture }) => (inFuture ? "Forecast" : null),
                angle: returnedWidth > breakpoints.small ? 0 : -90,
                position: "insideBottom",
                fill: colors.forecast,
                className: "fw-bold",
                paintOrder: "stroke",
                fillOpacity: "100%",
                stroke: "#212529",
                strokeWidth: 2,
                fontSize: 14,
              }}
            ></LabelList>
          </>
        ),
        // label: {
        //   angle: returnedWidth > breakpoints.small ? 0 : -90,
        //   fill: brandColors.goldenrodYellow,
        //   formatter: valueFormatter,
        //   fillOpacity: "100%",
        //   fontSize: 20,
        // },
        fill: brandColors.ekuMaroon,
        dataKey: barDataKey,
      },
      lines: [
        {
          stroke: colors.lineBorder,
          strokeLinecap: "round",
          dataKey: "prediction",
          connectNulls: true,
          type: "monotone",
          strokeWidth: 4,
          dot: false,
        },
        {
          stroke: brandColors.kentuckyBluegrass,
          strokeLinecap: "round",
          dataKey: "prediction",
          connectNulls: true,
          type: "monotone",
          strokeWidth: 3,
          dot: false,
        },
      ],
      tooltip: {
        content: (
          <CustomTooltip
            shouldFindRates={shouldFindRates}
            moreItems={tooltipItems}
          ></CustomTooltip>
        ),
        formatter: (value, name) => [
          valueFormatter(value),
          nameFormatter(name),
        ],
        labelFormatter: xAxisTickFormatter,
      },
      yAxis: {
        // padding: stretchGoal ? { top: 20 } : null,
        domain: zoomed ? yAxisDomain : null,
        ticks: zoomed ? yAxisTicks : null,
        tickFormatter: valueFormatter,
        type: "number",
      },
      responsiveContainer: {
        onResize: (width) => setReturnedWidth(width),
        width: "100%",
        height,
      },
      xAxis: {
        tickFormatter: xAxisTickFormatter,
        dataKey: xAxisDataKey,
        type: "category",
      },
      legend: { formatter: nameFormatter, content: renderLegend },
      composedChart: {
        data: adjustedData,
      },
      cartesianGrid: { strokeDasharray: "3 3" },
    };

    const chartJsx = (
      <ResponsiveContainer {...responsiveContainer}>
        <ComposedChart {...composedChart}>
          <CartesianGrid {...cartesianGrid} />
          <XAxis {...xAxis} />
          <YAxis {...yAxis} />
          <Tooltip {...tooltip} />
          <Legend {...legend} />
          <Bar {...bar} />
          {lines.map((line, i) => (
            <Line key={i} {...line}></Line>
          ))}
          {stretchGoal && (
            <ReferenceLine
              label={{
                position: "insideTopLeft",
                value: stretchGoal.label,
                fill: colors.goalLabel,
              }}
              stroke={colors.goalLine}
              y={stretchGoal.amount}
              strokeDasharray="3 3"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    );

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
        {noRowsToShow ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height }}
          >
            No Data To Show
          </div>
        ) : (
          <div>{chartJsx}</div>
        )}
        <div
          style={{
            position: "fixed",
            bottom: "100%",
            width: 1264,
            height,
          }}
          ref={printRef}
        >
          {chartJsx}
        </div>
      </>
    );
  }
);

Chart.displayName = "Chart";

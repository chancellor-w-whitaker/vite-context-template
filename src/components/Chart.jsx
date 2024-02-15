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

import { toTitleCase } from "../functions/formatters/toTitleCase";

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

export const Chart = ({ valueFormatter, xAxisDataKey, barDataKey, data }) => {
  return (
    <ResponsiveContainer height={500} width="100%">
      <ComposedChart
        margin={{ bottom: 0, right: 0, left: 0, top: 0 }}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisDataKey} />
        <YAxis tickFormatter={valueFormatter} />
        <Tooltip
          formatter={(value, name) => [
            valueFormatter(value),
            toTitleCase(name),
          ]}
        />
        <Legend formatter={toTitleCase} />
        <Bar
          label={{
            formatter: valueFormatter,
            // position: "insideTop",
            fill: "#FFC658",
            fontSize: 20,
          }}
          activeBar={<Rectangle fill="#87909A" />}
          dataKey={barDataKey}
          fill="#87909A"
        />
        <Line
          dataKey="predicted"
          stroke="#009681"
          type="monotone"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

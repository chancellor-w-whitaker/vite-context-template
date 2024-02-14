import {
  ResponsiveContainer,
  CartesianGrid,
  Rectangle,
  BarChart,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

import { toTitleCase } from "../functions/formatters/toTitleCase";

export const Chart = ({ valueFormatter, xAxisDataKey, barDataKey, data }) => {
  return (
    <ResponsiveContainer height={500} width="100%">
      <BarChart margin={{ bottom: 0, right: 0, left: 0, top: 0 }} data={data}>
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
            position: "insideTop",
            fill: "#FFC658",
            fontSize: 20,
          }}
          activeBar={<Rectangle fill="#be2c5c" />}
          dataKey={barDataKey}
          fill="#861F41"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

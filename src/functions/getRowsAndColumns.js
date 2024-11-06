import { toStandardizedKey } from "./formatters/toStandardizedKey";
import { alternateValues } from "../constants/alternateValues";

export const getRowsAndColumns = (data) => {
  if (!(Array.isArray(data) && data.length > 0)) {
    return { relevantDropdowns: {}, columns: {}, rows: [] };
  }

  const rows = [];

  let columns = {};

  data.forEach((object) => {
    const row = {};

    Object.keys(object).forEach((key) => {
      if (!(key in columns)) {
        columns[key] = {
          field: toStandardizedKey(key),
          values: new Set(),
          types: {},
        };
      }

      const { values, types, field } = columns[key];

      const value = object[key];

      const actualValue =
        field in alternateValues && value in alternateValues[field]
          ? alternateValues[field][value]
          : value;

      const type = typeof actualValue;

      values.add(actualValue);

      if (!(type in types)) {
        types[type] = 0;
      }

      types[type]++;

      row[field] = actualValue;
    });

    rows.push(row);
  });

  columns = Object.fromEntries(
    Object.values(columns).map(({ values, field, types }) => [
      field,
      {
        type: Object.keys(types)
          .sort((typeA, typeB) => types[typeB] - types[typeA])
          .filter((type) => ["string", "number"].includes(type))[0],
        values: Array.from(values).sort(),
      },
    ])
  );

  // fall, spring, summer enrollment + credit hours

  // for fall enrollment, filtered rows by "online" === "Online Program" && removed "online" field
  // for others, filtered rows by "something" === "something Online" && removed "something" field

  // for credit hours, filter rows by ["EKU Online","Traditional Online"].includes(courseOnline)
  // keep columns the same
  // have "EKU Online" be automatically set (so "Traditional Online" be unchecked)

  return { columns, rows };

  // return {
  //   columns: Object.fromEntries(
  //     Object.entries(columns).filter(([key]) => key !== "online")
  //   ),

  //   rows: rows.filter(({ online }) => online === "Online Program"),
  // };
};

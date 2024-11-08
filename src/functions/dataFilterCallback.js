import { isEkuOnline } from "../constants/isEkuOnline";

const courseOnlineValues = new Set(["ECampus Online", "Traditional Online"]);

const preFilterByOnline = (row) => {
  if (row["onlineDesc"] && row["onlineDesc"] !== "Online Program") {
    return false;
  }

  if (row["course_online"] && !courseOnlineValues.has(row["course_online"])) {
    return false;
  }

  return true;
};

const noPreFilter = (row) => row;

export const dataFilterCallback = isEkuOnline ? preFilterByOnline : noPreFilter;

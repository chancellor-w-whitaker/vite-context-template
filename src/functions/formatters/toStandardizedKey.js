import { Str } from "@supercharge/strings";

export const toStandardizedKey = (key) =>
  Str(key)
    .camel()
    .words()
    .filter((word) => word.toLowerCase() !== "desc")
    .join("");

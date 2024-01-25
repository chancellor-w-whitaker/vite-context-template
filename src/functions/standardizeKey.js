import { Str } from "@supercharge/strings";

export const standardizeKey = (key) =>
  Str(key)
    .camel()
    .words()
    .filter((word) => word.toLowerCase() !== "desc")
    .join("");

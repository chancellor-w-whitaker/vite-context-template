import { Str } from "@supercharge/strings";

export const toTitleCase = (string) => Str(string).pascal().words().join(" ");

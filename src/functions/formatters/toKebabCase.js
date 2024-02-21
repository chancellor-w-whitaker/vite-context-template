import { Str } from "@supercharge/strings";

export const toKebabCase = (string) => Str(string).kebab().get();

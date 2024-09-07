import { z } from "zod";

/**
 * Used to handle strings as numbers in zod schemas. This is mainly useful for query parameters.
 * @param schema your zod number schema
 * @returns the updated schema with a preprocessor able to parse strings into numbers
 * @example numericString(z.number()).parse("123") // 123
 */
export function numericString(
  schema: z.ZodTypeAny
): z.ZodEffects<z.ZodTypeAny, number, number> {
  return z.preprocess((a) => {
    if (typeof a === "string") {
      return parseInt(a, 10);
    } else if (typeof a === "number") {
      return a;
    } else {
      return undefined;
    }
  }, schema) as z.ZodEffects<z.ZodTypeAny, number, number>;
}

/**
 * Boolean string preprocessing function.
 */
const stringBooleanProcessor = (
  schema: z.ZodTypeAny
): z.ZodEffects<z.ZodTypeAny, boolean | string, boolean> => {
  return z.preprocess((a) => {
    if (typeof a === "string") {
      switch (a) {
        case "true":
        case "1":
        case "t":
          return true;
        case "false":
        case "0":
        case "f":
          return false;
        default:
          return undefined;
      }
    } else if (typeof a === "boolean") {
      return a;
    } else {
      return undefined;
    }
  }, schema) as z.ZodEffects<z.ZodTypeAny, boolean | string, boolean>;
};

/**
 * Utility function to parse a string into a boolean.
 * @returns a boolean schema with a preprocessor able to parse strings into booleans
 * @example stringBoolean().parse("true") // true
 * @example stringBoolean().parse("false") // false
 * @example stringBoolean().parse("1") // true
 * @example stringBoolean().parse("0") // false
 */
export function stringBoolean(): z.ZodEffects<
  z.ZodTypeAny,
  boolean | string,
  boolean
> {
  return stringBooleanProcessor(z.boolean());
}

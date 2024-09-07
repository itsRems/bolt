import { BoltQueryEncoder } from "./types";

/**
 * Query string encoding/decoding functions
 */

export function encodeIndexedKeysQueryStringParams(
  query: Record<string, any>,
  prefix?: string
) {
  const encoded = Object.keys(query).map((key) => {
    const value = query[key];
    const fullKey = prefix
      ? `${prefix}[${encodeURIComponent(key)}]`
      : encodeURIComponent(key);

    if (value !== null && typeof value === "object") {
      // Recursively encode nested objects/arrays
      return encodeIndexedKeysQueryStringParams(value, fullKey);
    } else {
      // Simple key=value pair
      return `${fullKey}=${encodeURIComponent(String(value))}`;
    }
  });

  return encoded.join("&");
}

export function encodeRepeatedKeysQueryStringParams(
  query: Record<string, any>,
  prefix?: string
) {
  const encoded = Object.keys(query).map((key) => {
    const value = query[key];
    const fullKey = prefix
      ? `${prefix}[${encodeURIComponent(key)}]`
      : encodeURIComponent(key);

    if (Array.isArray(value)) {
      // For arrays, use repeated keys
      return value
        .map(
          (v) =>
            `${encodeURIComponent(prefix || key)}=${encodeURIComponent(
              String(v)
            )}`
        )
        .join("&");
    } else if (value !== null && typeof value === "object") {
      // Recursively encode nested objects
      return encodeRepeatedKeysQueryStringParams(value, fullKey);
    } else {
      // Simple key=value pair
      return `${fullKey}=${encodeURIComponent(String(value))}`;
    }
  });

  return encoded.join("&");
}

/**
 * Combo query string encoding/decoding functions
 */
export function encodeQueryParams(
  query: Record<string, any>,
  encoder: BoltQueryEncoder = "string-indexed-keys"
): string {
  let q: string;
  switch (encoder) {
    case "string-repeated-keys":
      q = encodeRepeatedKeysQueryStringParams(query);
      break;
    // Default to indexed keys
    case "string-indexed-keys":
    default:
      q = encodeIndexedKeysQueryStringParams(query);
  }
  return q?.length > 0 ? `?${q}` : "";
}

/**
 * Query string decoding function that handles indexed bracket notation.
 */
export function decodeIndexedKeysQueryStringParams(
  query: string
): Record<string, any> {
  const params = new URLSearchParams(query);
  const result: Record<string, any> = {};

  params.forEach((value, key) => {
    const keys = key.replace(/\]/g, "").split("["); // Convert bracket notation into an array of keys

    keys.reduce((acc, curKey, index) => {
      if (index === keys.length - 1) {
        // If the last key, assign the value
        acc[curKey] = decodeURIComponent(value);
      } else {
        // Ensure the next level is an object or array
        if (!acc[curKey]) {
          acc[curKey] = isNaN(Number(keys[index + 1])) ? {} : [];
        }
        return acc[curKey];
      }
      return acc;
    }, result);
  });

  return result;
}

/**
 * Decodes a query string using repeated keys for arrays.
 */
export function decodeRepeatedKeysQueryStringParams(
  query: string
): Record<string, any> {
  const params = new URLSearchParams(query);
  const result: Record<string, any> = {};

  params.forEach((value, key) => {
    if (result[key]) {
      // Handle repeated keys by adding the value to an array
      if (Array.isArray(result[key])) {
        result[key].push(decodeURIComponent(value));
      } else {
        result[key] = [result[key], decodeURIComponent(value)];
      }
    } else {
      result[key] = decodeURIComponent(value);
    }
  });

  return result;
}

/**
 * Main decoding function that allows for different decoding strategies.
 */
export function decodeQueryParams(
  query: string,
  encoder: BoltQueryEncoder = "string-indexed-keys"
): Record<string, any> {
  let decoded: Record<string, any>;
  switch (encoder) {
    case "string-repeated-keys":
      decoded = decodeRepeatedKeysQueryStringParams(query);
      break;
    // Default to indexed keys
    case "string-indexed-keys":
    default:
      decoded = decodeIndexedKeysQueryStringParams(query);
  }
  return decoded;
}

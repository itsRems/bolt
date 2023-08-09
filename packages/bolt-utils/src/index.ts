export type MaybeArray<T> = T | T[];

// transform deep objects into a flat object with dot notation
export function flattenObject<T extends object>(obj: T, prefix = '') {
  const flattened = {};
  Object.entries(obj).forEach(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object') {
      Object.assign(flattened, flattenObject(value, path));
    } else {
      flattened[path] = value;
    }
  });
  return flattened;
}

export function deepFind<T extends object>(obj: T, path: string) {
  const paths = path.split('.');
  let current = obj;
  let i = 0;

  for (i = 0; i < paths.length; ++i) {
    if (current?.[paths?.[i]] === undefined) {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }
  return current;
}
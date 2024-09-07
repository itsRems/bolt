import { Parser } from './types';

export * from './types';

export function getParseFn<V>(parser: Parser): (value: unknown) => V | Promise<V> {
  const p = parser as any;

  if (typeof p === 'function') {
    return p;
  }

  if (typeof p?.parse === 'function') {
    return p.parse;
  }

  throw new Error(`Invalid parser`);
}

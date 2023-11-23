import { AnyRoute } from './route';
import { Opaque } from './types';

export * from './route';
export * from './parsing';
export * from './types';

export interface RouterRecord {
  [key: string]: AnyRoute | RouterRecord;
}

export function createRouter<N extends string, T extends RouterRecord>(router: T, name?: N): Opaque<T, N> {
  return router as Opaque<T, N>;
}

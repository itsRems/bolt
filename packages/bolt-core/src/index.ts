import { AnyRoute } from './route';

export * from './route';
export * from './parsing';
export * from './types';

export interface RouterRecord {
  [key: string]: AnyRoute | RouterRecord;
}

export function createRouter<T extends RouterRecord>(router: T) {
  return router;
}

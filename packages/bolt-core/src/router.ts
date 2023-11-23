import { AnyRoute } from './route';

export interface RouterRecord {
  [key: string]: AnyRoute | RouterRecord;
}

export function createRouter<T extends RouterRecord>(router: T) {
  return router;
}

type RouterRecordValue<T> = T | RouterRecord<T>;

export interface RouterRecord<T = any> {
  [key: string]: RouterRecordValue<T>;
}

export function createRouter<T extends RouterRecord>(router: T): T {
  return router;
}
export type NestedRouterRecord<T> = {
  [key in keyof T]: T[key] extends infer U ? U extends RouterRecord ? NestedRouterRecord<U> : U : never;
};

export interface RouterRecord {
  [key: string]: RouterRecord | NestedRouterRecord<RouterRecord>;
}

export function createRouter<T extends RouterRecord>(router: T): T {
  return router ;
}
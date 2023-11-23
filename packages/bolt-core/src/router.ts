import { AnyRoute } from './route';

export type NestedRouterRecord<T> = {
  [K in keyof T]: T[K] extends AnyRoute | infer U ? U extends RouterRecord ? NestedRouterRecord<U> : U : never;
};

export interface RouterRecord {
  [key: string]: AnyRoute | RouterRecord;
}

export function createRouter<T extends RouterRecord>(router: T): NestedRouterRecord<T> {
  return router as any;
}

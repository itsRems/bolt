import { AnyRoute } from './route';

export * from './route';
export * from './parsing';
export * from './types';

export interface RouterRecord {
  [key: string]: AnyRoute | RouterRecord;
}

declare const tag: unique symbol;

declare type Tagged<Token> = {
  readonly [tag]: Token;
};

export type Opaque<Type, Token = unknown> = Type & Tagged<Token>;

export function createRouter<N extends string, T extends RouterRecord>(router: T, name?: N): Opaque<T, N> {
  return router as Opaque<T, N>;
}

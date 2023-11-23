export type RestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export const unsetMarker = Symbol('unsetMarker');

// Util type used to figure out if a value is unset
export type UnsetMarker = typeof unsetMarker;

export type Simplify<TType> = TType extends any[] | Date ? TType : { [K in keyof TType]: TType[K] };

export type OverwriteIfDefined<TType, TWith> = UnsetMarker extends TType ? TWith : Simplify<TType & TWith>;

export declare const tag: unique symbol;

export declare type Tagged<Token> = {
  readonly [tag]: Token;
};

export type Opaque<Type, Token = unknown> = Type & Tagged<Token>;
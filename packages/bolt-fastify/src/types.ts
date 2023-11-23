import { RouteHandler as FastifyRouteHandler } from 'fastify';
import { RouteBuilder, RouteParams, RouterRecord } from '@bolt-ts/core';

export type AnyRouteHandler<X extends FastifyRouteHandler = FastifyRouteHandler> = (args: X) => Promise<any>;

export type HandlerUtil<TParams extends RouteParams> = FastifyRouteHandler<{
  Querystring: TParams['_query_out'];
  Body: TParams['_body_out'];
  Reply: TParams['_output_out'];
  Headers: TParams['_headers_out'];
  Params: TParams['_params_out'];
}>;

export type RouterHandlerMapper<T extends RouterRecord> = {
  [K in keyof T]?: T[K] extends RouteBuilder<infer TParams>
    ? HandlerUtil<TParams>
    : T[K] extends RouterRecord
    ? RouterHandlerMapper<T[K]>
    : never;
};
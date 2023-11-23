import { AnyRoute, RouteBuilder, RouteParams, RouterRecord, getParseFn } from '@bolt-ts/core';
import { MaybeArray, deepFind, flattenObject } from '@bolt-ts/utils';

import fastify, { FastifyListenOptions, RouteHandler as FastifyRouteHandler } from 'fastify';
import { AnyRouteHandler, RouterHandlerMapper } from './types';
import { BoltServer } from './server';

function handlerKey<TParams extends RouteParams>(route: RouteBuilder<TParams>) {
  return `${route._def.path}-${route._def.method ?? 'GET'}`;
}

export class BoltModule<T extends RouterRecord> {
  public handlers = new Map<string, AnyRouteHandler>();
  public routes = new Set<AnyRoute>();

  constructor(public server: BoltServer, public router: T) {
    this.registerRoutes(router);
    this.server.validateRoutes();
  }

  registerRoutes(routes: MaybeArray<AnyRoute> | RouterRecord, validate = false) {
    if (Array.isArray(routes)) {
      routes.forEach((route) => this.registerRoutes(route));
    } else if ((routes as any)._def) {
      this.routes.add(routes as AnyRoute);
    } else {
      Object.values(routes).forEach((route) => this.registerRoutes(route));
    }
    if (validate) {
      this.server.validateRoutes();
    }
  }

  registerHandlers(handlers: RouterHandlerMapper<T>) {
    const flat = flattenObject(handlers);
    for (const path in flat) {
      const route = deepFind(this.router, path) as AnyRoute | undefined;
      if (route) {
        this.handlers.set(handlerKey(route), flat[path] as AnyRouteHandler);
      } else {
        console.warn(`No route found for path: ${path}`);
      }
    }
  }
}

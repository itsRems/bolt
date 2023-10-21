import { AnyRoute, RouteBuilder, RouteParams, RouterRecord, getParseFn } from '@bolt-ts/core';
import { MaybeArray, deepFind, flattenObject } from '@bolt-ts/utils';

import fastify, { FastifyListenOptions, RouteHandler as FastifyRouteHandler } from 'fastify';

export type AnyRouteHandler<X extends FastifyRouteHandler = FastifyRouteHandler> = (args: X) => Promise<any>;

type HandlerUtil<TParams extends RouteParams> = FastifyRouteHandler<{
  Querystring: TParams['_query_out'];
  Body: TParams['_body_out'];
  Reply: TParams['_output_out'];
  Headers: TParams['_headers_out'];
  Params: TParams['_params_out'];
}>;

type RouterHandlerMapper<T extends RouterRecord> = {
  [K in keyof T]?: T[K] extends RouteBuilder<infer TParams>
    ? HandlerUtil<TParams>
    : T[K] extends RouterRecord
    ? RouterHandlerMapper<T[K]>
    : never;
};

function handlerKey<TParams extends RouteParams>(route: RouteBuilder<TParams>) {
  return `${route._def.path}-${route._def.method ?? 'GET'}`;
}

export class BoltServer<T extends RouterRecord> {
  public handlers = new Map<string, AnyRouteHandler>();
  public routes = new Set<AnyRoute>();

  constructor(public router: T, public server = fastify()) {
    this.registerRoutes(router);
    this.validateRoutes();
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
      this.validateRoutes();
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

  validateRoutes(checkHandlers = false) {
    // Check for CONFLICT routes
    const routePaths = Array.from(this.routes).map((route) => handlerKey(route));
    const uniqueRoutePaths = new Set(routePaths);
    if (routePaths.length !== uniqueRoutePaths.size) {
      throw new Error(`Duplicate routes: ${routePaths.filter((route, index) => routePaths.indexOf(route) !== index)}`);
    }

    if (checkHandlers) {
      // Check for unregistered handlers
      this.routes.forEach((route) => {
        if (!this.handlers.has(handlerKey(route))) {
          throw new Error(
            `Route handler not registered for route: ${`${route._def.method ?? 'get'}`.toUpperCase()} ${
              route._def.path
            }`
          );
        }
      });
    }
  }

  attachRoutes() {
    this.validateRoutes(true);
    for (const route of this.routes) {
      if (!this.handlers.has(handlerKey(route))) {
        continue;
      }
      this.server.route({
        ...(route._def.settings?.fastifyOptions ?? {}),
        ...route._def.settings?.fastifyConfig && {
          config: route._def.settings.fastifyConfig,
        },
        method: route._def.method ?? 'GET',
        url: route._def.path as string,
        preHandler: async (req, res) => {
          try {
            if (route._def.settings?.validateQuery && route._def.query) {
              let parseFn: ((input: any) => any | Promise<any>) | undefined = undefined;
              try {
                parseFn = getParseFn(route._def.query);
              } catch (error) {
                // silent fail (we didn't find a parse function)
              }
              if (parseFn) {
                req.query = await parseFn(req.query);
              }
            }
            if (route._def.settings?.validateBody && route._def.body) {
              let parseFn: ((input: any) => any | Promise<any>) | undefined = undefined;
              try {
                parseFn = getParseFn(route._def.body);
              } catch (error) {
                // silent fail (we didn't find a parse function)
              }
              if (parseFn) {
                req.body = await parseFn(req.body);
              }
            }
          } catch (error) {
            return res.status(400).send(error);
          }
        },
        handler: this.handlers.get(handlerKey(route)) as any,
      });
    }
  }

  async start(options: FastifyListenOptions) {
    this.attachRoutes();
    await this.server.listen(options);
  }
}

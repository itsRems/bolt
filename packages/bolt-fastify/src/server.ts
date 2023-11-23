import { AnyRoute, RouteBuilder, RouteParams, getParseFn } from '@bolt-ts/core';
import { AnyRouteHandler } from './types';
import fastify, { FastifyListenOptions } from 'fastify';
import { BoltModule } from './module';

function handlerKey<TParams extends RouteParams>(route: RouteBuilder<TParams>) {
  return `${route._def.path}-${route._def.method ?? 'GET'}`;
}

export class BoltServer {
  constructor(public server = fastify(), public modules: BoltModule<any>[]) {
    this.validateRoutes();
  }

  validateRoutes(checkHandlers = false) {
    // Check for conflicting routes
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

  public get handlers () {
    return new Map<string, AnyRouteHandler>(this.modules.reduce((handlers, module) => {
      return [...handlers, ...Array.from(module.handlers.entries())]
    }, [] as [string, AnyRouteHandler][]))
  }

  public get routes () {
    return new Set<AnyRoute>(this.modules.reduce((routes, module) => {
      return [...routes, ...Array.from(module.routes)]
    }, [] as AnyRoute[]))
  }
}

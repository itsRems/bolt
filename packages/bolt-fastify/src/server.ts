import { AnyRoute, RouteBuilder, RouteParams, RouterRecord, getParseFn } from '@bolt-ts/core';
import { AnyRouteHandler } from './types';
import fastify, { FastifyListenOptions } from 'fastify';
import { BoltModule } from './module';

function handlerKey<TParams extends RouteParams>(route: RouteBuilder<TParams>) {
  return `${route._def.path}-${route._def.method ?? 'GET'}`;
}

export class BoltServer {
  public modules: BoltModule<any>[] = [];
  constructor(public server = fastify()) {
    this.validateRoutes();
  }

  public addModule<T extends RouterRecord>(router: T) {
    const module = new BoltModule(this, router);
    this.modules.push(module);
    return module;
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
        onSend: async (req, res, payload, done) => {
          if (route._def.settings?.validateResponse && route._def.output) {
            let parseFn: ((input: any) => any | Promise<any>) | undefined = undefined;
            try {
              parseFn = getParseFn(route._def.output);
            } catch (error) {
              // silent fail (we didn't find a parse function)
            }
            if (parseFn) {
              // only handle JSON for now
              if ((res.getHeader('content-type') as string).startsWith('application/json')) {
                const parsed = await parseFn(JSON.parse(payload as string));
                return done(null, JSON.stringify(parsed));
              }
            }
          }
          return done(null, payload);
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
    const handlers = new Map<string, AnyRouteHandler>()

    for (const module of this.modules) {
      for (const [key, value] of module.handlers.entries()) {
        handlers.set(key, value)
      }
    }

    return handlers
  }

  public get routes () {
    const routes = new Set<AnyRoute>()

    for (const module of this.modules) {
      for (const route of module.routes) {
        routes.add(route)
      }
    }

    return routes
  }
}

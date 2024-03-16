import { IMappedOptions } from '@bolt-ts/core';
import { IOutput } from '@bolt-ts/core';
import { RouteBuilder, RouteParams, RouteSettings, RouterRecord, UnsetMarker, getParseFn } from '@bolt-ts/core';

import { ApiInstance, PlexusApiRes } from '@plexusjs/napi';


export type PlexusMappedRoute<TParams extends RouteParams> = (
  params: IMappedOptions<TParams>
) => Promise<PlexusApiRes<IOutput<TParams>>>;

export type RouterMapper<T extends RouterRecord> = {
  [K in keyof T]: T[K] extends RouteBuilder<infer TParams>
    ? PlexusMappedRoute<TParams>
    : T[K] extends RouterRecord
    ? RouterMapper<T[K]>
    : never;
};

export function createPlexusRouter<
  R extends RouterRecord,
  PR = RouterMapper<R> & {
    _api: ApiInstance;
  }
>(router: R, api: ApiInstance = new ApiInstance()): PR {
  const plexusRouter = {
    _api: api,
  } as PR;
  for (const routeName of Object.keys(router)) {
    const route = router[routeName];
    if (!(route as any)._def) {
      plexusRouter[routeName] = createPlexusRouter(route as any, api);
      continue;
    }
    const plexusRoute = boltRouteToPlexus(api, route as any);
    plexusRouter[routeName] = plexusRoute;
  }
  return plexusRouter;
}

export function boltRouteToPlexus<TParams extends RouteParams>(
  api: ApiInstance,
  route: RouteBuilder<TParams>,
  options?: RouteSettings
): PlexusMappedRoute<TParams> {
  return async ({ params, query, body }) => {
    const method = `${route._def.method ?? 'get'}`?.toLowerCase() as ['get', 'post', 'put', 'patch', 'delete'][number];

    // Build path
    let path = route._def.path as string;
    // Handle route params
    if (path.includes(':')) {
      const pathParts = path.split('/');
      const paramParts = Object.keys(params ?? {});

      if (options?.validateParams && route._def.params) {
        let parseFn: ((input: any) => any | Promise<any>) | undefined = undefined;
        try {
          parseFn = getParseFn(route._def.params);
        } catch (error) {
          // silent fail (we didn't find a parse function)
        }
        if (parseFn) {
          params = await parseFn(params);
        }
      }

      for (const [index, part] of pathParts.entries()) {
        if (part.startsWith(':')) {
          const paramName = part.slice(1);
          if (!paramParts.includes(paramName)) {
            throw new Error(`Missing param: ${paramName}`);
          }
          const param = params?.[paramName];
          if (param) {
            pathParts[index] = param;
          }
        }
      }

      path = pathParts.join('/');
    }
    // Handle query parameters
    if (method !== 'get') {
      path += '?';
      const queryParts = Object.keys(query ?? {});

      if (options?.validateQuery && route._def.query) {
        let parseFn: ((input: any) => any | Promise<any>) | undefined = undefined;
        try {
          parseFn = getParseFn(route._def.query);
        } catch (error) {
          // silent fail (we didn't find a parse function)
        }
        if (parseFn) {
          query = await parseFn(query);
        }
      }
      for (const part of queryParts) {
        const v = query?.[part];
        if (v) {
          path += `${part}=${v}&`;
        }
      }
    }

    if (options?.validateBody && route._def.body) {
      let parseFn: ((input: any) => any | Promise<any>) | undefined = undefined;
      try {
        parseFn = getParseFn(route._def.body);
      } catch (error) {
        // silent fail (we didn't find a parse function)
      }
      if (parseFn) {
        body = await parseFn(body);
      }
    }

    switch (method) {
      case 'get':
        return api.get<IOutput<TParams>>(path, query ?? {});
      case 'post':
        return api.post<IOutput<TParams>>(path, body ?? {});
      case 'put':
        return api.put<IOutput<TParams>>(path, body ?? {});
      case 'patch':
        return api.patch<IOutput<TParams>>(path, body ?? {});
      case 'delete':
        return api.delete<IOutput<TParams>>(path);
    }
  };
}

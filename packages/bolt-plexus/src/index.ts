import { RouteBuilder, RouteParams, RouteSettings, RouterRecord, UnsetMarker, getParseFn } from '@bolt-ts/core';

import { ApiInstance, PlexusApiFetchOptions, PlexusApiRes, PlexusApiSendOptions } from '@plexusjs/napi';

type StringParamToObject<P extends string> = P extends `${infer _Prefix}:${infer Param}/${infer Rest}`
  ? { [K in Param]: string | number } & StringParamToObject<Rest>
  : P extends `${infer _Prefix}:${infer Param}`
  ? { [K in Param]: string | number }
  : {};

export type IParams<TParams extends RouteParams> = TParams['_params_in'] extends UnsetMarker
  ? {
      params?: undefined;
    }
  : undefined extends TParams['_params_in']
  ? TParams['_path'] extends `${infer _Prefix}:${infer Param}`
    ? {
        params?: StringParamToObject<TParams['_path']>;
      }
    : {
        params?: undefined;
      }
  : {
      params: TParams['_params_in'];
    };

export type IQuery<TParams extends RouteParams> = TParams['_query_in'] extends UnsetMarker
  ? {
      query?: undefined;
    }
  : undefined extends TParams['_query_in']
  ? {
      query?: TParams['_query_in'];
    }
  : {
      query: TParams['_query_in'];
    };

export type IBody<TParams extends RouteParams> = TParams['_body_in'] extends UnsetMarker
  ? {
      body?: undefined;
    }
  : undefined extends TParams['_body_in']
  ? {
      body?: TParams['_body_in'];
    }
  : {
      body: TParams['_body_in'];
    };

export type IOutput<TParams extends RouteParams> = TParams['_output_out'] extends UnsetMarker
  ? undefined
  : TParams['_output_out'];

export type IMappedOptions<TParams extends RouteParams> = IParams<TParams> & IQuery<TParams> & IBody<TParams> & {
  headers?: PlexusApiFetchOptions['headers']
};

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
  return async ({ params, query, body, headers }) => {
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
        return api.get<IOutput<TParams>>(path, query ?? {}, { headers });
      case 'post':
        return api.post<IOutput<TParams>>(path, body ?? {}, { headers });
      case 'put':
        return api.put<IOutput<TParams>>(path, body ?? {}, { headers });
      case 'patch':
        return api.patch<IOutput<TParams>>(path, body ?? {}, { headers });
      case 'delete':
        return api.delete<IOutput<TParams>>(path, {}, { headers });
    }
  };
}

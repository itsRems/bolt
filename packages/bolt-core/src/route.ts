import { Parser, inferParser } from './parsing';
import { RestMethod } from './types';

export interface RouteSettings {
  validateQuery?: boolean;
  validateBody?: boolean;
  validateParams?: boolean;
  validateResponse?: boolean;
  fastifyConfig?: Record<string, any>;
  fastifyOptions?: Record<string, any>;
}

export interface RouteConfigTypes {
  headers_in: unknown;
  headers_out: unknown;
  query_in: unknown;
  query_out: unknown;
  params_in: unknown;
  params_out: unknown;
  body_in: unknown;
  body_out: unknown;
  output_in: unknown;
  output_out: unknown;
}

export interface RouteParams<
  T extends RouteConfigTypes = RouteConfigTypes,
  N extends string = string,
  M extends RestMethod = RestMethod,
  C extends RouteSettings = RouteSettings
> {
  _path: N;
  _method: M;
  _settings: C;

  _headers_in: T['headers_in'];
  _headers_out: T['headers_out'];
  _query_in: T['query_in'];
  _query_out: T['query_out'];
  _params_in: T['params_in'];
  _params_out: T['params_out'];
  _body_in: T['body_in'];
  _body_out: T['body_out'];
  _output_in: T['output_in'];
  _output_out: T['output_out'];
}

export type RouteBuilderDef<TParams extends RouteParams> = {
  path?: string;
  method?: RestMethod;
  settings?: RouteSettings;
  headers?: Parser;
  query?: Parser;
  params?: Parser;
  body?: Parser;
  output?: Parser;
};

export type AnyRouteBuilderDef = RouteBuilderDef<any>;

export interface RouteBuilder<TParams extends RouteParams> {
  _def: RouteBuilderDef<TParams>;

  path<N extends string>(
    path: N
  ): RouteBuilder<{
    _path: N;
    _method: TParams['_method'];
    _settings: TParams['_settings'];
    _headers_in: TParams['_headers_in'];
    _headers_out: TParams['_headers_out'];
    _query_in: TParams['_query_in'];
    _query_out: TParams['_query_out'];
    _params_in: TParams['_params_in'];
    _params_out: TParams['_params_out'];
    _body_in: TParams['_body_in'];
    _body_out: TParams['_body_out'];
    _output_in: TParams['_output_in'];
    _output_out: TParams['_output_out'];
  }>;

  method<M extends RestMethod>(
    path: M
  ): RouteBuilder<{
    _path: TParams['_path'];
    _method: M;
    _settings: TParams['_settings'];
    _headers_in: TParams['_headers_in'];
    _headers_out: TParams['_headers_out'];
    _query_in: TParams['_query_in'];
    _query_out: TParams['_query_out'];
    _params_in: TParams['_params_in'];
    _params_out: TParams['_params_out'];
    _body_in: TParams['_body_in'];
    _body_out: TParams['_body_out'];
    _output_in: TParams['_output_in'];
    _output_out: TParams['_output_out'];
  }>;

  settings<C extends RouteSettings>(
    settings: C
  ): RouteBuilder<{
    _path: TParams['_path'];
    _method: TParams['_method'];
    _settings: C;
    _headers_in: TParams['_headers_in'];
    _headers_out: TParams['_headers_out'];
    _query_in: TParams['_query_in'];
    _query_out: TParams['_query_out'];
    _params_in: TParams['_params_in'];
    _params_out: TParams['_params_out'];
    _body_in: TParams['_body_in'];
    _body_out: TParams['_body_out'];
    _output_in: TParams['_output_in'];
    _output_out: TParams['_output_out'];
  }>;

  headers<$Parser extends Parser>(
    parser: $Parser
  ): RouteBuilder<{
    _path: TParams['_path'];
    _method: TParams['_method'];
    _settings: TParams['_settings'];
    _headers_in: inferParser<$Parser>['in'];
    _headers_out: inferParser<$Parser>['out'];
    _query_in: TParams['_query_in'];
    _query_out: TParams['_query_out'];
    _params_in: TParams['_params_in'];
    _params_out: TParams['_params_out'];
    _body_in: TParams['_body_in'];
    _body_out: TParams['_body_out'];
    _output_in: TParams['_output_in'];
    _output_out: TParams['_output_out'];
  }>;

  query<$Parser extends Parser>(
    parser: $Parser
  ): RouteBuilder<{
    _path: TParams['_path'];
    _method: TParams['_method'];
    _settings: TParams['_settings'];
    _headers_in: TParams['_headers_in'];
    _headers_out: TParams['_headers_out'];
    _query_in: inferParser<$Parser>['in'];
    _query_out: inferParser<$Parser>['out'];
    _params_in: TParams['_params_in'];
    _params_out: TParams['_params_out'];
    _body_in: TParams['_body_in'];
    _body_out: TParams['_body_out'];
    _output_in: TParams['_output_in'];
    _output_out: TParams['_output_out'];
  }>;

  params<$Parser extends Parser>(
    parser: $Parser
  ): RouteBuilder<{
    _path: TParams['_path'];
    _method: TParams['_method'];
    _settings: TParams['_settings'];
    _headers_in: TParams['_headers_in'];
    _headers_out: TParams['_headers_out'];
    _query_in: TParams['_query_in'];
    _query_out: TParams['_query_out'];
    _params_in: inferParser<$Parser>['in'];
    _params_out: inferParser<$Parser>['out'];
    _body_in: TParams['_body_in'];
    _body_out: TParams['_body_out'];
    _output_in: TParams['_output_in'];
    _output_out: TParams['_output_out'];
  }>;

  body<$Parser extends Parser>(
    parser: $Parser
  ): RouteBuilder<{
    _path: TParams['_path'];
    _method: TParams['_method'];
    _settings: TParams['_settings'];
    _headers_in: TParams['_headers_in'];
    _headers_out: TParams['_headers_out'];
    _query_in: TParams['_query_in'];
    _query_out: TParams['_query_out'];
    _params_in: TParams['_params_in'];
    _params_out: TParams['_params_out'];
    _body_in: inferParser<$Parser>['in'];
    _body_out: inferParser<$Parser>['out'];
    _output_in: TParams['_output_in'];
    _output_out: TParams['_output_out'];
  }>;

  output<$Parser extends Parser>(
    parser: $Parser
  ): RouteBuilder<{
    _path: TParams['_path'];
    _method: TParams['_method'];
    _settings: TParams['_settings'];
    _headers_in: TParams['_headers_in'];
    _headers_out: TParams['_headers_out'];
    _query_in: TParams['_query_in'];
    _query_out: TParams['_query_out'];
    _params_in: TParams['_params_in'];
    _params_out: TParams['_params_out'];
    _body_in: TParams['_body_in'];
    _body_out: TParams['_body_out'];
    _output_in: inferParser<$Parser>['in'];
    _output_out: inferParser<$Parser>['out'];
  }>;
}

export type AnyRouteBuilder = RouteBuilder<RouteParams>;

function createNewBuilder(d1: AnyRouteBuilderDef, d2: Partial<AnyRouteBuilderDef>) {
  return createBuilder({
    ...d1,
    ...d2,
  });
}

export function createBuilder<TParams extends RouteParams>(init: RouteBuilderDef<TParams>): RouteBuilder<TParams> {
  const _def: AnyRouteBuilderDef = {
    ...init,
    settings: init.settings ?? {
      validateBody: true,
      validateParams: true,
      validateQuery: true,
      validateResponse: true,
    },
  };

  return {
    _def,

    path(path) {
      return createNewBuilder(_def, { path });
    },

    method(method) {
      return createNewBuilder(_def, { method });
    },

    settings(settings) {
      return createNewBuilder(_def, { settings });
    },

    headers(parser) {
      return createNewBuilder(_def, { headers: parser });
    },

    query(parser) {
      return createNewBuilder(_def, { query: parser });
    },

    params(parser) {
      return createNewBuilder(_def, { params: parser });
    },

    body(parser) {
      return createNewBuilder(_def, { body: parser });
    },

    output(parser) {
      return createNewBuilder(_def, { output: parser });
    },
  };
}

export function route<TParams extends RouteParams, N extends string>(
  path: N
): RouteBuilder<{
  _path: N;
  _method: TParams['_method'];
  _settings: TParams['_settings'];
  _headers_in: TParams['_headers_in'];
  _headers_out: TParams['_headers_out'];
  _query_in: TParams['_query_in'];
  _query_out: TParams['_query_out'];
  _params_in: TParams['_params_in'];
  _params_out: TParams['_params_out'];
  _body_in: TParams['_body_in'];
  _body_out: TParams['_body_out'];
  _output_in: TParams['_output_in'];
  _output_out: TParams['_output_out'];
}> {
  const builder = createBuilder<TParams>({});
  return builder.path(path);
}

export type AnyRoute = AnyRouteBuilder;

/**
 * Custom "route" function maker that prefixes all routes with a given string.
 * @param prefix the prefix to add to all routes
 * @returns a function that creates routes with the given prefix
 */
export function prefixer<P extends string>(prefix: P) {
  const fn = <TParams extends RouteParams, N extends string>(path: N) => {
    const builder = route<TParams, `${P}${N}`>(path as `${P}${N}`);
    return builder.path(`${prefix}${path}`).method('GET');
  };
  fn.get = <TParams extends RouteParams, N extends string>(path: N) => {
    const builder = route<TParams, `${P}${N}`>(path as `${P}${N}`);
    return builder.path(`${prefix}${path}`).method('GET');
  }
  fn.post = <TParams extends RouteParams, N extends string>(path: N) => {
    const builder = route<TParams, `${P}${N}`>(path as `${P}${N}`);
    return builder.path(`${prefix}${path}`).method('POST');
  }
  fn.patch = <TParams extends RouteParams, N extends string>(path: N) => {
    const builder = route<TParams, `${P}${N}`>(path as `${P}${N}`);
    return builder.path(`${prefix}${path}`).method('PATCH');
  }
  fn.put = <TParams extends RouteParams, N extends string>(path: N) => {
    const builder = route<TParams, `${P}${N}`>(path as `${P}${N}`);
    return builder.path(`${prefix}${path}`).method('PUT');
  }
  fn.delete = <TParams extends RouteParams, N extends string>(path: N) => {
    const builder = route<TParams, `${P}${N}`>(path as `${P}${N}`);
    return builder.path(`${prefix}${path}`).method('DELETE');
  }
  return fn;
}
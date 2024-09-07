import { RouteParams } from './route';
import { UnsetMarker } from './types';

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

export type IMappedOptions<TParams extends RouteParams> = IParams<TParams> & IQuery<TParams> & IBody<TParams>;
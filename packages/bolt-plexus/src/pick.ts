import { RouteParams } from '@bolt-ts/core';
import { IOutput, PlexusMappedRoute } from '.';

// todo: add support for array picking

export function pick <T extends RouteParams, F = Array<keyof IOutput<T>>> (route: PlexusMappedRoute<T>, fields: F): PlexusMappedRoute<T> {
  return async (params: Parameters<PlexusMappedRoute<T>>[0]) => {
    return route({
      ...params,
      headers: {
        ...params.headers,
        'x-bolt-pick': JSON.stringify(fields)
      }
    });
  }
}
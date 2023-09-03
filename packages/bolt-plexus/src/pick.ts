import { PlexusMappedRoute } from '.';

export function pick <T extends PlexusMappedRoute<any>, F = Partial<Awaited<ReturnType<T>>['data']>> (route: T, fields: F): T {
  // @ts-ignore
  return async (params: Parameters<T>[0]) => {
    return route({
      ...params,
      headers: {
        ...params.headers,
        'x-bolt-pick': JSON.stringify(fields)
      }
    });
  }
}
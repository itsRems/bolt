---
sidebar_position: 1
description: Learn how to define routes in Bolt
---

# Routes

Routes are the core resource of Bolt.

They define the endpoints that your API will expose, as well as the input and output schemas for each endpoint.

## Defining a route

To define a route, you'll need to use the `route` function from the `@bolt-ts/core` package. This function takes a single argument, which is the path of the route. The path can only be an absolute* string.

_*: To help define routes in large projects, see [prefixers](/docs/basics/route#prefixers)._

```typescript
import { route } from '@bolt-ts/core';

const myRoute = route('/hello');
```

## Defining input and output schemas

Once you've defined a route, you can define the input and output schemas for the route. These schemas are used to validate, serialize and type the input and output of the route.

### Input schemas

Input schemas are used to validate the input of the route. They are defined using the `body` method of the route.

```typescript
import { route } from '@bolt-ts/core';
import { z } from 'zod';

const myRoute = route('/hello')
  .body(z.object({
    name: z.string()
  }))
```

### Output schemas

Output schemas are used to validate the output of the route. They are defined using the `output` method of the route.

```typescript
import { route } from '@bolt-ts/core';
import { z } from 'zod';

const myRoute = route('/hello')
  .output(z.object({
    message: z.string()
  }))
```

## HTTP methods

By default, routes are defined as `GET` requests.

You can change the HTTP method of a route using the `method` method of the builder, or by using `route.<method>()`.

> With `.method()`
> ```typescript
> import { route } from '@bolt-ts/core';
> 
> const myRoute = route('/hello')
>   .method('POST')
> ```

> With `route.<method>()`
> ```typescript
> import { route } from '@bolt-ts/core';
> 
> const myRoute = route.post('/hello')
> ```

## Headers

You can also add a schema to the headers of a route using the `headers` method of the builder.

```typescript
import { route } from '@bolt-ts/core';
import { z } from 'zod';

const myRoute = route('/hello')
  .headers(z.object({
    'x-api-key': z.string()
  }))
```

## Query parameters

```typescript
import { route } from '@bolt-ts/core';
import { z } from 'zod';

const myRoute = route('/hello')
  .query(z.object({
    name: z.string()
  }))
```

## Params

```typescript
import { route } from '@bolt-ts/core';
import { z } from 'zod';

const myRoute = route('/hello/:name')
  .params(z.object({
    name: z.string()
  }))
```

# Query encoding

**See [query encoding](/docs/advanced/query-encoding)**

# Prefixers

Prefixers are a way to create routes under the same base path, without having to define the full path for each route.

For example, if you want to create a route at `/hello/world` and another at `/hello/planet`, you can use a prefixer to define the base path `/hello`.

```typescript
import { prefixer } from '@bolt-ts/core';

// It is recommended to use `route` to keep things organized
const route = prefixer('/hello');

const myRoute = route('/world');
const anotherRoute = route('/planet');
```

This will create two routes at `/hello/world` and `/hello/planet`.
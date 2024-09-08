---
sidebar_position: 1
description: Learn how bolt handles query strings
---

# Query encoding

Bolt ships out of the box with support for two query encoding strategies:

encoder | description | example
--- | --- | ---
`string-indexed-keys` | This is the default encoding strategy used by Bolt. It uses bracket notation to encode nested objects and arrays. | `{ foo: { bar: 'baz' } }` => `foo[bar]=baz`
`string-repeated-keys` | This encoding strategy is useful when you want to encode arrays as query parameters. | `{ foo: ['bar', 'baz'] }` => `foo=bar&foo=baz`


You can specify the encoding strategy when defining your routes:

```typescript
import { route } from '@bolt-ts/core';

const myRoute = route('/hello')
  // Define the input body schema
  .body(z.object({
    name: z.string()
  }))
  // Define the output body schema
  .output(z.object({
    message: z.string()
  }))
  // Specify the query encoding strategy
  .settings({
    queryEncoder: 'string-repeated-keys'
  });
```
# Bolt TS - Modular, typed REST API framework for NodeJS

[![npm version](https://badge.fury.io/js/@bolt-ts%2Fcore.svg)](https://badge.fury.io/js/@bolt-ts%2Fcore)
![npm monthly downloads](https://img.shields.io/npm/dw/@bolt-ts/core?style=flat)
![npm total downloads](https://img.shields.io/npm/dt/@bolt-ts/core?style=flat)
![bundle size](https://img.shields.io/bundlephobia/min/@bolt-ts/core?style=flat)

> Bolt is in early development. Expect breaking changes until v1.0.0, and use at your own risk.

# Getting started

📖 **[Documentation](https://bolt-ts.org)** (new 🥳)

## Installation

> Core (required)
```bash
yarn add @bolt-ts/core
```

> Fastify (you'll need at least one server implementation)
```bash
yarn add @bolt-ts/fastify
```

> Plexus (you'll need at least one client implementation)
```bash
yarn add @bolt-ts/plexus @plexusjs/napi
```

## Basic usage

First, you'll need to define some routes. Bolt uses a simple route definition format:

```typescript
import { route } from '@bolt-ts/core';
// We're using zod, but you can use other validation/serialization libraries, as long as they're compatible with bolt
import { z } from 'zod';

const myRoute = route('/hello')
  // Define the input body schema
  .body(z.object({
    name: z.string()
  }))
  // Define the output body schema
  .output(z.object({
    message: z.string()
  }))

// Other methods include:
// .method()
// .headers()
// .query()
// .params()
```

Once you've defined your routes, you'll need to create a server. Bolt uses a modular server implementation, so you can use any server implementation you want. For this example, we'll use Fastify, which we primarily support.

```typescript
import { BoltServer } from '@bolt-ts/fastify';
import fastify from 'fastify';

const app = fastify();

const server = new BoltServer({ myRoute }, app);

// Now we can define our route handlers
server.registerHandlers({
  myRoute: async (req, res) => {
    return {
      message: `Hello ${req.body.name}!`
    }
  }
});

// This will attach all bolt routes to the fastify server
server.attachRoutes();

// You can now start the server
app.listen({
  port: 3000,
});
```

Now that we have a server running, we can make requests to it. Just like for the backend, we use a modular client implementation. For this example, we'll use our [Plexus API](https://plexusjs.org/docs/plexus-api/usage) wrapper.

```typescript
import { createPlexusRouter } from '@bolt-ts/plexus';
import { api } from '@bolt-ts/napi';

const client = api('http://localhost:3000')

const router = createPlexusRouter({ myRoute }, client);

// Now we can make requests to the server
const response = await router.myRoute({
  body: {
    name: 'Nico'
  }
});

console.log(response.message); // Hello Nico!
```

# Advanced usage

## Modules

When working with large projects, it can be useful to split your routers into multiple modules or even separate packages. Bolt provides a `BoltModule` class that can be used to create modules that can be attached to a BoltServer.

#### Detached modules

Detached modules are the most modular way to use Bolt. They can be used to create standalone modules that can separately be attached to a BoltServer.

Here's an example of what using detached modules might look like:

```typescript
import { BoltServer, BoltModule, createRouter, route } from '@bolt-ts/fastify';
import { z } from 'zod';
import fastify from 'fastify';

// Sample router
const myRouter = createRouter({
  myRoute: route.post('/hello')
    .body(z.object({
      name: z.string()
    }))
    .output(z.object({
      message: z.string()
    }))
})

const app = fastify();

const boltServer = new BoltServer(app);

// Create a module
const myModule = new BoltModule(myRouter, server);

// We can now add handlers to the module
myModule.registerHandlers({
  myRoute: async (req, res) => {
    return {
      message: `Hello ${req.body.name}!`
    }
  }
});

// Attach the module to the server
server.addDetachedModule(myModule);

async function start() {
  // Attach the bolt routes to the fastify server
  boltServer.attachRoutes();

  // Start the server
  await app.listen({
    port: 3000,
  });
}

start();
```

#### "Attached" modules

You can also skip creating a standalone module by adding a module directly to a BoltServer. This is useful for smaller projects where you want to keep your modules together.

Here's an example of what using attached modules might look like:

```typescript
import { BoltServer, createRouter, route } from '@bolt-ts/fastify';
import { z } from 'zod';
import fastify from 'fastify';

// Sample router
const myRouter = createRouter({
  myRoute: route.post('/hello')
    .body(z.object({
      name: z.string()
    }))
    .output(z.object({
      message: z.string()
    }))
})

const app = fastify();

const boltServer = new BoltServer(app);

// Create a module
const myModule = boltServer.addModule(myRouter);

// We can now add handlers to the module
myModule.registerHandlers({
  myRoute: async (req, res) => {
    return {
      message: `Hello ${req.body.name}!`
    }
  }
});

// Attach the module to the server
server.addDetachedModule(myModule);

async function start() {
  // Attach the bolt routes to the fastify server
  boltServer.attachRoutes();

  // Start the server
  await app.listen({
    port: 3000,
  });
}

start();
```


In the real world, you'd probably have a file/package per router/module.
 
📝 For extremely large projects, I recommend using a dedicated package per router, as well as a dedicated module package to register your handlers.

## Query encoding

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

## Alternatives

- [TS-Rest](https://ts-rest.com/)


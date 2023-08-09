# Bolt TS - Modular, typed REST API framework for NodeJS

[![npm version](https://badge.fury.io/js/@bolt-ts%2Fcore.svg)](https://badge.fury.io/js/@bolt-ts%2Fcore)
![npm monthly downloads](https://img.shields.io/npm/dw/@bolt-ts/core?style=flat)
![npm total downloads](https://img.shields.io/npm/dt/@bolt-ts/core?style=flat)
![bundle size](https://img.shields.io/bundlephobia/min/@bolt-ts/core?style=flat)

# Getting started

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
yarn add @bolt-ts/plexus
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


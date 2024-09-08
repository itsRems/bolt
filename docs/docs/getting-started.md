---
sidebar_position: 1
---

# Getting Started

Learn how to get a basic bolt app up and running.

## Prerequisites

- Node.js version 18.0 or higher
- Your favorite package manager (we use [yarn](https://yarnpkg.com))

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

### Defining routes

First, you'll need to define some routes. Bolt uses a simple, function-chaining route definition format:

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

### Setting up the server

Once you've defined your routes, you'll need to create a server. 
Bolt uses a modular server implementation, so you can use any server implementation you want.
For this example, we'll use Fastify, which we primarily support.

> :warning: We currently _only_ support Fastify as a server implementation. Support for express and other server implementations is coming soon.

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

### Setting up the client

Now that we have a server running, we can make requests to it. Just like for the backend, we use a modular client implementation. For this example, we'll use our [Plexus API](https://plexusjs.org/docs/plexus-api/usage) wrapper.

> :warning: We currently _only_ support Plexus as a client implementation. A `fetch` native client is on the immediate roadmap.

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
---
sidebar_position: 1
title: Modules
description: Make use of modules for large-scale projects
---

# Modules

Modules are a way to organize your server into smaller, more manageable pieces.

There are two types of modules:

- Detached modules
- Attached modules

## Detached modules

Detached modules are the most modular way to use Bolt.

They can be used to create standalone modules that can separately be attached to a BoltServer.

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

Of course, in a real-world project, you'd have different files/packages for routers/modules/servers/handlers.

## Attached modules

You can also skip creating a standalone module by adding a module directly to a BoltServer. This can be useful in smaller projects where you want to keep your modules in one package, but want to organize them into separate files.

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

## Notes
 
📝 For extremely large projects, we recommend using a dedicated package per router, as well as a dedicated module package to register your handlers.
The module package can then be imported and attached into your server.
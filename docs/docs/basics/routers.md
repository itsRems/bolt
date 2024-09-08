---
sidebar_position: 2
title: Routers
description: Organize your routes into routers
---

# Routers

Routers are used to organize your routes into logical groups.

They are defined using the `createRouter` function from the `@bolt-ts/core` package.

```typescript
import { createRouter, router } from '@bolt-ts/core';

const myRouter = createRouter({
  myRoute: route('/hello')
});
```

> :exclamation: At the core, routers are just typed objects.

You can then use the router to attach your routes to a server.

```typescript
import { BoltServer } from '@bolt-ts/fastify';
import fastify from 'fastify';

const app = fastify();

const server = new BoltServer(myRouter, app);

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